# StockPredictor
A mobile application that offers forecasting and tracking services for stocks in the capital market.

## Table of Contents

- [Project Description](#Project-Description)
- [Features](#Features)
- [Technologies and Libraries](#Technologies-and-Libraries)
- [Installation](#installation)
- [Extensions](#Extensions)
- [Credits](#credits)
- [Contact](#contact)
  
## Project Description
StockPredictor is an application with two services:  
* The application offers daily tracking services for stocks in the capital market with a convenient and interactive UI.  
* The application offers stock forecasting services for value investors, where with the help of machine learning - the application predicts what the percentage change of any stock will be at the end of the calendar year.  

<div align="center">
    <img src="https://github.com/TomerElal/StockPredictor/assets/126855038/470a1e23-c4c9-4173-bc88-97c8c8fec05e" width="332" />
    <img src="https://github.com/TomerElal/StockPredictor/assets/126855038/2c99eac7-452f-4fef-bf3e-dc8350beefae" width="332" />
    <img src="https://github.com/TomerElal/StockPredictor/assets/126855038/8a75e49e-5e4e-41ef-8265-9368803bf04f" width="332" />
</div>

## Features
- The user can edit his stock watchlist as he wishes - adding/removing stocks and moving their order.  
- Certain preferences can be set in the application such as display settings and changing the currency type.  
- The application is responsive to a variety of mobile devices.  
- It is possible to display share prices of different time ranges, from the last trading day to several years back.  
- A very convenient interface for operating and maintaining a preferred watch list of stocks.  
- Detailed description of each stock's company.  

## Technologies and Libraries
- **Expo tech** for mobile developers: The application was developed with the help of the React-Native library, which provides a convenient and efficient environment for developing mobile applications for 
  Android and IOS operating systems. With the help of Expo's application development technology, it was possible to see visual changes in the application in real time, thus enabling a better development 
  experience.  
- **Restful API** using **Flask**library: The part of the backend where the percentage change of a stock is predicted using machine learning, is coded using a Python script that mobile operating systems 
  do not know how to run. Therefore, a RESTAPI request in the POST method is needed where the script receives an input with the name of a stock for which you want to make a prediction.  
- **Amazon Web Services (AWS)**: The Python script for running the ML prediction is saved under Amazon Web Services in the EC2 instance. When the user requests a prediction, an HTTP request is sent to the 
  public address of the instance - where with the help of the Flask library and other libraries, a prediction of the percentage of change is made and an appropriate output is returned.  
- **Sklearn** library: The machine learning model was built using the sklearn library with the Random Forest algorithm in regression.  
- **Gunicorn** Web Server Gateway Interface: In order for the Python script to be accessible at any given time, a server is needed that will run it without interruption and will be able to receive 
  requests spontaneously and simultaneously from several users.  
- **Joblib library**: In order not to recalculate the machine model for training every run, I saved the trained model in a binary file with the help of the Joblib library, which allows saving objects to 
  binary files as well as loading them when necessary.  
    
## Installation
``IOS`` : The "Expo Go" application must be installed from the App Store, copy the following link to the search bar on the iPhone and the application will open automatically.  
link IOS - 
```
exp://u.expo.dev/update/7da4228b-bb15-4802-b305-34cc59d56ac7
```  
  
``Android`` : The "Expo Go" application must be installed from the Google Play Store. Inside the expo app copy the following link and you will be directed to Stock Predictor immediately.  
link Android - 
```
exp://u.expo.dev/update/04e65d98-ba43-416a-b7ee-a0a09d6169c4
```  
  
you can also scan the following QR codes (left for IOS) :  
<div align='center'>
  <img src='https://github.com/TomerElal/StockPredictor/assets/126855038/e6c2074e-0356-403f-b7d0-2c800a8ff294' width=350 style="margin-right: 200;"/>
  <img src='https://github.com/TomerElal/StockPredictor/assets/126855038/3eeb41b9-670f-4690-af7f-a4d7f99d525e' width=350/>
</div>


## Extensions
In the future, interactivity between users will also be added - for example stock rating or stock prediction rating.  
A feature can be added later that will allow the user to simulate investments with virtual money and thus simulate for him the profits/losses that his investment choices would have yielded.  
In this way, it is also possible to simulate the quality of the forecast that the application performs for each stock.  
It should be noted that this feature will require the storage of a lot of data, which means that each user will have to make an initial registration for the application, and DataBase servers will be needed for the purpose of saving and storing all the data.  


## Credits
Stock price data, fundamental analysis, technical data and financial reports were taken from the API'S of **"Yahoo Finance"** and ***"AlphaVantage"***.  

## Contact
- Email: tomerelal1@gmail.com  
- Linkedin: https://www.linkedin.com/in/tomer-elal-635449247/  
