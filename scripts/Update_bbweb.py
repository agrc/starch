# Check UBBMAP sde data for errors 
# and update bbweb if there aren't any.
# Scheduled to run from the server.
#
# Scott Davis | stdavis@utah.gov
# 4-14-11

import arcpy
from agrc import logging, email

# create new tools object
logger = logging.Logger()
emailer = email.Emailer('stdavis@utah.gov', True)

# variables
pathToSDE = r"C:\PythonScripts\DatabaseConnections\UBBMAP.sde"
pathToFGD = r"C:\MapData\Broadband.gdb"
fltr = "Provider_Type = 1 AND NOT (UTProvCode IN ('Strata'))"
fltr_wireless = "TRANSTECH <> 60"
fcs = [
       ['UBBMAP.UBBADMIN.BB_Service_Buffered_Road', fltr, 'BB_Service_Buffered_RoadSegment'],
       ['UBBMAP.UBBADMIN.BB_Service_CensusBlock', fltr, 'BB_Service_CensusBlocks'],
       ['UBBMAP.UBBADMIN.BB_Service_Wireless', fltr_wireless, 'BB_Service_Wireless'],
       ['UBBMAP.UBBADMIN.BB_SpecialCoverage_Polygons_new', "1 = 1", 'BB_Service_CensusBlocks_Append']
       ]
coverageFieldName = "UTProvCode"
providerTableName = "UBBMAP.UBBADMIN.BB_Providers_Table"
providerTableFieldName = "Code"
coverageProviders = [] # list to hold all providers in coverage data
tableProviders = [] # list of all providers in providers table
nonNullFields = [
                 '"' + coverageFieldName + '" IS NULL OR "' + coverageFieldName + '" = \'\'',
                 '"MAXADUP" IS NULL OR "MAXADUP" = \'\'',
                 '"MAXADDOWN" IS NULL OR "MAXADDOWN" = \'\'',
                 '"TRANSTECH" IS NULL OR "TRANSTECH" = 0'
                 ]
errors = []
mapServices = [
#               'Broadband/ProviderCoverage',
#               'Broadband/ProviderCoverageCached',
#               'Broadband/Basemaps'
               ]
caiFGD = r'BB_Service_CAInstitutions'
caiSDE = r'UBBMAP.UBBADMIN.BB_Service_CAInstitutions'

