from api import api
from flask import request, jsonify
from flask_restx import Resource, Namespace
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import Player
from json import dumps
from resource_fields import player_post

player_ns = Namespace("player")

engine = create_engine("mysql://root:root@localhost:3306/mydb")
Session = sessionmaker(bind=engine)

@player_ns.route("/")
class player_resources(Resource):
    def get(self):
        session = Session()
        players = session.query(Player).all()
        players_dicts = [player.to_dict() for player in players]
        serialized_players = dumps(players_dicts)
        return serialized_players

    @api.expect(player_post)
    def post(self):
        data = request.data

        new_player = Player(
            name=data['name'],
            nick=data['nick'],
            twitch=data['twitch'],
            availability=data['availability'],
            coins=data['coins'],
            stars=data['stars'],
            medal=data['medal'],
            wins=data['wins'],
            tags=data['tags'],
            email=data['email'],
            photo=data['photo']
        )

        session = Session()
        session.add(new_player)

        session.commit()

        session.close()

        return jsonify(new_player.to_dict()), 201

                