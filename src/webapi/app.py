from flask import Flask
from flask_restx import Api
from resources import player_ns

app = Flask(__name__)
api = Api(app)
api.add_namespace(player_ns)

if __name__ == '__main__':
    app.run(debug=True)
