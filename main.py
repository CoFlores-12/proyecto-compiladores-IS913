from flask import Flask 
from flask import render_template 
from convert import Currency
import urllib.request
import json

app = Flask(__name__) 

currency = Currency()

@app.route("/")
def hello():
    return render_template('index.html') 

@app.route("/api/lastest")
def getData():
    return currency.getData()

@app.route("/api/symbols")
def getSymbols():
    return currency.getSymbols()

@app.route("/api/date")
def getDate():
    return currency.getDate()

@app.route("/api/history")
def getHistory():
    return currency.getHistory()

if __name__ == "__main__": 
    app.run(debug=True)