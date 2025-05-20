from .reader import Reader

class WorkerReader(Reader): # Worker -> WorkerReader чтобы ни произошло путанницы с модулями в будущем
    organization: str
    position: str
