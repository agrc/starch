const del = require('del');
const yazl = require('yazl');
const globby = require('globby');
const fs = require('fs');
const Client = require('ssh2').Client;

const localDeployDir = './deploy';
const buildDir = './build';
const zipFileName = 'deploy.zip';
const deployZipFile = `${localDeployDir}/${zipFileName}`;
const deployDirectoryName = process.argv[2];
if (!deployDirectoryName) {
  throw new Error('You must provide a deploy directory name!');
}
const remoteDeployDir = `wwwroot/${deployDirectoryName}`;

(async () => {
  if (!fs.existsSync(localDeployDir)) {
    fs.mkdirSync(localDeployDir);
  }

  console.log('cleaning up any previous deployments...');
  await del(`${localDeployDir}/**`);

  console.log('zipping deployment...');
  const paths = await globby([`${buildDir}/**/*.*`]);
  const zipFile = new yazl.ZipFile();
  paths.forEach(path => zipFile.addFile(path, path.slice(buildDir.length + 1)));
  zipFile.outputStream.pipe(fs.createWriteStream(deployZipFile))
    .on('close', () => upload());
  zipFile.end();
})();

function getSSHClient() {
  // cannot use the same connection for sftp() and exec() ¯\_(ツ)_/¯
  const connection = new Client();
  connection.connect({
    host: process.env.SSH_HOST,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD
  });

  return connection;
}

function upload() {
  console.log('copying deployment to server...');

  const connection = getSSHClient();
  connection.on('ready', () => {
    connection.sftp((err, sftp) => {
      if (err) throw err;

      const readStream = fs.createReadStream(deployZipFile);
      const writeStream = sftp.createWriteStream(`${remoteDeployDir}/${zipFileName}`);

      writeStream.on('close', () => unzip());

      readStream.pipe(writeStream);
    });
  });
};

function unzip() {
  console.log('unzipping deployment on server...');

  const connection = getSSHClient();
  connection.on('ready', () => {
    const command = `cd ${remoteDeployDir} ; unzip -oq ${zipFileName} ; rm ${zipFileName}`;
    connection.exec(command, ((err, stream) => {
      if (err) throw err;
      stream
        .on('close', (code, signal) => {
          if (code !== 0) {
            console.error(`Error with ssh exec! code: ${code}, signal: ${signal}`);
          }
          connection.end();
          process.exit();
        })
        .on('data', (data) => {
          console.log('STDOUT: ' + data)
        })
        .stderr.on('data', (data) => {
          console.log('STDERR: ' + data)
        })
      ;
    }));
  });
};
