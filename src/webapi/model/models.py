# coding: utf-8
from sqlalchemy import Column, DateTime, ForeignKey, Integer, MetaData, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Draft(Base):
    __tablename__ = 'draft'

    iddraft = Column(Integer, primary_key=True, nullable=False)
    player_idplayer = Column(ForeignKey('player.idplayer'), primary_key=True, nullable=False, index=True)
    team_idteam = Column(ForeignKey('team.idteam'), primary_key=True, nullable=False, index=True)
    edicao = Column(String(45))
    game = Column(String(45))
    draftdate = Column(DateTime)
    finaldate = Column(DateTime)

    player = relationship('Player', primaryjoin='Draft.player_idplayer == Player.idplayer', backref='drafts')
    team = relationship('Team', primaryjoin='Draft.team_idteam == Team.idteam', backref='drafts')



class Match(Base):
    __tablename__ = 'match'

    idmatch = Column(Integer, primary_key=True)
    datetime = Column(DateTime, nullable=False)
    type = Column(String(45))
    score = Column(String(45))

    team = relationship('Team', secondary='match_has_team', backref='matches')



t_match_has_team = Table(
    'match_has_team', metadata,
    Column('match_idmatch', ForeignKey('match.idmatch'), primary_key=True, nullable=False, index=True),
    Column('team_idteam', ForeignKey('team.idteam'), primary_key=True, nullable=False, index=True)
)



class Player(Base):
    __tablename__ = 'player'

    idplayer = Column(Integer, primary_key=True, unique=True)
    name = Column(String(45), nullable=False)
    nick = Column(String(45))
    twitch = Column(String(45))
    schedule = Column(String)
    coins = Column(Integer)
    stars = Column(String(45))
    medal = Column(Integer)
    wins = Column(Integer)
    tags = Column(String(45))
    email = Column(String(45))
    photo = Column(String)



class Team(Base):
    __tablename__ = 'team'

    idteam = Column(Integer, primary_key=True)
    name = Column(String(45))
    logo = Column(String(45))
    wins = Column(Integer)
