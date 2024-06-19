from flask import request, jsonify, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from model.models import *
from datetime import datetime
import json

engine = create_engine("mysql://root:root@localhost:3306/rivvals")
Session = sessionmaker(bind=engine)

draft_blueprint = Blueprint('draft', __name__)

@draft_blueprint.route('/draft', methods=['GET'])
def get_drafts():
    drafts = Draft.query.all()
    return jsonify([draft.to_dict() for draft in drafts])

@draft_blueprint.route('/draft', methods=['POST'])
def create_draft():
    data = request.json
    player_id = data.get('player_id')
    team_id = data.get('team_id')
    edicao = data.get('edicao')
    game = data.get('game')
    draftdate = data.get('draftdate')
    finaldate = data.get('finaldate')

    try:
        new_draft = Draft(
            player_idplayer=player_id,
            team_idteam=team_id,
            edicao=edicao,
            game=game,
            draftdate=draftdate,
            finaldate=finaldate
        )
        
        db.session.add(new_draft)
        db.session.commit()
        
        return jsonify(new_draft.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        db.session.close()

@draft_blueprint.route('/complete_draft', methods=['POST'])
def create_complete_draft():
    session = Session()
    try:
        players = request.json['players']
        for player in players:
            new_player = session.query(Player).filter_by(name=player['name']).first()
            if new_player:
                # Se o jogador já existir, atualize seus atributos
                new_player.nick = player.get('nick')
                new_player.twitch = player.get('twitch')
                new_player.email = player.get('email')
                new_player.schedule = str(player.get('schedule'))
                new_player.coins = player.get('coins')
                new_player.stars = player.get('stars')
                new_player.medal = player.get('medal')
                new_player.wins = player.get('wins')
                new_player.tags = player.get('tags')
                new_player.photo = player.get('photo')
            else:
                # Se o jogador não existir, crie um novo jogador
                new_player = Player(
                    name=player.get('name'),
                    nick=player.get('nick'),
                    twitch=player.get('twitch'),
                    email=player.get('email'),
                    schedule=str(player.get('schedule')),
                    coins=player.get('coins', 0),
                    stars=player.get('stars'),
                    medal=player.get('medal'),
                    wins=player.get('wins'),
                    tags=player.get('tags'),
                    photo=player.get('photo')
                )
            session.add(new_player)
            session.flush()
            session.refresh(new_player)
            
            # Se o time com este numero ja existir crie relacionamento senão crie um novo time
            team_number = player['team']
            team = session.query(Team).filter_by(number=player['team']).first()
            if not team:
                team = Team(
                name = 'Time '+str(team_number),
                wins = 0,
                number = team_number
                )

                session.add(team)
                session.flush()
                session.refresh(team)
            
            # Se uma entrada no draft ja existe ligando player e time use, senão crie.
            edition = request.json['config']['edition']
            draft = session.query(Draft).filter_by(player_idplayer=new_player.idplayer, team_idteam=team.idteam).first()
            if not draft:
                draft = Draft(
                    player_idplayer = new_player.idplayer,
                    team_idteam = team.idteam,
                    edicao = edition,
                    game = request.json['config']['game'],
                    draftdate =  datetime.now()
                )
                session.add(draft)
                session.commit()
                    
        return jsonify({'message': 'Draft created successfully'}), 201

    except Exception as e:
        session.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()

@draft_blueprint.route('/draft/<int:draft_id>', methods=['PUT'])
def update_draft(draft_id):
    draft = Draft.query.get(draft_id)
    if not draft:
        return jsonify({'error': 'Draft not found'}), 404
    
    data = request.json
    draft.player_idplayer = data.get('player_id') or draft.player_idplayer
    draft.team_idteam = data.get('team_id') or draft.team_idteam
    draft.edicao = data.get('edicao') or draft.edicao
    draft.game = data.get('game') or draft.game
    draft.draftdate = data.get('draftdate') or draft.draftdate
    draft.finaldate = data.get('finaldate') or draft.finaldate
    
    try:
        db.session.commit()
        return jsonify(draft.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        db.session.close()

@draft_blueprint.route('/draft/<int:draft_id>', methods=['DELETE'])
def delete_draft(draft_id):
    draft = Draft.query.get(draft_id)
    if not draft:
        return jsonify({'error': 'Draft not found'}), 404
    
    try:
        db.session.delete(draft)
        db.session.commit()
        return jsonify({'message': 'Draft deleted successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    finally:
        db.session.close()