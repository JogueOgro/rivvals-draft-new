from flask import request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

team_blueprint = Blueprint('team_page', __name__,
                        template_folder='templates')

@team_blueprint.route('/teams', methods=['GET'])
def get_teams():
    session = Session()
    teams = session.query(Teams).all()
    teams_dicts = [team.to_dict() for team in teams]
    return teams_dicts

@team_blueprint.route('/team', methods=['POST'])
def post_team():
    return "OK"

