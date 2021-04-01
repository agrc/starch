import throttle from 'lodash.throttle';

const key = 'broadband:map-extent';
let wired = false;

export default function persistMapExtent(mapView) {
  if (mapView && !wired) {
    mapView.watch(
      'extent',
      throttle(() => {
        localStorage.setItem(key, JSON.stringify(mapView.extent));
      }, 1000)
    );

    wired = true;
  }

  const item = localStorage.getItem(key);

  if (item) {
    return JSON.parse(item);
  }
}
