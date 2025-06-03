from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.app.api.readers import reader_router
from src.app.api.librarians import librarian_router
from src.app.api.literature import literature_router

app = FastAPI(title="Library Fund Server")

app.include_router(reader_router)
app.include_router(librarian_router)
app.include_router(literature_router)

origins = [
    "http://localhost:5173",  # адрес фронтенда
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # или ["*"] для всех, но лучше конкретно фронтенд
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)