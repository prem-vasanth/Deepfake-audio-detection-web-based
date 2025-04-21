from flask import Blueprint , request ,abort, jsonify # type: ignore
from database.db import db
from bson import ObjectId

history = Blueprint('history' , __name__)

@history.route('/')
def home():
    return "it is history"


@history.route('/classify' , methods = ['GET'])
def fetch_classify_log():

    try:
        collection = db["classification"]

        result = list(collection.find({},{"filename":1,"upload_time":1,"classification_result":1}))

        for doc in result:
            doc["_id"] = str(doc["_id"])

        return jsonify({'result' : result})
    except Exception as e:
        return jsonify({'error' : str(e)}) ,500


@history.route('/spect' , methods = ['GET'])
def fetch_spect_log():

    try:
        collection = db["spectrogram"]

        result = list(collection.find({},{"filename":1,"upload_time":1}))

        for doc in result:
            doc["_id"] = str(doc["_id"])

        return jsonify({'result' : result})
    except Exception as e:
        return jsonify({'error' : str(e)}) ,500


@history.route('/classifyResult/<id>', methods=['GET'])
def get_classify_by_id(id):
    try:
        collection = db["classification"]
        try:
            obj_id = ObjectId(id)
        except InvalidId:
            return jsonify({'error': 'Invalid ID format'}), 400

        result = collection.find_one({'_id': obj_id})

        if not result:
            return jsonify({'error': 'Document not found'}), 404

        # Serialize ObjectId and datetime
        result['_id'] = str(result['_id'])
        if 'upload_time' in result:
            result['upload_time'] = result['upload_time'].isoformat()

        return jsonify({"result":result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@history.route('/spectro/<id>', methods=['GET'])
def get_spectro_by_id(id):
    try:
        collection = db["spectrogram"]
        try:
            obj_id = ObjectId(id)
        except InvalidId:
            return jsonify({'error': 'Invalid ID format'}), 400

        result = collection.find_one({'_id': obj_id})

        if not result:
            return jsonify({'error': 'Document not found'}), 404

        # Serialize ObjectId and datetime
        result['_id'] = str(result['_id'])
        if 'upload_time' in result:
            result['upload_time'] = result['upload_time'].isoformat()

        return jsonify({"result":result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    

