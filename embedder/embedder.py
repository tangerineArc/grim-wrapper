from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer


app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")


class EmbedRequest(BaseModel):
  texts: list[str]


class EmbedResponse(BaseModel):
  embeddings: list[list[float]]


@app.post("/embed", response_model = EmbedResponse)
async def embed(request: EmbedRequest) -> EmbedResponse:
  embeddings = model.encode(request.texts, normalize_embeddings = True).tolist() # type: ignore
  return EmbedResponse(embeddings = embeddings)


@app.get("/ping")
async def ping():
  return {"status": "ok"}
