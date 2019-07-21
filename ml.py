
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

import keras
from keras.models import Sequential
from keras.layers import Dense, Activation, Dropout, Flatten,\
 Conv2D, MaxPooling2D
from keras.layers.normalization import BatchNormalization

def create_tables():
    asxlist = pd.read_csv('20190701-asx200.csv',  header=1)

    print(asxlist['Code'])
    main_df = pd.DataFrame()
    for asx in asxlist['Code']:
        df = web.DataReader(f'data/{asx}.ax', 'yahoo')
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

def build_model(X_train):

    model = tf.keras.Sequential([
        tf.keras.layers.Dense(32, input_shape=X_train.shape[1:], activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Conv2D(64,(3,3),padding='same',activation='relu'),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(8, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    base_learning_rate = 0.0001
    model.compile(optimizer=tf.keras.optimizers.RMSprop(lr=base_learning_rate),
        loss='binary_crossentropy',
              metrics=['accuracy'])

    return model


def alaxnet(X_train, y_train):
    # (3) Create a sequential model
    model = tf.keras.Sequential()

    # 1st Convolutional Layer
    model.add(tf.keras.layers.Conv1D(filters=96, input_dim=2, input_shape=X_train.shape, kernel_size=(11),strides=(4), padding='valid'))
    model.add(tf.keras.layers.Activation('relu'))
    # Pooling 
    model.add(tf.keras.layers.MaxPooling1D(pool_size=(2), strides=(2), padding='valid'))
    # Batch Normalisation before passing it to the next layer
    model.add(tf.keras.layers.BatchNormalization())

    # 2nd Convolutional Layer
    model.add(tf.keras.layers.Conv1D(filters=256, kernel_size=(11), strides=(1), padding='valid'))
    model.add(tf.keras.layers.Activation('relu'))
    # Pooling
    model.add(tf.keras.layers.MaxPooling1D(pool_size=(2), strides=(2), padding='valid'))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # 3rd Convolutional Layer
    model.add(tf.keras.layers.Conv1D(filters=384, kernel_size=(3), strides=(1), padding='valid'))
    model.add(tf.keras.layers.Activation('relu'))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # 4th Convolutional Layer
    model.add(tf.keras.layers.Conv1D(filters=384, kernel_size=(3), strides=(1), padding='valid'))
    model.add(tf.keras.layers.Activation('relu'))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # 5th Convolutional Layer
    model.add(tf.keras.layers.Conv1D(filters=256, kernel_size=(3), strides=(1), padding='valid'))
    model.add(tf.keras.layers.Activation('relu'))
    # Pooling
    model.add(tf.keras.layers.MaxPooling1D(pool_size=(2), strides=(2), padding='valid'))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # Passing it to a dense layer
    model.add(tf.keras.layers.Flatten())
    # 1st Dense Layer
    model.add(tf.keras.layers.Dense(4096, input_shape=(224*224*3,)))
    model.add(tf.keras.layers.Activation('relu'))
    # Add Dropout to prevent overfitting
    model.add(tf.keras.layers.Dropout(0.4))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # 2nd Dense Layer
    model.add(tf.keras.layers.Dense(4096))
    model.add(tf.keras.layers.Activation('relu'))
    # Add Dropout
    model.add(tf.keras.layers.Dropout(0.4))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # 3rd Dense Layer
    model.add(tf.keras.layers.Dense(1000))
    model.add(tf.keras.layers.Activation('relu'))
    # Add Dropout
    model.add(tf.keras.layers.Dropout(0.4))
    # Batch Normalisation
    model.add(tf.keras.layers.BatchNormalization())

    # Output Layer
    model.add(tf.keras.layers.Dense(1))
    model.add(tf.keras.layers.Activation('softmax'))

    model.summary()

    # (4) Compile 
    model.compile(loss='categorical_crossentropy', optimizer='adam',\
    metrics=['accuracy'])

    return model

def lstm(X_train):

    data_dim = 16
    timesteps = 8
    num_classes = 10
    batch_size = 32

    model = (tf.keras.Sequential())
    model.add(tf.keras.layers.LSTM(32, return_sequences=True, stateful=True, batch_input_shape=(batch_size, timesteps, data_dim)))
    model.add(tf.keras.layers.LSTM(32, return_sequences=True, stateful=True))
    model.add(tf.keras.layers.LSTM(32, stateful=True))
    model.add(tf.keras.layers.Dense(1, activation='sigmoid'))

    model.compile(loss='binary_crossentropy',
                optimizer='rmsprop',
                metrics=['accuracy'])
    
    return model



def do_ml(ticker):
    X, y, df = extract_featuresets(ticker)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = lstm(X_train)
    
    history = model.fit(X_train, y_train, batch_size=32, epochs=1)
    
    test_loss, test_acc = model.evaluate(X_test, y_test)

    print('Test Loss: {}'.format(test_loss))
    print('Test Accuracy: {}'.format(test_acc))

do_ml("TLS")