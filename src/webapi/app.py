import dbconnect
from flask import Flask

app = Flask(__name__)
cnx = dbconnect.get_connection()
cursor = cnx.cursor()

@app.route("/")
def base():
    cursor.execute("SELECT * FROM player")
    results = cursor.fetchall()
    return results

#cnx.close()