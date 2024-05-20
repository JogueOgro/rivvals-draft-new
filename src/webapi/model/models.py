# coding: utf-8
from sqlalchemy import Column, DateTime, ForeignKey, Integer, LargeBinary, String
from sqlalchemy.dialects.mysql import LONGTEXT, TINYINT
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Achievment(Base):
    __tablename__ = 'achievment'

    idachievment = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)


class Game(Base):
    __tablename__ = 'game'

    idgame = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)


class Group(Base):
    __tablename__ = 'group'

    idgroup = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)


class Player(Base):
    __tablename__ = 'player'

    idplayer = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)
    nick = Column(String(45))
    twitch = Column(String(45))
    availability = Column(Integer)
    coins = Column(Integer)
    stars = Column(String(45))
    medal = Column(Integer)
    wins = Column(Integer)
    tags = Column(String(45))
    email = Column(String(45))
    photo = Column(LONGTEXT)


class Program(Base):
    __tablename__ = 'program'

    idprogram = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)


class Rivval(Base):
    __tablename__ = 'rivvals'

    idrivvals = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)
    edition = Column(Integer, nullable=False)


class Team(Base):
    __tablename__ = 'team'

    idteam = Column(Integer, primary_key=True)
    name = Column(String(45), nullable=False)
    size = Column(String(45))
    logo = Column(LargeBinary)


class CoinsLog(Base):
    __tablename__ = 'coins_log'

    player_idplayer = Column(ForeignKey('player.idplayer'), primary_key=True, nullable=False)
    program_idprogram = Column(ForeignKey('program.idprogram'), primary_key=True, nullable=False, index=True)
    date = Column(DateTime, nullable=False)
    ammount = Column(Integer, nullable=False)

    player = relationship('Player')
    program = relationship('Program')


class PlayerHasAchievment(Base):
    __tablename__ = 'player_has_achievment'

    player_idplayer = Column(ForeignKey('player.idplayer'), primary_key=True, nullable=False, index=True)
    achievment_idachievment = Column(ForeignKey('achievment.idachievment'), primary_key=True, nullable=False, index=True)
    rivvals_idrivvals = Column(ForeignKey('rivvals.idrivvals'), primary_key=True, nullable=False, index=True)
    date = Column(DateTime, nullable=False)
    comment = Column(String(45))

    achievment = relationship('Achievment')
    player = relationship('Player')
    rivval = relationship('Rivval')


class PlayerHasTeam(Base):
    __tablename__ = 'player_has_team'

    player_idplayer = Column(ForeignKey('player.idplayer'), primary_key=True, nullable=False, index=True)
    rivvals_idrivvals = Column(ForeignKey('rivvals.idrivvals'), primary_key=True, nullable=False, index=True)
    team_idteam = Column(ForeignKey('team.idteam'), primary_key=True, nullable=False, index=True)
    active = Column(TINYINT, nullable=False)
    group = Column(TINYINT)

    player = relationship('Player')
    rivval = relationship('Rivval')
    team = relationship('Team')


class Score(Base):
    __tablename__ = 'score'

    idpower = Column(Integer, primary_key=True, nullable=False)
    player_idplayer = Column(ForeignKey('player.idplayer'), primary_key=True, nullable=False, index=True)
    game_idgame = Column(ForeignKey('game.idgame'), primary_key=True, nullable=False, index=True)
    value = Column(String(45), nullable=False)

    game = relationship('Game')
    player = relationship('Player')
