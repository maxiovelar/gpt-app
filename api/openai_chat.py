import os
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())
import json
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
from openai_config import revalidate, get_chroma_instance
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

################################################################################
# Make OpenAI chat query
################################################################################

def chat_query(chat_query):
    instance = get_chroma_instance()
    system_template = """
    #You are a shopping assistant. Use the following pieces of context to answer the question at the end. Take your time to think and analyze your answer. If you don't know the answer, just say that you don't know, don't try to make up an answer.

    #Return a conversational answer about the question in a 'text' key.
    #Return an array with products in a 'products' key just if you found products for the user question.
    #Each product should have a 'id', 'name', 'description', 'price', 'sale', 'sale_price', 'currency', 'slug', 'active' and 'stock' keys.
    #Don't return duplicated products.
    #Don't return non active products.
    #Don't show products that don't exist in the database.
    

    #Context: {context}
    #Question: {question}
    #Answer in JSON format:"""
    

    PROMPT = PromptTemplate(template=system_template, input_variables=["context", "question"])

    chain_type_kwargs = {"prompt": PROMPT}  

    question = chat_query
    qa = RetrievalQA.from_chain_type(
        llm=ChatOpenAI(model_name="gpt-3.5-turbo",temperature=0,openai_api_key=os.getenv('OPENAI_API_KEY')),
        chain_type="stuff",
        retriever=instance.as_retriever(),
        chain_type_kwargs=chain_type_kwargs
    )

    res = qa({"query": question})
    

    return json.loads(res['result'])


