from flask import Flask, request, jsonify, redirect
from flask import render_template 
from convert import Currency
import urllib.request
import json

app = Flask(__name__) 

currency = Currency()

@app.route('/')
def index():
    return redirect('/static/index.html')

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

@app.route("/api/convert", methods=['POST'])
def postConvert():
    data = request.json
    response = currency.convert(
        data.get('orig'), 
        data.get('value'), 
        data.get('dest'))
    return jsonify({"response":response})

@app.route("/api/update")
def postUpdate():
    currency.update()
    return jsonify({"response":"updated"})

