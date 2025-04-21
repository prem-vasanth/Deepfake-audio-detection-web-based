from flask import Flask # type: ignore
from flask_cors import CORS #type:ignore
from routes.home import home
from routes.detectUpload import detectUpload
from routes.detectRecord import detectRecord
from routes.spectrogramCheck import spectrogramCheck
from routes.history import history

app = Flask(__name__)
CORS(app)

#registering url prefixes as blueprints for modular application
app.register_blueprint(home,url_prefix='/home')
app.register_blueprint(detectRecord , url_prefix = '/detectRecord')
app.register_blueprint(detectUpload , url_prefix = '/detectup')
app.register_blueprint(spectrogramCheck , url_prefix = '/spectrogramCheck')
app.register_blueprint(history , url_prefix = '/history')




@app.route("/")
def hello_world():
    return 'hello world'


if __name__ == "__main__":
    app.run(debug=True, port = 8000)