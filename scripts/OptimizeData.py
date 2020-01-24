#!/usr/bin/env python
# * coding: utf8 *
'''
OptimizeData.py
Performs operations intended to optimize the data for consumption by the web application.
'''
from os.path import join

import arcpy

layer_infos = [['Wireline', 'TransTech IN (10, 20, 30, 40, 41, 50)'],
               ['FixedWireless', 'TransTech IN (70, 71)'],
               ['MobileWireless', 'TransTech = 80']]

database = r'C:\forklift\data\production\broadband.gdb'
provider_coverage = 'BB_Service'
dissolved = f'{provider_coverage}_DissolveBoundaries'
simplified = f'{provider_coverage}_Simplified'
# partitions = join(database, f'{provider_coverage}_CartographicPartitions')

with arcpy.EnvManager(workspace=database):
    for feature_class in [dissolved, simplified] + [name for name, _ in layer_infos]:
        if arcpy.Exists(feature_class):
            print(f'deleting {feature_class}')
            arcpy.management.Delete(feature_class)

    print('simplifying')
    arcpy.cartography.SimplifyPolygon(provider_coverage, simplified, 'POINT_REMOVE',
                                      '100 Meters', collapsed_point_option='NO_KEEP')

    print('dissolving')
    arcpy.gapro.DissolveBoundaries(simplified, dissolved, 'SINGLE_PART',
                                    'DISSOLVE_FIELDS',
                                    'UTProvCode;TransTech;MAXADDOWN;MAXADUP')
    for fc_name, query in layer_infos:
        print(f'exporting {fc_name}')
        layer = arcpy.management.MakeFeatureLayer(dissolved,
                                                    f'{fc_name}_layer', query)
        arcpy.management.CopyFeatures(layer, fc_name)
