# Dependencies
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn import metrics
import os

def prediction_model(data):
    input_np = np.array(data)
    input_np = input_np.reshape(1, -1)
    prediction = model.predict(input_np)
    return prediction[0]



# loading the datasets
script_dir = os.path.dirname(os.path.abspath(__file__))
calories = pd.read_csv(os.path.join(script_dir, "calories.csv"))
exerciseData = pd.read_csv(os.path.join(script_dir, "exercise.csv"))


# First few rows of the datasets
print("Calories.csv")
print(calories.head(), "\n")

print("Exercise.csv")
print(exerciseData.head(), "\n")

# Combining the two datasets
calories_data = pd.concat([exerciseData, calories['Calories']], axis=1)

# displaying the shape and few rows of the updated dataset
print("Combined Dataset:")
print(calories_data.head())
print("Shape: ", calories_data.shape, "\n")

# Checking for missing data
print("Column \tMissing Values in Column")
print(calories_data.isnull().sum(), "\n")

# displaying information about the data
calories_data.info()


# DATA ANALYSIS PART
# Numerical Information regarding the dataset
calories_data.describe()


# DATA VISUALIZATION
sns.set_theme()

# Plotting the Gender Column with custom colors
gender_colors = {"male": "#3498db", "female": "#e74c3c"}
sns.countplot(x='Gender', hue='Gender', data=calories_data, palette=gender_colors, legend=False)
plt.title("Gender Distribution")
# plt.show()

# Distribution of Age
sns.displot(calories_data['Age'])
plt.title("Age Distribution")
plt.tight_layout()
# plt.show()

# Distribution of Height
sns.displot(calories_data['Height'])
plt.title("Height Distribution")
plt.tight_layout()
# plt.show()

# Distribution of Weight
sns.displot(calories_data['Weight'])
plt.title("Weight Distribution")
plt.tight_layout()
# plt.show()

# Distribution of Duration
sns.displot(calories_data['Duration'])
plt.title("Duration Distribution")
plt.tight_layout()
# plt.show()

# Distribution of Heart_Rate
sns.displot(calories_data['Heart_Rate'])
plt.title("Heart_Rate Distribution")
plt.tight_layout()
# plt.show()

# Distribution of Body_Temp
sns.displot(calories_data['Body_Temp'])
plt.title("Body_Temperature Distribution")
plt.tight_layout()
# plt.show()

# FINDING CORRELATION AND CONSTRUCTING HEATMAP
# Replacing Male with 1 and Female with 0 and converting Duration from minutes to seconds
calories_data['Gender'] = calories_data['Gender'].map({'male': 0, 'female': 1})
calories_data['Duration'] = calories_data['Duration'] * 60

# Finding the correlation
correlation = calories_data.corr()

# Plotting the heatmap
plt.figure(figsize=(10, 10))
sns.heatmap(correlation, cbar=True, square=True, fmt='.1f', annot=True, annot_kws={'size':8}, cmap='coolwarm')
plt.title("Correlation Heatmap")
# plt.show()


# Separating Feature Space and Label Space
X = calories_data.drop(columns=['User_ID', 'Calories'])
Y = calories_data['Calories']

# Splitting the dataset into training and testing data
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=40)
print("Training Data Shape: ", X_train.shape, Y_train.shape)
print("Testing Data Shape: ", X_test.shape, Y_test.shape, "\n")

# MODEL TRAINING
model = XGBRegressor()
model.fit(X_train, Y_train)

# MODEL EVALUATION
# Predicting the values
test_predict = model.predict(X_test)

print(f"{'Predicted':>12} {'Actual':>12}")
for pred, actual in zip(test_predict[:5], Y_test[:5].values):
    print(f"{pred:12.2f} {actual:12.2f}")

# Evaluating the model
print("Mean Absolute Error: ", metrics.mean_absolute_error(Y_test, test_predict))
