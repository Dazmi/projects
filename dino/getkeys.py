# Citation: Box Of Hats (https://github.com/Box-Of-Hats )

import win32api as wapi
import time
import ctypes

import win32api
import win32con
import ctypes


keyList = ["\b"]
for char in "ABCDEFGHIJKLMNOPQRSTUVWXYZ 123456789,.'£$/\\":
    keyList.append(char)


def cursor_x():
    flags, hcursor, (x,y) = win32gui.GetCursorInfo()
    return x

def cursor_y():
    flags, hcursor, (x,y) = win32gui.GetCursorInfo()
    return y


def key_check():
    keys = []
    for key in keyList:
        if wapi.GetAsyncKeyState(ord(key)):
            keys.append(key)
        if wapi.GetAsyncKeyState(0x01):
            keys.append("LC")
        if wapi.GetAsyncKeyState(0x02):
            keys.append("RC")
    return keys

# while(True):
#     if win32api.GetAsyncKeyState(win32con.VK_UP) != 0:
#         print('hi')

#     time.sleep(1)