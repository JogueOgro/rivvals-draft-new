from flask import Flask
from flask_cors import CORS
from resources import draft_ns, player_ns, coin_ns
from api import api

app = Flask(__name__)
api.init_app(app)
api.add_namespace(draft_ns)
api.add_namespace(player_ns)
api.add_namespace(coin_ns)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
