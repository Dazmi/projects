import numpy as np
from grabscreen import grab_screen
import cv2
import time
import pandas as pd
import random
from statistics import median, mean
from collections import Counter
from random import shuffle

import tensorflow as tf
from tensorflow import keras
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import TensorBoard

import pyautogui
from getkeys import key_check
from directkeys import *
import win32api
import win32con


goal_steps = 500
score_requirement = 35
initial_games = 20

WIDTH = 256
HEIGHT = 144


def IsDone():
    #print(pyautogui.position()) #Point(x=974, y=372)
    reg = (0,0,1919,1078)
    screen = grab_screen(region=reg)
    #print(screen[500, 1000])
    if [83, 83, 83] in screen[500, 1000]:
        return True
    else: 
        return False


def neural_network_model():

    model = keras.Sequential([
        keras.layers.Conv2D(1, (3, 3), activation='relu', input_shape=[HEIGHT, WIDTH, 1], padding='same'),
        keras.layers.BatchNormalization(),
        keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        keras.layers.MaxPooling2D(pool_size=(3,3), padding='valid', strides=2),
        keras.layers.Dropout(0.1),
        keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        keras.layers.MaxPooling2D(pool_size=(3,3), padding='valid', strides=2),
        keras.layers.Dropout(0.1),
        keras.layers.Flatten(),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(128, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(64, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(32, activation='relu'),
        keras.layers.Dropout(0.1),
        keras.layers.Dense(3, activation='softmax')
    ])
    #rmsprop
    opt = keras.optimizers.SGD(lr=0.01, decay=1e-6, momentum=0.9)
    model.compile(optimizer=opt,
                loss='categorical_crossentropy', 
                metrics=['accuracy'])
    
    print(model.summary())

    return model

    
def balance():
    training_data = np.load('saved.npy', allow_pickle=True)
    shuffle(training_data)
    print(Counter(training_data[:,1]))
    nothing = []
    jump = []
    duck = []
    for data in training_data:
        img = data[0]
        choice = data[1]
        if choice == 0:
            nothing.append([img,choice])
        elif choice == 1:
            jump.append([img,choice])
        elif choice == 2:
            duck.append([img,choice])
        else:
            print('no matches')

    nothing = nothing[:len(jump)]

    final_data = nothing + jump + duck
    shuffle(final_data)
    np.save('training_data.npy', final_data)

    
def train_model():

    balance()

    train = np.load('training_data.npy', allow_pickle=True)
    print(Counter(train[:,1]))
    # X = np.array([])
    # for i in train:
    #     val = ()
    #     X = np.concatenate(X, i[0].reshape(-1,HEIGHT,WIDTH, 1))

    X = np.array([i[0] for i in train]).reshape(-1,HEIGHT,WIDTH, 1)

    y = [i[1] for i in train]
    y = tf.one_hot(y, 3)

    print(X)
    
    model = neural_network_model()

    name = 'model.{}'.format(int(time.time()))
    tensorboard  = TensorBoard(log_dir=f'.\logs\{name}')

    
    model.fit(X, y, epochs=4, shuffle=True, callbacks=[tensorboard], batch_size = 128)
    model.save_weights('my_model_weights.h5')
    return model


def initial_population(pred):
    if (pred == 1):
        model = neural_network_model()
        model.load_weights('my_model_weights.h5')

    # [OBS, MOVES]
    training_data = []
    # all scores:
    scores = []
    # just the scores that met our threshold:
    accepted_scores = []

    # iterate through however many games we want:
    for game in range(initial_games):
        print(game)
        score = 0
        # moves specifically from this environment:
        game_memory = []
        # previous observation that we saw
        prev_observation = []
        # for each frame in 200
        
        PressKey(0x20)
        ReleaseKey(0x20)
        for frame in range(goal_steps):
            # choose random action (0 or 1)

            observation = grab_screen(region=(0,0,1919,1079)) 
            observation = cv2.cvtColor(observation, cv2.COLOR_BGR2GRAY)
            observation = cv2.resize(observation, (256,144))

            done = IsDone()
            reward = 1
            action = 0

            if (pred == 1):
                observation = observation.reshape(-1,HEIGHT, WIDTH, 1)
                action = np.argmax(model.predict(observation))
                #print(model.predict(observation))
                print(action)
                
                if action == 1:
                    PressKey(0x26)
                    ReleaseKey(0x26)
                if action == 2:
                    PressKey(0x28)
                    ReleaseKey(0x28)


            elif (pred == 2):
                if win32api.GetAsyncKeyState(win32con.VK_UP) != 0:
                    action = 1 
                if win32api.GetAsyncKeyState(win32con.VK_DOWN) != 0:
                    action = 2
                if win32api.GetAsyncKeyState(0x51) != 0:
                    done = True

            else:
                action = random.randrange(0,2) 
            
                if action == 1:
                    PressKey(0x26)
                    ReleaseKey(0x26)
                if action == 2:
                    PressKey(0x28)
                    ReleaseKey(0x28)
            
            if len(prev_observation) > 0 :
                game_memory.append([prev_observation, action])
            prev_observation = observation
            score+=reward
            if done: 
                print(score)
                time.sleep(2)
                break
            if frame == goal_steps: break

        if score >= score_requirement:
            accepted_scores.append(score)
            for data in game_memory:
                training_data.append([data[0], action])

        scores.append(score)
    
    if training_data:
        try:
            prev_data = list(np.load('saved.npy', allow_pickle=True))
            prev_data.append(training_data)
        except Exception as e:print(e)
        # just in case you wanted to reference later
        training_data_save = np.array(training_data)
        np.save('saved.npy',training_data_save)
    
    # some stats here, to further illustrate the neural network magic!
    print('Average accepted score:',mean(accepted_scores))
    print('Median score for accepted scores:',median(accepted_scores))
    print(Counter(accepted_scores))
    
    return training_data

if __name__ == "__main__":

    # 0 - random
    # 1 - predict
    # 2 - supervised
    #training_data = initial_population(0)
    #train_model()

    train = np.load('training_data.npy', allow_pickle=True)

    print(train[0][0].shape)





