import time

from fastapi import FastAPI, Request
from openai_config import revalidate
from openai_qa import query
from openai_chat import chat_query
from fastapi.middleware.cors import CORSMiddleware
# from openai_chat import chat_history


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
# # OPTION: Revalidate on get
# ################################################################################
# @app.get("/api/revalidate")
# def handle_revalidate():
#     start_time = time.time()

#     revalidate()

#     end_time = time.time()
#     elapsed_time = end_time - start_time

#     return {
#         "status": "Revalidated",
#         "duration": f"{elapsed_time:.4f} seconds"
#     }


# @app.post("/api/query")
# async def handle_query(request: Request):
#     start_time = time.time()

#     data = await request.json()
#     search = data["query"]

#     result = query(search)

#     end_time = time.time()
#     elapsed_time = end_time - start_time

#     return {
#         "status": "ok",
#         "result": result,
#         "duration": f"{elapsed_time:.4f} seconds"
#     }


# ################################################################################
# # OPTION: Revalidate on post
# ################################################################################
@app.post("/api/query")
async def handle_query(request: Request):
    start_time = time.time()
    revalidate()

    data = await request.json()
    search = data["query"]

    result = query(search)

    end_time = time.time()
    elapsed_time = end_time - start_time

    return {
        "status": "ok",
        "result": result,
        "duration": f"{elapsed_time:.4f} seconds"
    }
    

@app.post("/api/chat/query")
async def handle_chat_query(request: Request):
    start_time = time.time()
    revalidate()

    data = await request.json()
    search = data["query"]

    result = chat_query(search)

    end_time = time.time()
    elapsed_time = end_time - start_time

    return {
        "status": "ok",
        "result": result,
        "duration": f"{elapsed_time:.4f} seconds"
    }

@app.delete("/api/chat/query")
async def handle_chat_history_delete():
    # memory.clear()
    # chat_history.clear()
    return {
        "status": "ok",
        "message": "Chat history cleared"
    }

