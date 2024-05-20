from dbconnect import get_connection
from flask import Flask
from flask_restx import Api
from resources import ns

app = Flask(__name__)
api = Api(app)
api.add_namespace(ns)

cnx = get_connection()
cursor = cnx.cursor()
    
@app.route("/")
def base():
    cursor.execute("SELECT * FROM player")
    results = cursor.fetchall()
    return results

if __name__ == '__main__':
    app.run(debug=True)
