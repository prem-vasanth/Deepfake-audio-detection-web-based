from flask import Blueprint , abort # type: ignore

home = Blueprint('home' , __name__)

@home.route('/')
def home_func():
    return 'checking modules'