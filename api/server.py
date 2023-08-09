import time

from fastapi import FastAPI, Request
from openai_config import revalidate
from openai_related import query_related
from openai_chat import query_chat, memory
from fastapi.middleware.cors import CORSMiddleware
from pinecone_db import reinitialize_index

app = FastAPI()

# ################################################################################
# # CORS (Cross-Origin Resource Sharing)
# ################################################################################
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)    

# ################################################################################
# # Revalidate DB
# ################################################################################

@app.get("/api/revalidate")
def handle_revalidate():
    start_time = time.time()

    revalidate()

    end_time = time.time()
    elapsed_time = end_time - start_time
    
    print({
        "status": "Revalidated",
        "duration": f"{elapsed_time:.4f} seconds"
    })

    return {
        "status": "Revalidated",
        "duration": f"{elapsed_time:.4f} seconds"
    }
    
# ################################################################################
# # Delete and Re-Initialize pinecone index - use just when is needed
# ################################################################################

@app.delete("/api/pinecone-index")
def handle_pinecone_index_delete():
    reinitialize_index()
    return {
        "status": "ok",
        "message": "Pinecone index was deleted and is re-initializing, please wait a few minutes",
    }
    
# ################################################################################
# # Chatbot Routes
# ################################################################################

@app.post("/api/chat/query")
async def chatbot_handle_query(request: Request):
    start_time = time.time()

    data = await request.json()
    query = data["query"]

    result = query_chat(query)

    end_time = time.time()
    elapsed_time = end_time - start_time

    return {
        "status": "ok",
        "result": result,
        "duration": f"{elapsed_time:.4f} seconds"
    }
    
@app.delete("/api/chat/query")
def handle_memory_delete():
    memory.clear()
    print("----- Chatbot memory cleared -----")
    
# ################################################################################
# # Related Products Routes
# ################################################################################
    
@app.post("/api/related")
async def handle_query(request: Request):
    start_time = time.time()

    data = await request.json()
    search = data["query"]

    result = query_related(search)

    end_time = time.time()
    elapsed_time = end_time - start_time

    return {
        "status": "ok",
        "result": result,
        "duration": f"{elapsed_time:.4f} seconds"
    }
    