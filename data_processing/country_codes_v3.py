"""
This module contains the country codes for the countries in the world.
The data was obtained from the restcountries API.
"""

import json
import csv

csv_data_rainfall = {}
with open("world-bank-rainfall-data/API_AG.LND.PRCP.MM_DS2_en_csv_v2_10476.csv", "r") as file:
    csv_reader = csv.reader(file)
    [next(csv_reader) for x in range(5)]
    for row in csv_reader:
        rainList = [float(x) for x in row[4:] if x != ""]
        if rainList:
            csv_data_rainfall[row[1]] = sum(rainList)/len(rainList)
        
csv_data_income_and_region = {}
with open("world-bank-rainfall-data/Metadata_Country_API_AG.LND.PRCP.MM_DS2_en_csv_v2_10476.csv", "r", encoding="utf8") as file:
    csv_reader = csv.reader(file)
    next(csv_reader)
    for row in csv_reader:
        csv_data_income_and_region[row[0]] = {"income_level": row[2], "region": row[1]}

with open("country_codes_v3.json", "r") as file:
    country_codes = json.load(file)
    for i in country_codes:
        if i["iso3_code"] in csv_data_rainfall.keys():
            i["rainfall"] = csv_data_rainfall[i["iso3_code"]]
        if i["iso3_code"] in csv_data_income_and_region.keys():
            i["income_level"] = csv_data_income_and_region[i["iso3_code"]]["income_level"]
            i["wb_region"] = csv_data_income_and_region[i["iso3_code"]]["region"]
        
        if "geo_shape" in i.keys():
            del i["geo_shape"]
    
    with open("country_codes_v4.json", "w") as file:
        file.write(json.dumps(country_codes, indent=4))