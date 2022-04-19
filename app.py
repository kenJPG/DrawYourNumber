from flask import Flask
from flask import request
from flask import make_response
from flask import jsonify
import model
from xgboost import XGBClassifier

from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

xgb_model = model.XGB()

# @cross_origin()
@app.route("/classify", methods=["GET"])
def get_info():
	f = request.args.get('input', 'empty')
	origin = list(map(lambda x: int(255 * float(x)), f.split(" ")))
	print("Length: ",len(origin))
	pred_y = str(list(xgb_model.predict(origin))[0])
	response = jsonify({'prediction': pred_y})
	return response