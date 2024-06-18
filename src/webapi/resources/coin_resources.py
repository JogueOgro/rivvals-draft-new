from flask import request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

coin_blueprint = Blueprint('coin', __name__)

@coin_blueprint.route('/coin', methods=['GET'])
def get_coin():
    return "COINS"

