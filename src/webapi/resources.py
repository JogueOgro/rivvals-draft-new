from api import api
from flask import request, jsonify
from flask_restx import Resource, Namespace
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json
from resource_fields import player_post

draft_ns = Namespace("draft")
player_ns = Namespace("player")
coin_ns = Namespace("coin")

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

@player_ns.route("/")
class player_resources(Resource):
    def get(self):
        session = Session()
        players = session.query(Player).all()
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

@draft_ns.route("/")
class draft_resources(Resource):
    def get(self):
        return "OK"

    def post(self):
        session = Session()
        try:
          players = json.loads(request.data.decode('unicode_escape')).get('players')

          new_players = []
          for player in players:
              new_player = session.query(Player).filter_by(name=player['name']).first()
              if new_player:
                  # Se o jogador já existir, atualize seus atributos
                  new_player.nick = player.get('nick')
                  new_player.twitch = player.get('twitch')
                  new_player.availability = player.get('availability')
                  new_player.coins = player.get('coins')
                  new_player.stars = player.get('stars')
                  new_player.medal = player.get('medal')
                  new_player.wins = player.get('wins')
                  new_player.tags = player.get('tags')
                  new_player.email = player.get('email')
                  new_player.photo = player.get('photo')
                  new_players.append(new_player)
              else:
                  # Se o jogador não existir, crie um novo jogador
                  new_player = Player(
                      name=player.get('name'),
                      nick=player.get('nick'),
                      twitch=player.get('twitch'),
                      availability=player.get('availability'),
                      coins=0,
                      stars=player.get('stars'),
                      medal=player.get('medal'),
                      wins=player.get('wins'),
                      tags=player.get('tags'),
                      email=player.get('email'),
                      photo=player.get('photo')
                  )
                  new_players.append(new_player)


          session.add_all(new_players)
          session.commit()
          for player in new_players:
              session.refresh(player)  # Refresh na instancia para evitar erros
          return [player.to_dict() for player in new_players]

        except Exception as e:
          session.rollback()
          return str(e)#jsonify({'error': str(e)}), 500
        finally:
          session.close()

@coin_ns.route("/")
class coin_resources(Resource):
    def get(self):
        session = Session()
        players = session.query(CoinsLog).all()
        players_dicts = [player.to_dict() for player in players]
        return players_dicts

