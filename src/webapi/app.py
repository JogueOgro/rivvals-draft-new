from flask import Flask
from flask_cors import CORS
from resources import player_resources

app = Flask(__name__)
CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
