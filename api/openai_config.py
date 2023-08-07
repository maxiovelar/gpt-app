import os
import shutil
import time
import json
import requests
import nest_asyncio
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import JSONLoader
from langchain.prompts import PromptTemplate

DATABASE_PATH = './db/'

################################################################################
# API Swell
################################################################################
url = os.getenv('SWELL_API_URL')

# Define your custom headers here
headers = {
    'Authorization': os.getenv('SWELL_AUTORIZATION_KEY'),  # If you have an API token or authentication
    'Content-Type': 'application/json',  # If needed for the request body
}

# Make the HTTP request with custom headers
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # Load the JSON data from the response
    json_data = response.json()

    # Initialize an empty list to store extracted data for each item
    extracted_data_list = []

    # Loop through each item in the array and extract the desired information
    for item in json_data["results"]:
         if item.get("active"):
            extracted_data = {
                "id": item.get("id", None),
                "name": item.get("name", None),
                "active": item.get("active", None),
                "description": item.get("description", None),
                "sale": item.get("sale", None),
                "sale_price": item.get("sale_price", None),
                "price": item.get("price", None),
                "currency": item.get("currency", None),
                "slug": item.get("slug", None),
                "stock": item.get("stock_level", None),
            }
            extracted_data_list.append(extracted_data)    
    
    open('data.json', 'w').write(json.dumps( extracted_data_list, indent=4))
    open('dataSwell.json', 'w').write(json.dumps( json_data, indent=4))
    # Process the JSON data as needed
    print(extracted_data_list)
else:
    print(f"Request failed with status code: {response.status_code}")

################################################################################
# Generate new Chroma instance
################################################################################
def get_chroma_instance():
    embeddings = OpenAIEmbeddings(openai_api_key=os.getenv('OPENAI_API_KEY'))
    return  Chroma(embedding_function=embeddings, persist_directory=DATABASE_PATH)

################################################################################
# Read documents from JSON file and add them to Chroma instance
################################################################################
def revalidate():
    if os.path.exists(DATABASE_PATH):
        shutil.rmtree(DATABASE_PATH)
        
    instance = get_chroma_instance()
    loader = JSONLoader(
        file_path='./data.json',
        jq_schema='.[]',
        text_content=False
    )

    if loader:
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100, separators= ["\n\n", "\n", "(?<=\. )", ";", ",", " ", ""]) # se puede pasar regex a los separators
        texts = text_splitter.split_documents(documents)
        instance.add_documents(texts)

    instance.persist()
