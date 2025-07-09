import cv2
import numpy as np

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (400, 100))
    _, thresh = cv2.threshold(resized, 127, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh
