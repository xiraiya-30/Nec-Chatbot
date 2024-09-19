from flask import Flask, jsonify, request
from flask_cors import CORS
import pymongo
from datetime import date
from gemini_chatbot import chat_bot, update_chroma
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
bot = chat_bot()

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["Nec_Chatbot"]
chat_history_collection = db["Chat_History"]

@app.route('/api/ask_bot', methods=['POST', 'GET'])
def ask_bot():
    if request.method == 'POST':
        data = request.get_json()
        query = data.get('q', '')
        email = data.get('email', '')
    elif request.method == 'GET':
        query = request.args.get('q', '')
        email = request.args.get('email', '')

    if not query or not email:
        return jsonify({"error": "No query or email provided"}), 400

    print(f"Query: {query}, Email: {email}")
    response = bot.ask_bot(query)
    print("response :",response.strip())
    # Update chat history in MongoDB
    chat_history_collection.update_one(
        {"user": email},
        {"$push": {"chats": {"sender": "user", "text": query}}},
        upsert=True
    )
    chat_history_collection.update_one(
        {"user": email},
        {"$push": {"chats": {"sender": "bot", "text": response.strip()}}},
        upsert=True
    )

    return jsonify({"response": response.strip()})


@app.route('/api/set_user', methods=['POST', 'GET'])
def set_user():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('q', '')
    elif request.method == 'GET':
        email = request.args.get('q', '')

    if not email:
        return jsonify({"error": "No query provided"}), 400

    print(f"email: {email}")

    # Check if user exists in MongoDB, if not create a new document
    if not chat_history_collection.find_one({"user": email}):
        chat_history_collection.insert_one({
            "user": email,
            "date": str(date.today()),
            "chats": []
        })

    return jsonify({"response": 'Email set successfully'})


@app.route('/api/get_chats', methods=['GET'])
def get_chats():
    chats = chat_history_collection.find().sort("date", pymongo.DESCENDING)
    chat_list = []
    for chat in chats:
        chat['_id'] = str(chat['_id'])  # Convert ObjectId to string
        chat_list.append(chat)
    return jsonify(chat_list)


@app.route('/api/get_chatcount', methods=['GET'])
def get_chatcount():

    # Calculate total number of chats in the database
    total_chats = chat_history_collection.count_documents({})
    today_chats = chat_history_collection.count_documents({'date':str(date.today())})

    return jsonify({"today": today_chats, "total": total_chats})


@app.route('/api/add_knowledge', methods=['POST', 'GET'])
def add_knowledge():

    # Get the JSON data from the query parameter 'q'
    q_data = request.args.get('q')
    
    
    print(q_data)
    with open("/home/mob/VS Code/Nec Chatbot/server/web data/about.txt", "a", encoding="utf-8") as file:
        file.write("\n\n"+q_data)
        file.close()

    update_chroma()

    return jsonify(True)

@app.route('/api/get_knowledge', methods=['GET'])
def get_knowledge():

    # Calculate total number of chats in the database
    with open("/home/mob/VS Code/Nec Chatbot/server/web data/about.txt", encoding="utf-8") as file:
        text=file.read()
        text=text.split("\n")
        text=[i for i in text if i!=""]
        res={}
        for i in text:
            i=i.split(":")
            res[i[0]]=i[1]

    return jsonify(res)

@app.route('/api/update_knowledge', methods=['POST','GET'])
def update_knowledge():
    q_data = request.args.get('q')
    q_data=eval(q_data)
    
    
    with open("/home/mob/VS Code/Nec Chatbot/server/web data/about.txt", encoding="utf-8") as file:
        key=[*q_data]
        data=q_data[key[0]]
        text=file.read()
        text=text.split("\n")
        text=[i for i in text if i!=""]
        docs={}
        for i in text:
            i=i.split(":")
            docs[i[0]]=i[1]

        docs[key[0]]=data

        print(docs[key[0]])

        text=""

        for i in [*docs]:
            text+="\n\n"+i+":"+docs[i]
        print(text)

        with open("/home/mob/VS Code/Nec Chatbot/server/web data/about.txt", "w", encoding="utf-8") as file:
            file.write(text)
            file.close()
        
    return (jsonify(q_data))





if __name__ == '__main__':
    app.run(debug=True)
