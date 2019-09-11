import numpy as np
import cv2
import time
import pandas as pd
import random
import os
import pyautogui
import win32api
import win32con
from statistics import median, mean
from collections import Counter
from random import shuffle

import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
from tensorflow.keras.callbacks import TensorBoard

from grabscreen import grab_screen
from getkeys import key_check
from directkeys import *


goal_steps = 500
score_requirement = 80
initial_games = 5

WIDTH = 256
HEIGHT = 144

SCREEN_REG = (0,0,1919,1079)

dirName = 'data'
if not os.path.exists(dirName):
    os.mkdir(dirName)

def IsDone():
    # to find location of pixel use
    # print(pyautogui.position())
    screen = grab_screen(region=SCREEN_REG)
    if [83, 83, 83] in screen[500, 1000]:
        return True
    else: 
        return False


def neural_network_model():

    # create layers for model
    model = keras.Sequential([
        keras.layers.Flatten(input_shape=[HEIGHT, WIDTH, 1]),
        keras.layers.BatchNormalization(),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(2, activation='softmax')
    ])

    # define optimizer for model
    opt = keras.optimizers.SGD(lr=1e-3, decay=1e-6, momentum=0.9)
    # compile model for fitting
    model.compile(optimizer='adam',
                loss='categorical_crossentropy', 
                metrics=['accuracy'])
    
    # review the model
    print(model.summary())
    return model

def train_model():

    training_data = pd.read_pickle('./data/saved.pkl')

    # make data samples to an array
    X = np.array([i[0] for i in training_data.values]).reshape(-1,HEIGHT,WIDTH, 1)

    # create target labels are a one hot array
    y = pd.get_dummies(training_data['label'].astype(int))

    # split data into for training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, stratify=y, random_state=0)

    # call the model
    model = neural_network_model()

    # load previously trained model
    try:
        model.load_weights('./data/my_model_weights.h5')
    except Exception as e:print(e)

    # use callbacks to review the model learning rate
    name = 'model.{}'.format(int(time.time()))
    tensorboard  = TensorBoard(log_dir=f'.\logs\{name}')

    # train the model
    model.fit(X_train, y_train, epochs=10, shuffle=True, callbacks=[tensorboard])

    model.evaluate(X_test, y_test)
    model.save_weights('./data/my_model_weights.h5')
    return model

def predictAction(model, observation):

    # reshape image prediction
    observation = observation.reshape(-1,HEIGHT, WIDTH, 1)
    action = np.argmax(model.predict(observation))
    # jump
    if action == 1:
        PressKey(0x26)
        ReleaseKey(0x26)
    # duck
    if action == 2:
        PressKey(0x28)
        ReleaseKey(0x28)

def supervisedAction(*args):
    action = 0
    # key up
    if win32api.GetAsyncKeyState(win32con.VK_UP) != 0:
        action = 1 
    # key down
    if win32api.GetAsyncKeyState(win32con.VK_DOWN) != 0:
        action = 2
    #space
    if win32api.GetAsyncKeyState(0x51) != 0:
        done = True
    return action

def randomAction(*args):
    action = random.randrange(0,3) 
    # key up
    if action == 1:
        PressKey(0x26)
        ReleaseKey(0x26)
    # key down
    if action == 2:
        PressKey(0x28)
        ReleaseKey(0x28)
    return action



def initial_population(useAction):

    if (useAction == predictAction):
        # import model
        model = neural_network_model()
        model.load_weights('./data/my_model_weights.h5')
    else:
        model = 0

    # [OBS, MOVES]
    training_data = pd.DataFrame()
    # all scores:
    scores = []
    # just the scores that met our threshold:
    accepted_scores = []

    # iterate through however many games we want:
    for game in range(initial_games):
        print(game)
        score = 0
        # initialise game valiables
        game_memory = pd.DataFrame()

        PressKey(0x20)
        ReleaseKey(0x20)
        for frame in range(goal_steps):
            # capture in game frames
            observation = grab_screen(region=SCREEN_REG) 
            observation = cv2.cvtColor(observation, cv2.COLOR_BGR2GRAY)
            observation = cv2.resize(observation, (WIDTH,HEIGHT))
            
            # gather environment variables
            done = IsDone()
            reward = 1
            action = useAction(model, observation)

            # add frames and action to game memory
            game_memory = game_memory.append({'data':observation, 'label':action}, ignore_index=True)

            # increase the score with the reward
            score+=reward
            if done: 
                print(score)
                time.sleep(2)
                break
            if frame == goal_steps: break
        # save the data when the score exceeds the requirements
        if score >= score_requirement:
            accepted_scores.append(score)
            training_data = training_data.append(game_memory, ignore_index=True)
        scores.append(score)

    # save the data
    try:
        prev_training = pd.read_pickle('./data/saved.pkl')
        training_data = training_data.append(prev_training, ignore_index=True)
    except Exception as e:print(e)
    training_data.to_pickle('./data/saved.pkl')
    
    # some stats here, to further illustrate the neural network magic!
    print('Average accepted score:',mean(accepted_scores))
    print('Median score for accepted scores:',median(accepted_scores))
    print(Counter(accepted_scores))
    
    return training_data

if __name__ == "__main__":

    # 0 - random
    # 1 - predict
    # 2 - supervised

    initial_population(randomAction)
    train_model()
    initial_population(predictAction)






