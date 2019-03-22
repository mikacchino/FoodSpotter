from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from keras.applications.vgg16 import preprocess_input

# load model
model = load_model('./tmp/full_after_40.h5')

# predicting images
img = image.load_img('../food-101/train/apple_pie/2612593.jpg')
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)

pred = model.predict(x)

print("Probability: ")
print(pred[0])
