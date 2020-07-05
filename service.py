from flask import Flask, jsonify, request
import requests

application = app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/', methods = ['GET'])
def home():
    return 'Hello MR.NAM'

def getRegressionData(t):
    url = 'https://first-project-2e810.firebaseio.com/regression/' + str(t) + '.json'
    return requests.get(url).json()

def getLastData():
    url = 'https://first-project-2e810.firebaseio.com/iot.json'
    values = requests.get(url).json().values()
    last = sorted(values, key = lambda value: value['time'])[-1]
    return last

@app.route('/current' , methods = ['GET'])
def getCurrentWeather():
    last = getLastData()
    return jsonify({ 'temperature': last['temperature'], 'humidity': last['humidity'] })

@app.route('/next/<int:t>', methods = ['GET'])
def getNextTemperature(t):
    current = getLastData()
    regrs = getRegressionData(t)
    nextTemp = regrs['a'] * current['temperature'] + regrs['b'] * current['humidity'] + regrs['c']
    return jsonify({ 'next': nextTemp })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug = True, threaded = True)