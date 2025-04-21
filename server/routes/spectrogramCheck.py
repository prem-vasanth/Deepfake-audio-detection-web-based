from flask import Blueprint , request ,abort, jsonify # type: ignore
import librosa #type: ignore
import io
from pydub import AudioSegment  # type: ignore
from model.spectrogram import analyze_mel_spectrogram_from_array
from database.db import db
from datetime import datetime
import base64

spectrogramCheck = Blueprint('spectrogramCheck' , __name__)

@spectrogramCheck.route('/')
def spec():
    return "spectrogram generation"


@spectrogramCheck.route('/' , methods=['POST'])
def preprocess_audio():

    collection = db["spectrogram"]

    if 'file' not in request.files:
        return jsonify({'error':'No file found'}) , 400
    
    file = request.files['file']
    print('recieved file: ' , file.filename)
    print('contect-type:',file.content_type)

    file_format = file.filename.split('.')[-1].lower()
    if file_format not in ['mp3', 'wav', 'webm', 'ogg', 'm4a', 'aac']:
        return jsonify({'error': f'Unsupported format: {file_format}'}), 400

   

    try:
        # Convert to WAV regardless of input
        audio = AudioSegment.from_file(file, format=file_format)
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        # Load into librosa
        y, sr = librosa.load(wav_io, sr=16000)
        print("Audio loaded and resampled to 16kHz")

        # Run mel_spectrogram function
        analysis_result = analyze_mel_spectrogram_from_array(y, sr)

        wav_io.seek(0)
        audio_bytes = wav_io.read()
        audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')

        record = {
            "filename": file.filename,
            "format": file_format,
            "content_type": file.content_type,
            "upload_time": datetime.utcnow(),
            "spectrogram_result": analysis_result,
            "audio_data_base64": audio_base64,
            
        }

        # Insert into MongoDB
        collection.insert_one(record)
        print("stored in db")
       
        return jsonify({'result': analysis_result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500