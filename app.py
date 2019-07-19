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
import os

app = Flask(__name__)
CORS(app)
asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1)
asxlist.rename(columns={'ASX code': 'Code'}, inplace=True)
asx200 = pd.read_csv('20190701-asx200.csv',  header=1)
corr = pd.read_csv('corr.csv',  header=0, index_col=0)
latest = pd.read_csv('latest_data.csv',  header=0, index_col=0)

dirName = 'data'
if not os.path.exists(dirName):
    os.mkdir(dirName)

@app.route("/monitor")
def monitor():
        last_bytes_sent = 0
        last_bytes_received = 0

        cpu_percent = psutil.cpu_percent()
        memory_percent = psutil.virtual_memory().percent
        disk_percent = psutil.disk_usage('/').percent
        network_io = psutil.net_io_counters()
        boottime = dt.datetime.fromtimestamp(psutil.boot_time()).strftime("%d/%m/%Y")

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
    try:
        df = pd.read_csv(f'data/{ticker}.csv',  header=0, index_col=0)
    except:
        df = web.DataReader(f'{ticker}.ax', 'yahoo')
    
    df = df.reset_index()
    df = df.round({'Adj Close': 3, 'Volume': 0})
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        
    starttime = []
    if timeframe == 'week':
        starttime = df['Date'].tail(1) - pd.DateOffset(weeks=1)
    elif timeframe == 'month':
        starttime = df['Date'].tail(1) - pd.DateOffset(months=1)
    elif timeframe == '6_months':
        starttime = df['Date'].tail(1) - pd.DateOffset(months=6)
    elif timeframe == 'year':
        starttime = df['Date'].tail(1) - pd.DateOffset(years=1)
    elif timeframe == '5_years':
        starttime = df['Date'].tail(1) - pd.DateOffset(years=5)
    elif timeframe == 'max':
        starttime = df['Date'].head(1)

    data = df.loc[df.loc[:,'Date'].values > starttime.values,:]

    X_data = data['Date'].dt.strftime('%d/%m/%Y')
    X_data = X_data.tolist()
    Y_data = data['Adj Close']
    Y_data = Y_data.tolist()
    volume = data['Volume'].tolist()

    asxindex = asxlist.set_index('Code')
    company = asxindex.loc[ticker,:]

    corr = pd.read_csv('corr.csv',  header=0, index_col=0)
    corr.sort_values(by=[ticker], axis=0, inplace=True, ascending=True)
    corr.drop(ticker, inplace=True)
    pos = corr[ticker].tail(5).index.to_list()
    neg = corr[ticker].head(5).index.to_list()


    pos_company = latest.loc[pos,:]
    neg_company = latest.loc[neg,:]

    pred = latest.loc[ticker,['short_pred', 'long_pred']]
    
    pred.fillna("N/A", inplace=True)


    res = {
        'ticker':ticker,
        'labels':X_data,
        'prices':Y_data,
        'volume':volume,
        'name':company['Company name'],
        'group':company['GICS industry group'],
        'pos':pos_company['Company name'].to_list(),
        'neg':neg_company['Company name'].to_list(),
        'pc_pos':pos_company['pc_change'].to_list(),
        'pc_neg':neg_company['pc_change'].to_list(),
        'short_pred':pred['short_pred'],
        'long_pred':pred['long_pred']
    }
    return jsonify(res)

def latest_data(ticker):
    try:
        df = web.DataReader(f'{ticker}.ax', 'yahoo')
        df.to_csv(f'data/{ticker}.csv')
        df['moving_20'] = df['Adj Close'].rolling(window=20).mean()
        df['moving_100'] = df['Adj Close'].rolling(window=100).mean()
        df['std'] = df['Adj Close'].std()
        df = df.tail(1)
        df['Code'] = ticker
        return df
    except Exception as e: print(e)

def update_corr(tickers):
    print('updating correlation')
    corr_df = pd.DataFrame()
    for ticker in tickers:
        try:
            corr = pd.read_csv(f'data/{ticker}.csv',  header=0, index_col=0)
            corr['pc_change'] = (corr['Adj Close'] - corr['Open']) / abs(corr['Open']) * 100
            corr.rename(columns={'pc_change': ticker}, inplace=True)
            corr.drop(['Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close'], 1, inplace=True)
            corr_df = corr_df.join(corr, how='outer')
        except Exception as e: print(e)

    corr_df = corr_df.bfill().ffill()
    corr_df.to_csv('closes_pc.csv')
    corr_df = corr_df.tail(60)
    corr_df = corr_df.corr()
    corr_df.to_csv('corr.csv')

def summary(results):
    print('updating predictions')
    main_df = pd.DataFrame()
    main_df = main_df.append(results)
    main_df['price_change'] = main_df['Adj Close'] - main_df['Open']
    main_df['pc_change'] = (main_df['Adj Close'] - main_df['Open']) / abs(main_df['Open']) * 100
    main_df = pd.merge(asxlist, main_df, on='Code')
    main_df = main_df.round({'Adj Close': 3, 'price_change': 3, 'pc_change': 2})

    main_df.loc[main_df['Adj Close'] >= main_df['moving_20'], 'short_pred'] = 'BUY'  
    main_df.loc[main_df['Adj Close'] < main_df['moving_20'], 'short_pred'] = 'SELL' 
    main_df.loc[main_df['Adj Close'] >= main_df['moving_100'], 'long_pred'] = 'BUY'  
    main_df.loc[main_df['Adj Close'] < main_df['moving_100'], 'long_pred'] = 'SELL' 

    main_df.set_index('Code', inplace=True)
    main_df.to_csv('all_latest.csv')
    main_df.drop(['GICS industry group', 'High', 'Low', 'Open', 'Close', 'moving_20', 'moving_100'], axis=1, inplace=True)
    main_df.to_csv('latest_data.csv')

@app.route("/update")
def thread_latest():
    start = time.time()
    print('updating...')
    db = request.args['db']

    if (db == '200'):
        tickers = asx200['Code']
    if (db == 'asx'):
        tickers = asxlist['Code']

    print('fetching data')
    pool = ThreadPool(8)
    results = pool.map(latest_data, tickers)
    pool.close()
    pool.join()

    summary(results)
    update_corr(tickers)

    duration = time.time() - start
    message = {'message':'Complete', 'time':duration }
    print(message)
    return jsonify(message)


@app.route("/latest")
def get_latest():
    df = pd.read_csv('latest_data.csv', header=0)
    return df.to_json(orient='records')

@app.route('/')
def hello_world():
    target = os.environ.get('TARGET', 'World')
    return 'Hello {}!\n'.format(target)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))
