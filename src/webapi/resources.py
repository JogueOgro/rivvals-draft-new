from api import api
from flask import request, jsonify
from flask_restx import Resource, Namespace
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import Player
import json
from resource_fields import player_post

player_ns = Namespace("player")

engine = create_engine("mysql://root:root@localhost:3306/mydb")
Session = sessionmaker(bind=engine)

@player_ns.route("/")
class player_resources(Resource):
    def get(self):
        session = Session()
        players = session.query(Player).all()
        import pdb; pdb.set_trace()
        players_dicts = [player.to_dict() for player in players]
        return players_dicts

    @player_ns.expect(player_post)
    def post(self):

        data = request.form

        new_player = Player(
            name=data.get('name'),
            nick=data.get('nick'),
            twitch=data.get('twitch'),
            availability=data.get('availability'),
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

                