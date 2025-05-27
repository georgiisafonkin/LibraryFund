from fastapi import FastAPI

from src.app.api.readers import reader_router
from src.app.api.librarians import librarian_router

app = FastAPI(title="Library Fund Server")

app.include_router(reader_router)
app.include_router(librarian_router)