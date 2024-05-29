from flask import Flask
from resources import player_ns, coin_ns
from api import api

app = Flask(__name__)
api.init_app(app)
api.add_namespace(player_ns)
api.add_namespace(coin_ns)

if __name__ == '__main__':
    app.run(debug=True)
