
import pandas_datareader.data as web
import pandas as pd
import numpy as np
import datetime as dt
import matplotlib.pyplot as plt
from matplotlib import style
from collections import Counter
from yahoo_fin import stock_info as si
from multiprocessing import Pool
from multiprocessing.dummy import Pool as ThreadPool
import time

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import TensorBoard

def create_tables():
    asxlist = pd.read_csv('20190701-asx200.csv',  header=1)

    print(asxlist['Code'])
    main_df = pd.DataFrame()
    for asx in asxlist['Code']:
        df = web.DataReader(f'{asx}.ax', 'yahoo')
        df.rename(columns={'Adj Close':asx}, inplace=True)
        main_df = main_df.join(df[asx], how='outer')
        print(asx)

    main_df.to_csv('asx_closes.csv')
    print(main_df)

def process_data_for_labels(ticker):
    hm_days = 7
    df = pd.read_csv('asx_closes.csv', index_col=0)
    tickers = df.columns.values.tolist()
    df.fillna(0, inplace=True)

    for i in range(1,hm_days+1):
        df['{}_{}d'.format(ticker,i)] = (df[ticker].shift(-i) - df[ticker]) / df[ticker]

    df.fillna(0, inplace=True)
    return tickers, df

def buy_sell_hold(*args):
    cols = [c for c in args]
    requirement = 0.02
    for col in cols:
        if col > requirement:
            return 1
        if col < -requirement:
            return -1
    return 0

def extract_featuresets(ticker):
    tickers, df = process_data_for_labels(ticker)

    df['{}_target'.format(ticker)] = list(map( buy_sell_hold,
                                               df['{}_1d'.format(ticker)],
                                               df['{}_2d'.format(ticker)],
                                               df['{}_3d'.format(ticker)],
                                               df['{}_4d'.format(ticker)],
                                               df['{}_5d'.format(ticker)],
                                               df['{}_6d'.format(ticker)],
                                               df['{}_7d'.format(ticker)] ))

    vals = df['{}_target'.format(ticker)].values.tolist()
    str_vals = [str(i) for i in vals]
    print('Data spread:',Counter(str_vals))

    df.fillna(0, inplace=True)
    df = df.replace([np.inf, -np.inf], np.nan)
    df.dropna(inplace=True)

    df_vals = df[[ticker for ticker in tickers]].pct_change()
    df_vals = df_vals.replace([np.inf, -np.inf], 0)
    df_vals.fillna(0, inplace=True)

    X = df_vals.values
    y = df['{}_target'.format(ticker)].values

    return X,y,df

def build_model():

    # model = tf.keras.Sequential([
    #     tf.keras.layers.LSTM(64, input_shape=(200, ), return_sequences=True),
    #     tf.keras.layers.LSTM(32),
    #     tf.keras.layers.Dense(64, activation='relu'),
    #     tf.keras.layers.Dense(1)
    # ])

    model = tf.keras.Sequential([
        tf.keras.layers.Dense(200, input_shape=(1,200), activation='relu'),
        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(64)),
        tf.keras.layers.Reshape((100, 200, 200)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])

    model.compile(loss='binary_crossentropy',
              optimizer='adam',
              metrics=['accuracy'])

    return model

def do_ml(ticker):
    X, y, df = extract_featuresets(ticker)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = build_model()
    
    history = model.fit(X_train, y_train, epochs=10)
    
    test_loss, test_acc = model.evaluate(X_test, y_test)

    print('Test Loss: {}'.format(test_loss))
    print('Test Accuracy: {}'.format(test_acc))

    #confidence = clf.score(X_test, y_test)
    

    return confidence

do_ml("TLS")