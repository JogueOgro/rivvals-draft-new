from api.api import api
from flask import request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

class draft_resources():
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
                  new_player.schedule = player.get('schedule')
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
                      schedule=player.get('schedule'),
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
          return str(e)  #jsonify({'error': str(e)}), 500
        finally:
          session.close()