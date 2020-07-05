import pandas as pd
from sklearn import linear_model
import requests
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

def readData():
    url = 'https://first-project-2e810.firebaseio.com/iot.json'
    df = pd.read_json(url).transpose()
    df['temperature'].fillna(df['temperature'].mean(), inplace = True)
    df['humidity'].fillna(df['humidity'].mean(), inplace = True)
    df['time'].fillna(df['time'].mean(), inplace = True)
    return df

def dfNextTempsAfter(df, t):
    df1 = df.copy()
    df1 = df1.loc[df1['time'] < (df1['time'].max() - t)]
    def getNextTempOf(row):
        rows = df.loc[df['time'] == row['time'] + t]
        nextTemp = df1['temperature'].mean() if rows.empty else rows.values[0][1]
        return nextTemp
    df1['next'] = df1.apply(getNextTempOf, 1)
    return df1

def splitTrainTest(data):
    sizeTrain = int(len(data) * 0.8)
    dfTrain = data[:sizeTrain]
    dfTest = data[sizeTrain:]
    return ( dfTrain, dfTest )

def test(df, regr, t):
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    tempPredict = regr.predict(df[['temperature', 'humidity']])
    ax.plot_trisurf(df['temperature'].to_numpy(), df['humidity'].to_numpy(), tempPredict, alpha=0.5)
    ax.scatter(df['temperature'], df['humidity'], df['next'], marker='.', color='red')
    ax.set_xlabel("humidity")
    ax.set_ylabel("temperature")
    ax.set_zlabel("after " + str(t) + "s")
                    
def multipleRegression(x, y):
    regr = linear_model.LinearRegression()
    regr.fit(x, y)
    return regr

def updateRegressionData(t, regr):
    url = 'https://first-project-2e810.firebaseio.com/regression/' + str(t) + '.json'
    data = { 
        'a': regr.coef_[0],
        'b': regr.coef_[1],
        'c': regr.intercept_
    }
    requests.put(url, json = data)

def main():
    df = readData()
    ts = [30, 60, 300, 600, 1800, 3600, 7200]
    for t in ts:
        df1 = dfNextTempsAfter(df, t)
        dfTrain, dfTest = splitTrainTest(df1)
        regr = multipleRegression(dfTrain[['temperature', 'humidity']], dfTrain['next'])
        updateRegressionData(t, regr)
        test(dfTrain, regr, t)
        
main()
