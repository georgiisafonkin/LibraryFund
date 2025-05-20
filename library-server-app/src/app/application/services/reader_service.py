from typing import Optional, List

from app.domain.models.reader import Reader

class ReaderApplicationService:
    def __init__(self, reader_repo):
        self.reader_repo = reader_repo

    def get_reader_by_id(reader_id: int) -> Optional[Reader]:
        pass

    def list_readers(self) -> List[Reader]:
        pass