try:
    logger.logMsg('setting workspace to sde database')
    arcpy.env.workspace = pathToSDE
    
    # loop through coverage feature classes
    logger.logMsg('Looping through polygon feature classes')
    for fc in fcs:
        logger.logMsg(fc[0])
        
        logger.logMsg("checking non-null fields")
        
        # create layer for selecting
        logger.logMsg('creating layer')
        layerName = fc[0] + 'Layer'
        arcpy.MakeFeatureLayer_management(fc[0], layerName, fc[1]);
        logger.logGPMsg()
        
        # loop through fields
        for query in nonNullFields:
            logger.logMsg('query: ' + query)
            arcpy.SelectLayerByAttribute_management(layerName, 'NEW_SELECTION', query)
            logger.logGPMsg()
            cnt = arcpy.GetCount_management(layerName)
            logger.logGPMsg()
            
            if int(str(cnt)) > 0:
                errors.append('ERROR: null or empty values found in ' + fc[0] + ':' + query)
        
        # get search cursor
        logger.logMsg("building list of providers in coverage feature class")
        cur = arcpy.SearchCursor(fc[0], fc[1], "", coverageFieldName)
        row = cur.next()
        while row:
            code = row.getValue(coverageFieldName)
            
            # add to list of providers
            if not [code, fc[0]] in coverageProviders:
                coverageProviders.append([code, fc[0]])

            row = cur.next()
        del cur
        
        logger.logMsg("Finished with " + fc[0])
    
    # get cursor for provider table
    logger.logMsg("building list of providers in providers table")
    prows = arcpy.SearchCursor(providerTableName, "Exclude IS NULL")
    row = prows.next()
    while row:
        tableProviders.append(row.getValue(providerTableFieldName))

        row = prows.next()
    del prows, row
    
    # loop through coverage providers and make sure that they are in the provider table list
    logger.logMsg('looking for providers that show up in coverage data but not providers table')
    missingProviders = []
    for row in coverageProviders:
        if not row[0] in tableProviders:
            missingProviders.append(row)
    
    # check for data errors
    if len(errors) > 0:
        logger.logMsg("ERRORS IN DATA:")
        for e in errors:
            logger.logMsg(e)
    else:
        logger.logMsg("NO ERRORS IN DATA")
    
    # check for mis matching providers
    if len(missingProviders) > 0:
        logger.logMsg("MISSING PROVIDERS THAT ARE IN THE COVERAGE DATA BUT NOT IN THE PROVIDERS TABLE:")
        for mp in missingProviders:
            logger.logMsg(str(mp))
    else:
        logger.logMsg("NO PROVIDERS FOUND IN THE COVERAGE DATA THAT ARE NOT IN THE PROVIDERS TABLE.")
    
    # if errors, bail on script and send an email
    if len(missingProviders) > 0 or len(errors) > 0:
        logger.logMsg('Sending error email')
        emailer.sendEmail('Update_bbweb has found errors', logger.log)
    else:
        # delete all feature classes
        logger.logMsg('switching workspace to local filegeodatabase')
        arcpy.env.workspace = pathToFGD
        
        logger.logMsg('deleting all feature classes')
        fClasses = arcpy.ListFeatureClasses()
        for c in fClasses:
            arcpy.Delete_management(c)
            logger.logGPMsg()
        
        logger.logMsg('importing new feature classes')
        for f in fcs:
            if f[2] != "BB_Service_CensusBlocks_Append":
                arcpy.FeatureClassToFeatureClass_conversion(pathToSDE + '\\' + f[0], pathToFGD, f[2], f[1])
                logger.logMsg(f[0].split('.')[2] + ' copied successfully.')
            else:
                arcpy.Append_management(pathToSDE + '\\' + f[0], pathToFGD + '\\' + fcs[1][2], "NO_TEST")
                logger.logMsg(f[0].split('.')[2] + ' appended successfully.')
        
        # check to make sure that all features from special coverage polys got appended into census blocks
        sdeSpecialCoverageCount = int(arcpy.GetCount_management(pathToSDE + '\\' + fcs[3][0]).getOutput(0))
        logger.logMsg('sde special coverage: {}'.format(sdeSpecialCoverageCount))
        sdeCBLyr = arcpy.MakeFeatureLayer_management(pathToSDE + '\\' + fcs[1][0], 'sdeCBLyr', fcs[1][1])
        sdeCensusBlocksCount = int(arcpy.GetCount_management(sdeCBLyr).getOutput(0))
        logger.logMsg('sde census blocks: {}'.format(sdeCensusBlocksCount))
        fgdCensusBlocksCount = int(arcpy.GetCount_management(pathToFGD + '\\' + fcs[1][2]).getOutput(0))
        logger.logMsg('fgd census blocks: {}'.format(fgdCensusBlocksCount))
        sdeFeatures = sdeSpecialCoverageCount + sdeCensusBlocksCount 
        if sdeFeatures != fgdCensusBlocksCount:
            raise Exception("Not all special coverage features were appended to census blocks successfully! sdeFeatures: {}, fgdFeatures: {}".format(sdeFeatures, fgdCensusBlocksCount))
        
        # provider table
        arcpy.FeatureClassToFeatureClass_conversion(pathToSDE + '\\' + providerTableName, pathToFGD, providerTableName.split('.')[2])
        logger.logGPMsg()
        # cai layer
        arcpy.FeatureClassToFeatureClass_conversion(pathToSDE + '\\' + caiSDE, pathToFGD, caiFGD)
        logger.logGPMsg()
        
        emailer.sendEmail('Update_bbweb.py has run successfully', "Don't forgot to rebuild the Broadband Cache")
        
except arcpy.ExecuteError:
    logger.logMsg('arcpy.ExecuteError')
    logger.logError()
    logger.logGPMsg()     
    emailer.sendEmail(logger.scriptName + ' - arcpy.ExecuteError', logger.log)
 
except:
    logger.logError()
    emailer.sendEmail(logger.scriptName + ' - Python Error', logger.log)

raw_input("\ndone. Press Enter to exit...")
