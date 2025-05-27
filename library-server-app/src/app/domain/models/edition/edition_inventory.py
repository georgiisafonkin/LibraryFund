from .edition import Edition
from datetime import date

class EditionInventory(Edition):
    operation_type: str
    date: date