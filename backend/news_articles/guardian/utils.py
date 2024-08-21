import json


def write_json_to_file(file_path: str, data: dict):
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


def read_json_from_file(file_path: str) -> dict:
    return json.loads(open(file_path, "r").read())