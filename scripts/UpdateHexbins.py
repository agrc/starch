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
hexagons = 'Hexagons'
analysis = 'JoinedHexagons'
dissolved = 'Dissolved'
keep_fields = ['UTProvCode', 'TransTech', 'MAXADDOWN', 'MAXADUP']
layer_infos = [['Wireline', 'TransTech IN (10, 20, 30, 40, 41, 50)'],
               ['FixedWireless', 'TransTech IN (70, 71)'],
               ['MobileWireless', 'TransTech = 80']]

with arcpy.EnvManager(workspace=database):
    for fc_delete in [analysis, dissolved] + [layer[0] for layer in layer_infos]:
        if arcpy.Exists(fc_delete):
            print(f'deleting {fc_delete}')
            arcpy.management.Delete(fc_delete)

    temp_field_mappings = arcpy.FieldMappings()
    field_mappings = arcpy.FieldMappings()
    temp_field_mappings.addTable(provider_coverage)
    for field_map in temp_field_mappings.fieldMappings:
        if field_map.outputField.name in keep_fields:
            field_mappings.addFieldMap(field_map)

    print('running analysis...')
    arcpy.analysis.SpatialJoin(hexagons, provider_coverage, analysis,
                               'JOIN_ONE_TO_MANY', 'KEEP_COMMON', field_mappings)

    print('removing duplicates...')
    arcpy.management.DeleteIdentical(analysis, ['SHAPE'] + keep_fields)

    print('dissolving...')
    arcpy.management.Dissolve(analysis, dissolved, keep_fields, None, 'SINGLE_PART')

    for fc_name, query in layer_infos:
        print(f'exporting {fc_name}')
        layer = arcpy.management.MakeFeatureLayer(dissolved, f'{fc_name}_layer', query)
        arcpy.management.CopyFeatures(layer, fc_name)
