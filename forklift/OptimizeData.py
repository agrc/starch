#!/usr/bin/env python
# * coding: utf8 *
import arcpy
'''
OptimizeData.py
'''
from datetime import datetime

database = r'C:\forklift\data\production\broadband.gdb'
# database = r'\\Mac\Home\Documents\Projects\broadband\maps\Broadband\test.gdb'
original_provider_coverage = 'BB_Service'
provider_coverage_exploded = 'BB_Service_exploded'
provider_coverage_excluded = 'BB_Service_excluded'
provider_coverage_simplified_large_scale = 'BB_Service_simplified_large_scale'
provider_coverage_simplified_small_scale = 'BB_Service_simplified_small_scale'
partitions = 'partitions'
keep_fields = ['UTProvCode', 'TransTech', 'MAXADDOWN', 'MAXADUP']
layer_infos = [['Wireline', 'TransTech IN (10, 20, 30, 40, 41, 50)'],
               ['FixedWireless', 'TransTech IN (70, 71)'],
               ['Wireless', 'TransTech = 80']]

provider_coverage_layer = 'provider_coverage_layer'

start = datetime.now()
print(start)
with arcpy.EnvManager(workspace=database):
    for_cleanup = [
        provider_coverage_exploded,
        provider_coverage_excluded,
        provider_coverage_simplified_large_scale,
        provider_coverage_simplified_small_scale,
        partitions,
        'BB_Service_simplified_large_scale_Pnt',
        'BB_Service_simplified_small_scale_Pnt',
    ] + [name for name, _ in layer_infos]
    for cleanup in for_cleanup:
        if arcpy.Exists(cleanup):
            print(f'cleaning up {cleanup}')
            arcpy.Delete_management(cleanup)

    print('exploding')
    arcpy.MultipartToSinglepart_management(original_provider_coverage,
                                           provider_coverage_exploded)

    print('excluding features')
    arcpy.MakeFeatureLayer_management(provider_coverage_exploded,
                                      provider_coverage_layer,
                                      'TransTech <> 80 OR MAXADDOWN >= 14')
    arcpy.CopyFeatures_management(provider_coverage_layer,
                                  provider_coverage_excluded)

    print('deleting layer...')
    arcpy.Delete_management(provider_coverage_layer)

    print('creating partition layer...')
    arcpy.CreateCartographicPartitions_cartography(provider_coverage_excluded,
                                                   partitions,
                                                   partition_method='VERTICES')
    arcpy.env.cartographicPartitions = partitions

    print('simplifying large scale...')
    arcpy.SimplifyPolygon_cartography(provider_coverage_excluded,
                                      provider_coverage_simplified_large_scale,
                                      tolerance='5 Meters')
    print('simplifying small scale...')
    arcpy.SimplifyPolygon_cartography(provider_coverage_excluded,
                                      provider_coverage_simplified_small_scale,
                                      tolerance='250 Meters')

    for tech_type, query in layer_infos:
        for scale in ['large_scale', 'small_scale']:
            name = f'{tech_type}_{scale}'
            print(f'exporting {name}')
            layer = arcpy.MakeFeatureLayer_management(
                f'BB_Service_simplified_{scale}', f'{name}_layer', query)
            arcpy.CopyFeatures_management(layer, name)
            arcpy.Delete_management(layer)

print(datetime.now() - start)
