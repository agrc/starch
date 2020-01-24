#!/usr/bin/env python
# * coding: utf8 *
'''
UpdateVectorTiles.py

Builds a new vector tiles package file and updates the AGOL service with it.
'''
import arcpy
import arcgis
from sys import argv

tile_package = r'C:\forklift\data\production\ProviderCoverage_temp.vtpk'
project_file = r'\\Mac\Home\Documents\Projects\broadband\maps\Broadband\Broadband.aprx'
production_item_id = '98fb10d6c0334bd3a246f9ae69d15f04'
username = argv[1]
password = argv[2]

gis = arcgis.gis.GIS(username=username, password=password)

promap = arcpy.mp.ArcGISProject(project_file).listMaps()[0]

print('creating package...')
if arcpy.Exists(tile_package):
    arcpy.management.Delete(tile_package)
arcpy.management.CreateVectorTilePackage(
    promap,
    tile_package,
    summary=
    'Broadband provider coverage data optimized for broadband.utah.gov/map',
    tags='test')

print('publishing new tile package item...')
item = gis.content.add({}, data=tile_package)

print('publishing new vector tiles service...')
temp_item = item.publish()

print('replacing production service...')
prod_item = arcgis.gis.Item(gis, production_item_id)
gis.content.replace_service(prod_item, temp_item)

print('removing temporary items...')
gis.content.delete_items([item, temp_item])
