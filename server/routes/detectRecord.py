from flask import Blueprint , request ,abort, jsonify # type: ignore
import librosa #type: ignore
import io
from pydub import AudioSegment  # type: ignore
from model.model import classify_audio
from database.db import db
import base64
from datetime import datetime

detectRecord = Blueprint('detectRecord' , __name__)

@detectRecord.route('/')
def detect_audio():
    return 'we detect here'

@detectRecord.route('/' , methods=['POST'])
def preprocess_audio():
    collection = db["classification"]
    if 'file' not in request.files:
        return jsonify({'error':'No file found'}) , 400
    
    file = request.files['file']
    print('recieved file: ' , file.filename)
    print('contect-type:',file.content_type)
    file_size = len(file.read())  # Read content to get size
    file.seek(0)  # Reset pointer to allow future reading
    file_format = file.filename.split('.')[-1].lower()
    
    print('Size:', file_size, "bytes")

    try:

        audio = AudioSegment.from_file(file , format = "webm")
        wav_io = io.BytesIO()
        audio.export(wav_io , format="wav")
        wav_io.seek(0)
        print("audio to wav done")
        y, sr = librosa.load(wav_io, sr=16000)
        result = classify_audio(y)


        print("classification done")

        wav_io.seek(0)
        audio_bytes = wav_io.read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        record = {
            "filename": file.filename,
            "format": file_format,
            "content_type": file.content_type,
            "upload_time": datetime.utcnow(),
            "classification_result": result,
            "audio_data_base64": audio_base64,
            "testing_type":"record"
        }

        # Insert into MongoDB
        collection.insert_one(record)
        print("Stored in DB")
        return jsonify({'result' : result})


    except Exception as e:
        return jsonify({'error' : str(e)}) ,500 