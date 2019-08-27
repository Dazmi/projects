import ctypes
from directkeys import *
import time
import random
import pandas as pd 
import numpy as np
from urllib.request import Request, urlopen
import re
from win32gui import GetWindowText, GetForegroundWindow
import keys as k

keys = k.Keys({})

W = 0x57
A = 0x41
S = 0x53
D = 0x44

one = 0x31
two = 0x32
three = 0x33
four = 0x34
five = 0x35

ctrl = 0x11
spacebar = 0x20
shift = 0xA0

#815
def right(x):
    keys.directMouse(x, 0)

def left(x):
    keys.directMouse(-x, 0)

def up(x):
    keys.directMouse(0, -x)

def down(x):
    keys.directMouse(0, x)

def oneeighty():
    keys.directMouse(1630, 0)

def press(x):
    PressKey(x)
    ReleaseKey(x)


def dash():
    PressKey(ctrl)
    time.sleep(0.03)
    PressKey(spacebar)
    time.sleep(0.1)
    ReleaseKey(ctrl)
    ReleaseKey(spacebar)

def focus():
    press(five)
    time.sleep(0.4)

    PressKey(ctrl)
    time.sleep(0.03)
    PressKey(spacebar)
    time.sleep(0.1)
    ReleaseKey(spacebar)
    time.sleep(0.3)
    oneeighty()
    
    PressKey(ctrl)
    time.sleep(0.04)
    PressKey(spacebar)
    PressKey(spacebar)
    time.sleep(0.1)
    ReleaseKey(ctrl)
    ReleaseKey(spacebar)
    time.sleep(0.2)
    oneeighty()
    
    press(five)
    time.sleep(0.7)
    
    
    


