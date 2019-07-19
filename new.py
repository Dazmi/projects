import pandas as pd
import pandas_datareader.data as web
from pandas.tseries.offsets import BDay
import numpy as np
import scipy.stats as scs
import matplotlib.pyplot as plt
import os

asxNames = os.listdir("data")


df = pd.read_csv(f'data/ASX.csv',  header=0, index_col=0)
dv = (df['Adj Close'] * df['Volume'] / 1e6)[1:]
lret = np.log(df['Adj Close'] / df['Adj Close'].shift(1)).dropna() 
illiq = np.abs(lret) / dv


print(lret)


def _ext_lq_risk(series):
	# UPDATED: DEC 5TH
    # threshold is 95th percentile
    # right tailed convention
    p_star = np.nanpercentile(series, 95)   
	illiq = series[series > p_star]
    lg_illiq = np.log(illiq / p_star)
    lg_illiq = lg_illiq[np.isfinite(lg_illiq)]
    try:
        gamma = 1./ ((1./len(lg_illiq)) * sum(lg_illiq))
    except ZeroDivisionError:
        gamma = np.nan
    return gamma

gdfz = (gdf - gdf.mean())/gdf.std()
gdfz.columns = ['ELR']

# main_df = pd.DataFrame()

# for name in asxnames:
#     df = pd.read_csv(f'data/{name}',  header=0, index_col=0)
#     main_df = [main_df, df]

# print(main_df)