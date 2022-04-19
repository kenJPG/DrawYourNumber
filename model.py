import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from sklearn.preprocessing import StandardScaler

class XGB:
	def __init__(self):
		self.model = joblib.load('./xgb_real_params.z')

	def predict(self, arr):
		mylist = np.array(arr).reshape(1, -1)
		mydf = (pd.DataFrame(mylist))
		print(mydf.head())
		mydf.columns = list(np.arange(1, len(arr) + 1))
		return self.model.predict(mydf)