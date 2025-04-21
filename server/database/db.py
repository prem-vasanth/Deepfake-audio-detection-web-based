from pymongo import MongoClient

try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["deepfakeAudio"]
    print("MongoDB connected successfully.")
except Exception as e:
    print("Failed to connect to MongoDB:", e)
