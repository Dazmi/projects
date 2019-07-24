from flask import Blueprint

new = Blueprint('new', __name__)

@new.route("/")
def hello():
    return "the plan works"