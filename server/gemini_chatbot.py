import os
import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
class chat_bot:
    def __init__(self):
        genai.configure(api_key='GEMINI API KEY')

        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 1064,
            "response_mime_type": "text/plain",
        }

        self.safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]

        self.instruction = '''You're a friendly chatbot of Nandha Engineering College website,
                              Find the suitable answer from the content or the previous chats. If you can't find the answer, just reply with "Sorry, I have no information."
                              parse the answer and add a much friendly and simple accent to it '''
        
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=self.generation_config,
            safety_settings=self.safety_settings,
            system_instruction=self.instruction
        )
        
        self.chat_session = self.model.start_chat(history=[])
        
        self.client = chromadb.PersistentClient(path='./server/Chroma_db')
        self.emb_model = embedding_functions.SentenceTransformerEmbeddingFunction("multi-qa-mpnet-base-dot-v1")
        self.collection = self.client.get_collection("nec_data", embedding_function=self.emb_model)

    def get_data(self, query):
        collection = self.collection
        results = collection.query(query_texts=query, n_results=8)
        results = [" \n ".join(i) for i in results["documents"]]
        return "\n".join(results)

    def ask_bot(self, user_input):
        knowledge = self.get_data(user_input)
        prompt = '''Answer the question by understanding the content and also search previous chats for answers.
                    Content: {knowledge}
                    Question: {user_input}'''.format(knowledge=knowledge, user_input=user_input)
        print(prompt)
        try:
            response = self.chat_session.send_message(prompt)
            if not response.text:
                raise ValueError("Empty response received from the model.")
            print(response.text)
            return response.text
        except Exception as e:
            print("\nError:", str(e))
            return "Sorry, I have no information."
        
def update_chroma():
    document=[]
    ids=[]
    metadata=[]
    id=1
    with open("server/web data/about.txt", encoding="utf-8") as file:
        text=file.read()
        text=text.split("\n")
        text=[i for i in text if i!=""]


        for i,line in enumerate(text):
            s_line=line.split(":")
            
            document.append(s_line[1])
            metadata.append({"item_id:": s_line[0]+"_"+str(i)})
            if len(s_line)>2:
                print(s_line)
            ids.append(str(id))
            id+=1

    client = chromadb.PersistentClient(path="/home/mob/VS Code/Nec Chatbot/server/Chroma_db")

    emb_model=embedding_functions.SentenceTransformerEmbeddingFunction("multi-qa-mpnet-base-dot-v1")

    client.delete_collection("nec_data")

    collection=client.get_or_create_collection("nec_data",embedding_function=emb_model,)

    collection.add(ids=ids, documents=document, metadatas=metadata)