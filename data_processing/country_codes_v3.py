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
        

with open("country_codes_v3.json", "r") as file:
    country_codes = json.load(file)
    for i in country_codes:
        if i["iso3_code"] in csv_data_rainfall.keys():
            i["rainfall"] = csv_data_rainfall[i["iso3_code"]]
    
    with open("country_codes_v4.json", "w") as file:
        file.write(json.dumps(country_codes, indent=4))