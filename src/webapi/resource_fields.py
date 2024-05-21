from api import api
from flask_restx import fields

player_post = api.model('Resource', {
    'name': fields.String,
    'nick': fields.String,
    'twitch': fields.String,
    'coins': fields.String,
    'stars': fields.String,
    'medal': fields.String,
    'wins': fields.String,
    'tags': fields.String,
    'email': fields.String,
    'photo': fields.String,
})