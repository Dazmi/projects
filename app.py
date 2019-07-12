from flask import Flask, request, jsonify 
import pandas_datareader.data as web
import pandas as pd
import numpy as np
import datetime as dt
import matplotlib.pyplot as plt
from matplotlib import style
from yahoo_fin import stock_info as si
import json
import psutil
from multiprocessing import Pool
from multiprocessing.dummy import Pool as ThreadPool
import time
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1)
asx200 = pd.read_csv('20190701-asx200.csv',  header=1)
corr = pd.read_csv('corr.csv',  header=0, index_col=0)
latest = pd.read_csv('latest_data.csv',  header=0, index_col=0)

@app.route("/monitor")
def monitor():
        last_bytes_sent = 0
        last_bytes_received = 0

        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        disk_percent = psutil.disk_usage('/').percent
        network_io = psutil.net_io_counters()
        boottime = dt.datetime.fromtimestamp(psutil.boot_time()).strftime("%Y-%m-%d %H:%M:%S")

        if last_bytes_sent == 0:
            bytes_sent_delta = 0
        else:
            bytes_sent_delta = network_io.bytes_sent - last_bytes_sent
        last_bytes_sent = network_io.bytes_sent
        if last_bytes_received == 0:
            bytes_received_delta = 0
        else:
            bytes_received_delta = (
                network_io.bytes_recv - last_bytes_received)
        last_bytes_received = network_io.bytes_recv
        data = {
            'cpu_percent': cpu_percent,
            'memory_percent': memory_percent,
            'disk_percent': disk_percent,
            'net_sent': bytes_sent_delta,
            'net_rec': bytes_received_delta,
            'boot_time':boottime
        } 
        return jsonify(data)

@app.route("/asx")
def stats():
    ticker = request.args['ticker']
    ticker = ticker.upper()
    timeframe = request.args['timeframe']
    df = web.DataReader(f'{ticker}.ax', 'yahoo')
    df = df.reset_index()
    days = 0
    if timeframe == 'week':
        days = 7
    elif timeframe == 'month':
        days = 30
    elif timeframe == 'year':
        days = 365
    elif timeframe == '5years':
        days = 1825
    elif timeframe == 'max':
        days = 1825

    #main_df = main_df.round({'Adj Close': 3, 'price_change': 3, 'pc_change': 2})
    df = df.round({'Adj Close': 3, 'Volume': 0})
    X_data = df['Date'].dt.strftime('%d/%m/%Y')
    X_data = X_data.tail(days).tolist()
    Y_data = df['Adj Close'].tail(days)
    Y_data = Y_data.tolist()
    volume = df['Volume'].tail(days).tolist()
    #asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1, index_col=1)
    asxindex = asxlist.set_index('ASX code')
    company = asxindex.loc[ticker,:]

    corr = pd.read_csv('corr.csv',  header=0, index_col=0)
    corr.sort_values(by=[ticker], axis=0, inplace=True, ascending=True)
    corr.drop(ticker, inplace=True)
    pos = corr[ticker].tail(5).index.to_list()
    neg = corr[ticker].head(5).index.to_list()

    pos_company = asxindex.loc[pos,:]
    neg_company = asxindex.loc[neg,:]

    pred = latest.loc[ticker,['short_pred', 'long_pred']]

    res = {
        'ticker':ticker,
        'labels':X_data,
        'prices':Y_data,
        'volume':volume,
        'name':company['Company name'],
        'group':company['GICS industry group'],
        'pos':pos_company['Company name'].to_list(),
        'neg':neg_company['Company name'].to_list(),
        'short_pred':pred['short_pred'],
        'long_pred':pred['long_pred']
    }
    return jsonify(res)


def get_data(ticker):
    try:
        print(ticker)
        df = web.DataReader(f'{ticker}.ax', 'yahoo')
        df.to_csv(f'data/{ticker}.csv')
    except Exception as e: print(e)

@app.route("/update_data")
def thread_get():
    start = time.time()
    pool = ThreadPool(8)
    results = pool.map(get_data, asxlist['ASX code'])
    pool.close()
    pool.join()
    print(time.time() - start)
    return jsonify({'message':'Complete'})

def latest_data(ticker):
    #df = pd.read_csv(f'data/{ticker}.csv',  header=0)
    df = web.DataReader(f'{ticker}.ax', 'yahoo')
    df.to_csv(f'data/{ticker}.csv')
    df['moving_20'] = df['Adj Close'].rolling(window=20).mean()
    df['moving_100'] = df['Adj Close'].rolling(window=100).mean()
    df = df.tail(1)
    df['ASX code'] = ticker
    print(ticker)
    return df

@app.route("/update_latest")
def thread_latest():
    start = time.time()
    pool = ThreadPool(8)
    results = pool.map(latest_data, asx200['Code'])
    pool.close()
    pool.join()
    
    main_df = pd.DataFrame()
    main_df = main_df.append(results)
    main_df['price_change'] = main_df['Adj Close'] - main_df['Open']
    main_df['pc_change'] = (main_df['Adj Close'] - main_df['Open']) / abs(main_df['Open']) * 100
    main_df = pd.merge(asxlist, main_df, on='ASX code')
    main_df = main_df.round({'Adj Close': 3, 'price_change': 3, 'pc_change': 2})

    main_df.loc[main_df['Adj Close'] >= main_df['moving_20'], 'short_pred'] = 'buy'  
    main_df.loc[main_df['Adj Close'] < main_df['moving_20'], 'short_pred'] = 'sell' 

    main_df.loc[main_df['Adj Close'] >= main_df['moving_100'], 'long_pred'] = 'buy'  
    main_df.loc[main_df['Adj Close'] < main_df['moving_100'], 'long_pred'] = 'sell'  

    main_df.set_index('ASX code', inplace=True)
    main_df.to_csv('all_latest.csv')
    main_df = main_df.drop(['GICS industry group', 'High', 'Low', 'Open', 'Close', 'moving_20', 'moving_100'], axis=1)
    main_df.to_csv('latest_data.csv')
    print(time.time() - start)
    return jsonify({'message':'Complete'})

@app.route("/latest")
def get_latest():
    df = pd.read_csv('latest_data.csv', header=0)
    return df.to_json(orient='records')

@app.route("/update_corr")
def update_corr():
    main_df = pd.DataFrame()
    for ticker in asx200['Code']:
        df = pd.read_csv(f'data/{ticker}.csv',  header=0, index_col=0)
        df['pc_change'] = (df['Adj Close'] - df['Open']) / abs(df['Open']) * 100
        df.rename(columns={'pc_change': ticker}, inplace=True)
        df.drop(['Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'], 1, inplace=True)
        main_df = main_df.join(df, how='outer')
        print(ticker)
    
    main_df.to_csv('joined_closes.csv')
    df_corr = main_df.corr()
    df_corr.to_csv('corr.csv')
    return jsonify({'message':'Complete'})

    

if __name__ == '__main__':
    app.run()