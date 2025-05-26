from fastapi import FastAPI

from src.app.api.readers import reader_router

app = FastAPI(title="Library Fund Server")

app.include_router(reader_router)