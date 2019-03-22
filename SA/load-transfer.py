from keras.preprocessing.image import ImageDataGenerator
from keras.applications.vgg16 import preprocess_input
from keras.models import load_model
from keras.callbacks import ModelCheckpoint

# Generate differenciated data by editing it every time (training)
train_datagen = ImageDataGenerator(rotation_range=40,
                                   width_shift_range=0.2,
                                   height_shift_range=0.2,
                                   shear_range=0.2,
                                   zoom_range=0.2,
                                   horizontal_flip=True,
                                   fill_mode='nearest',
                                   preprocessing_function=preprocess_input)  # included in our dependencies

# Load images from directory
train_generator = train_datagen.flow_from_directory('../food-101/train',
                                                    target_size=(224, 224),
                                                    color_mode='rgb',
                                                    batch_size=32,
                                                    class_mode='categorical',
                                                    shuffle=True)

# Generate differenciated data by editing it every time (validation)
val_datagen = ImageDataGenerator(rotation_range=40,
                                 width_shift_range=0.2,
                                 height_shift_range=0.2,
                                 shear_range=0.2,
                                 zoom_range=0.2,
                                 horizontal_flip=True,
                                 fill_mode='nearest',
                                 preprocessing_function=preprocess_input)

# Load images from directory
val_generator = val_datagen.flow_from_directory(
    '../food-101/valid',
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    shuffle=True)

# Batch size
batch_size = 32

# Steps per epoch
step_size_train = train_generator.n // train_generator.batch_size
step_size_val = val_generator.n // val_generator.batch_size

# Load the model
loaded_model = load_model("./tmp/full_after_35.h5")

# New model checkpoint
checkpoint = ModelCheckpoint(filepath='./tmp/checkpoint_40.h5',
                             monitor='acc',
                             verbose=1,
                             save_best_only=True)

# Continue training model
loaded_model.fit_generator(generator=train_generator,
                           steps_per_epoch=step_size_train,
                           epochs=5,
                           validation_data=val_generator,
                           validation_steps=step_size_val,
                           verbose=1,
                           callbacks=[checkpoint])

# Save model to file
loaded_model.save('./tmp/full_after_40.h5')
