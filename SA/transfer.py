from keras.preprocessing.image import ImageDataGenerator
from keras.applications.mobilenet import preprocess_input
from keras.models import Model
from keras.layers import Dense, GlobalAveragePooling2D
from keras.callbacks import ModelCheckpoint
from keras.applications import MobileNet

# Load pre-trained model
base_model = MobileNet(weights='imagenet', include_top=False)

# Class count
img_classes = 70

# Set base model layers to untrainable
for layer in base_model.layers:
    layer.trainable = False

# Add layers on top of the base model
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)  # add dense layers for better results
x = Dense(512, activation='relu')(x)  # dense layer 2
preds = Dense(img_classes, activation='softmax')(x)  # final layer with softmax activation

# Create model
model = Model(inputs=base_model.input, outputs=preds)

# Print layer names
for i, layer in enumerate(model.layers):
    print(i, layer.name)

# Generate differenciated data by editing it every time (training)	
train_datagen = ImageDataGenerator(rotation_range=40,
                                   width_shift_range=0.2,
                                   height_shift_range=0.2,
                                   shear_range=0.2,
                                   zoom_range=0.2,
                                   horizontal_flip=True,
                                   fill_mode='nearest',
                                   preprocessing_function=preprocess_input)
# Load images from directory
train_generator = train_datagen.flow_from_directory('../food-101/train',
                                                    target_size=(224, 224),
                                                    color_mode='rgb',
                                                    batch_size=10,
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
    batch_size=10,
    class_mode='categorical',
    shuffle=True)

# Compile model with optimizer and metrics	
model.compile(optimizer='rmsprop', loss='categorical_crossentropy', metrics=['accuracy'])

# Batch size
batch_size = 32

# Steps per epoch
step_size_train = train_generator.n // train_generator.batch_size
step_size_val = val_generator.n // val_generator.batch_size

# Model checkpoints
checkpoint = ModelCheckpoint(filepath='./tmp/full_model_best.h5',
                             monitor='val_acc',
                             verbose=1,
                             save_best_only=True)

# Train model
model.fit_generator(generator=train_generator,
                    steps_per_epoch=step_size_train,
                    epochs=10,
                    validation_data=val_generator,
                    validation_steps=step_size_val,
                    verbose=1,
                    callbacks=[checkpoint])

# Save model to file
model.save('./tmp/full_after_10.h5')
