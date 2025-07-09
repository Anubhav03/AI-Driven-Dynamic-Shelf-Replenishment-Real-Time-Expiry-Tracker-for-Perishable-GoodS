import re

def validate_barcode(barcode: str) -> bool:
    return bool(re.match(r"^[0-9A-Za-z]{8,20}$", barcode))

def format_product_name(name: str) -> str:
    return name.strip().title()
