from flask import request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

class player_resources():
    def get(self):
        session = Session()
        players = session.query(Player).all()
        players_dicts = [player.to_dict() for player in players]
        return players_dicts

    def post(self):

        data = request.form

        new_player = Player(
            name=data.get('name'),
            nick=data.get('nick'),
            twitch=data.get('twitch'),
            schedule=data.get('schedule'),
            coins=data.get('coins'),
            stars=data.get('stars'),
            medal=data.get('medal'),
            wins=data.get('wins'),
            tags=data.get('tags'),
            email=data.get('email'),
            photo=data.get('photo')
        )

        session = Session()
        try:
            session.add(new_player)
            session.commit()
            session.refresh(new_player)  # Refresh na instancia para evitar erros
            return new_player.to_dict()
        except Exception as e:
            session.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            session.close()
