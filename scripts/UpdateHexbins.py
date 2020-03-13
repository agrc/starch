#!/usr/bin/env python
# * coding: utf8 *
'''
UpdateHexbinsTable.py

Updates the data in the ProviderCoverage table from the BB_Service feature class
'''
from os.path import join

import arcpy

database = r'C:\forklift\data\production\broadband.gdb'
# database = r'\\Mac\Home\Documents\Projects\broadband\maps\Broadband\test.gdb'
provider_coverage = 'BB_Service'
scales = ['50K', '400K', '3200K']
hexagons_prefix = 'Hexagons'
analysis_prefix = 'JoinedHexagons'
dissolved_prefix = 'Dissolved'
keep_fields = ['UTProvCode', 'TransTech', 'MAXADDOWN', 'MAXADUP']
layer_infos = [['Wireline', 'TransTech IN (10, 20, 30, 40, 41, 50)'],
               ['FixedWireless', 'TransTech IN (70, 71)']]
spatial_search_radius = '-250 meters'
provider_coverage_layer = 'provider_coverage_layer'

with arcpy.EnvManager(workspace=database):
    for scale in scales:
        analysis = f'{analysis_prefix}{scale}'
        dissolved = f'{dissolved_prefix}{scale}'
        hexagons = f'{hexagons_prefix}{scale}'

        for fc_delete in [analysis, dissolved] + [f'{layer[0]}{scale}' for layer in layer_infos]:
            if arcpy.Exists(fc_delete):
                print(f'deleting {fc_delete}')
                arcpy.management.Delete(fc_delete)

        temp_field_mappings = arcpy.FieldMappings()
        field_mappings = arcpy.FieldMappings()
        temp_field_mappings.addTable(provider_coverage)
        for field_map in temp_field_mappings.fieldMappings:
            if field_map.outputField.name in keep_fields:
                field_mappings.addFieldMap(field_map)

        print('creating layer...')
        arcpy.management.MakeFeatureLayer(provider_coverage, provider_coverage_layer, 'TransTech <> 80')

        print('running analysis...')
        arcpy.analysis.SpatialJoin(hexagons, provider_coverage_layer, analysis,
                                'JOIN_ONE_TO_MANY', 'KEEP_COMMON', field_mappings, search_radius=spatial_search_radius)

        print('removing duplicates...')
        arcpy.management.DeleteIdentical(analysis, ['SHAPE'] + keep_fields)

        print('dissolving...')
        arcpy.management.Dissolve(analysis, dissolved, keep_fields, None, 'SINGLE_PART')

        for fc_name_prefix, query in layer_infos:
            fc_name = f'{fc_name_prefix}{scale}'
            print(f'exporting {fc_name}')
            layer = arcpy.management.MakeFeatureLayer(dissolved, f'{fc_name}_layer', query)
            arcpy.management.CopyFeatures(layer, fc_name)
            arcpy.management.Delete(layer)

        print('deleting layer...')
        arcpy.management.Delete(provider_coverage_layer)
