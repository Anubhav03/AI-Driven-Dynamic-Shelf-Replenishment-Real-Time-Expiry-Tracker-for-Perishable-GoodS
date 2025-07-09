from datetime import datetime, date

def parse_date(date_str: str) -> date:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Date format not recognized: {date_str}")

def days_until(target_date: date) -> int:
    return (target_date - date.today()).days
