
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



def get(ticker):
    try:
        print(ticker)
        df = web.DataReader(f'{ticker}.ax', 'yahoo')
        df.to_csv(f'data/{ticker}.csv')
    except Exception as e: print(e)

def thread_get():
    start = time.time()
    asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1)
    pool = ThreadPool(20)
    results = pool.map(get, asxlist['ASX code'])
    pool.close()
    pool.join()
    print(time.time() - start)

def read():
    asxlist = pd.read_csv('20190701-asx200.csv',  header=1)
    main_df = pd.DataFrame()
    for ticker in asxlist['Code']:
        df = web.DataReader(f'{ticker}.ax', 'yahoo')
        df = df.tail(1)
        df['Code'] = ticker
        main_df = main_df.append(df)
        print(main_df)
    main_df.to_csv('last_closes.csv')
    print(main_df)

def latest(ticker):
    df = pd.read_csv(f'data/{ticker}.csv',  header=0)
    df = df.tail(1)
    df['ASX code'] = ticker
    df['live_price'] = si.get_live_price(f'{ticker}.ax')
    return df

def thread_latest():
    start = time.time()
    asxlist = pd.read_csv('20190701-asx200.csv',  header=1)
    pool = ThreadPool(8)
    results = pool.map(latest, asxlist['Code'])
    pool.close()
    pool.join()
    
    asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1)
    main_df = pd.DataFrame()
    main_df = main_df.append(results)
    main_df['price_change'] = main_df['live_price'] - main_df['Adj Close']
    main_df['pc_change'] = (main_df['live_price'] - main_df['Adj Close']) / abs(main_df['Adj Close']) * 100
    main_df = pd.merge(asxlist, main_df, on='ASX code')
    main_df = main_df.drop(['Date', 'GICS industry group', 'High', 'Low', 'Open', 'Close', 'Adj Close'], axis=1)

    main_df.set_index('ASX code', inplace=True)
    main_df.to_csv('latest_data.csv')

    print(time.time() - start)

def corr():
    main_df = pd.DataFrame()
    asx200 = pd.read_csv('20190701-asx200.csv',  header=1)
    for ticker in asx200['Code']:
        df = pd.read_csv(f'data/{ticker}.csv',  header=0, index_col=0)
        df.rename(columns={'Adj Close': ticker}, inplace=True)
        df.drop(['Open', 'High', 'Low', 'Close', 'Volume'], 1, inplace=True)
        main_df = main_df.join(df, how='outer')
        print(ticker)
    
    main_df.to_csv('joined_closes.csv')
    df_corr = main_df.corr()
    df_corr.to_csv('corr.csv')
    
if __name__ == "__main__":
    try:
        corr = pd.read_csv('corr.csv',  header=0, index_col=0)
        asxlist = pd.read_csv('ASXListedCompanies.csv',  header=1)
        ticker = 'ABP'
        corr.sort_values(by=[ticker], axis=0, inplace=True, ascending=True)

        corr.drop(ticker, inplace=True)
        pos = corr[ticker].tail(5)
        neg = corr[ticker].head(5)

        asxlist.set_index('ASX code', inplace=True)
        print(asxlist)
        pos = pos.index.to_list()
        neg = neg.index.to_list()

        pos_company = asxlist.loc[pos,:]
        neg_company = asxlist.loc[neg,:]

    except Exception as e: print(e)
    