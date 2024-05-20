from flask_restx import Resource, Namespace

ns = Namespace("player")

@ns.route("/")
class Slash(Resource):
    def get(self):
        return {"code" : "200 - OK"}