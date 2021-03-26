#!/usr/bin/env python
# * coding: utf8 *
import arcpy

'''
UpdateHexbinsTable.py

Updates the data in the ProviderCoverage table from the BB_Service feature class
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
sizes = ['50K', '400K', '3200K']
hexagons_prefix = 'Hexagons'
analysis_prefix = 'JoinedHexagons'
dissolved_prefix = 'Dissolved'
keep_fields = ['UTProvCode', 'TransTech', 'MAXADDOWN', 'MAXADUP']
layer_infos = [['Wireline', 'TransTech IN (10, 20, 30, 40, 41, 50)'],
               ['FixedWireless', 'TransTech IN (70, 71)'],
               ['Wireless', 'TransTech = 80']]
spatial_search_radius = {
    #: ~ 5% of the width of the hexagon
    '50K': '-14 meters',
    '400K': '-40 meters',
    '3200K': '-110 meters'
}

provider_coverage_layer = 'provider_coverage_layer'

start = datetime.now()
print(start)
with arcpy.EnvManager(workspace=database):
    for cleanup in [
            provider_coverage_exploded,
            provider_coverage_excluded,
            provider_coverage_simplified_large_scale,
            provider_coverage_simplified_small_scale,
            partitions,
            'BB_Service_simplified_large_scale_Pnt',
            'BB_Service_simplified_small_scale_Pnt',
    ]:
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

    print('simplifying...')
    arcpy.SimplifyPolygon_cartography(provider_coverage_excluded,
                                      provider_coverage_simplified_large_scale,
                                      tolerance='5 Meters')
    arcpy.SimplifyPolygon_cartography(provider_coverage_excluded,
                                      provider_coverage_simplified_small_scale,
                                      tolerance='100 Meters')

    # for size in sizes:
    #     analysis = f'{analysis_prefix}{size}'
    #     dissolved = f'{dissolved_prefix}{size}'
    #     hexagons = f'{hexagons_prefix}{size}'

    #     for fc_delete in [analysis, dissolved] + [f'{layer[0]}{size}' for layer in layer_infos]:
    #         if arcpy.Exists(fc_delete):
    #             print(f'deleting {fc_delete}')
    #             arcpy.Delete_management(fc_delete)

    #     temp_field_mappings = arcpy.FieldMappings()
    #     field_mappings = arcpy.FieldMappings()
    #     temp_field_mappings.addTable(provider_coverage_excluded)
    #     for field_map in temp_field_mappings.fieldMappings:
    #         if field_map.outputField.name in keep_fields:
    #             field_mappings.addFieldMap(field_map)

    #     print('running analysis...')
    #     arcpy.SpatialJoin_analysis(hexagons, provider_coverage_excluded, analysis,
    #                                'JOIN_ONE_TO_MANY', 'KEEP_COMMON', field_mappings,
    #                                search_radius=spatial_search_radius[size])

    #     print('removing duplicates...')
    #     arcpy.DeleteIdentical_management(analysis, ['SHAPE'] + keep_fields)

    #     print('dissolving...')
    #     arcpy.Dissolve_management(analysis, dissolved, keep_fields, None, 'SINGLE_PART')

    #     for fc_name_prefix, query in layer_infos:
    #         fc_name = f'{fc_name_prefix}{size}'
    #         print(f'exporting {fc_name}')
    #         layer = arcpy.MakeFeatureLayer_management(dissolved, f'{fc_name}_layer', query)
    #         arcpy.CopyFeatures_management(layer, fc_name)
    #         arcpy.Delete_management(layer)
print(datetime.now() - start)
