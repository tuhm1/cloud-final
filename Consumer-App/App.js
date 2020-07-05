import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity, Picker, ImageBackground } from 'react-native';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function getCurrent() {
  return fetch('http://cloudfinal-env.eba-bpp9siaa.us-east-2.elasticbeanstalk.com/current')
    .then(response => response.json())
}
function getNext(timeOffset) {
  return fetch(`http://cloudfinal-env.eba-bpp9siaa.us-east-2.elasticbeanstalk.com/next/${timeOffset}`)
    .then(response => response.json())
}

const App = () => {
  const [timeOffset, setSelectedValue] = useState(30);
  const [{ temperature, humidity, next }, setData] = useState({ temperature: 0, humidity: 0, next: 0 });

  useEffect(() => {
    const refresh = setInterval(() => {
      Promise.all([getCurrent(), getNext(timeOffset)])
        .then(([current, { next }]) => setData({ ...current, next }));
    }, 3000);
    return () => clearInterval(refresh);
  }, [timeOffset])

  return (
    <>
      <View style={styles.container}>
        <ImageBackground style={styles.imageBackground}
          source={{ uri: 'https://i.pinimg.com/originals/7c/b4/d3/7cb4d38ddde90f06715c1d1ec9ac7a87.jpg' }} >
          <View style={styles.container}>
            <Image
              style={{ width: 100, height: 100, alignSelf: "center" }}
              source={{ uri: 'https://images-eu.ssl-images-amazon.com/images/I/61nuuPxUvaL.png' }} />
            <Text style={[{ fontSize: 50, color: 'whitesmoke', alignSelf: "center", margin: 10, opacity: 0.8 }]}>
              {temperature} &deg;C
            </Text>
            <Text style={{ fontSize: 20, color: 'whitesmoke', fontStyle: 'italic', alignSelf: "center", marginLeft: 100, opacity: 0.8 }}>
              Humidity: {humidity} %
            </Text>
          </View>
          <View style={[styles.container]}>
            <Text style={{ color: 'whitesmoke', fontSize: 20, fontStyle: 'italic', alignSelf: 'center', opacity: 0.8 }}>
              Temperature after
            </Text>
            <Picker
              style={styles.dropDown}
              selectedValue={timeOffset}
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}>
              <Picker.Item label='30 Secs' value='30' />
              <Picker.Item label='1 Min' value='60' />
              <Picker.Item label='5 Mins' value='300' />
              <Picker.Item label='10 Mins' value='600' />
              <Picker.Item label='30 Mins' value='1800' />
              <Picker.Item label='1 Hour' value='3600' />
              <Picker.Item label='2 Hours' value='7200' />
            </Picker>
            <Text style={[{ color: 'whitesmoke', fontSize: 40, paddingHorizontal: 25, paddingVertical: 5, alignSelf: 'center', opacity: 0.8 }]}>
              {next.toFixed(5)} &deg;C
            </Text>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  dropDown: {
    width: 150,
    alignSelf: 'center',
    color: 'whitesmoke',
    fontSize: 30,
    fontStyle: 'italic'
  },
  button: {
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    backgroundColor: 'darkblue',
    paddingHorizontal: 50,
    paddingVertical: 10,
    marginTop: 50
  },
  text: { textAlign: 'center' },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default App;
