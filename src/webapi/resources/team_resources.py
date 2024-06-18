from api import api
from flask import request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

class team_resources():
    def get(self):
        session = Session()
        teams = session.query(Teams).all()
        teams_dicts = [team.to_dict() for team in teams]
        return teams_dicts

    def post(self):
        return "OK"

