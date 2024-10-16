"""
Converts the original country_codes_original.json file
to a new one with more data, using the restcountries API.
"""

import requests
import json

blacklist = ["JG"]

url = "https://restcountries.com/v3.1/alpha?codes="
url_args = (
    "&fields=name,capital,population,area,flags,currencies,languages,subregion,unMember"
)

request = requests.get(url + "CH" + url_args)
data = request.json()
counter = 0
deleted = 0
modified = 0

with open("country_codes_original.json", "r") as original_file:
    country_codes = json.load(original_file)
    for i in country_codes:
        del i["geo_shape"]
        data = requests.get(url + i["iso3_code"] + url_args).json()
        counter += 1
        if type(data) == dict:
            if data["status"] == 404:
                print(f"\nCould not find data for {i['label_en']}.")
                print("Deleting entry...")
                country_codes.remove(i)
                deleted += 1
                continue
        country_codes[country_codes.index(i)] = {**i, **data[0]}
        modified += 1

    with open("country_codes.json", "w") as file:
        file.write(json.dumps(country_codes, indent=4))

print(f"\n\nProcessed {counter} entries.")
print(f"Deleted {deleted} entries.")
print(f"Modified {modified} entries.")