"""
Converts the original country_codes_original.json file
to a new one with more data, using the restcountries API.
"""
import json

blacklist = ["JG", "KS", "AN"]

counter = 0
deleted = 0
modified = 0

with open("country_codes_v2.json", "r") as original_file:
    country_codes = json.load(original_file)
    for i in country_codes:
        print(f"\nProcessing entry {i['label_en']}...")
        del i["onu_code"]
        del i["is_ilomember"]
        del i["is_receiving_quest"]
        if "geo_shape" in i.keys():
            del i["geo_shape"]
        if "name" in i.keys():
            del i["name"]
        if "flags" in i.keys():
            del i["flags"]
        if "currencies" in i.keys():
            country_codes[country_codes.index(i)]["currencies"] = list(i["currencies"].keys())
        if "languages" in i.keys():
            country_codes[country_codes.index(i)]["languages"] = list(i["languages"].values())
        counter += 1
        if i["iso2_code"] in blacklist:
            print(f"\nBlacklisted entry: {i['label_en']}.")
            print("Deleting entry...")
            country_codes.remove(i)
            deleted += 1
            continue
        modified += 1

    with open("country_codes_v3.json", "w") as file:
        file.write(json.dumps(country_codes, indent=4))

print(f"\n\nProcessed {counter} entries.")
print(f"Deleted {deleted} entries.")
print(f"Modified {modified} entries.")