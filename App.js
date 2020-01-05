import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Polyline, ProviderPropType} from "react-native-maps";
import data from './assets/route.js'
const COORDINATES = [
  { latitude: 43.8025259, longitude: -122.4351431 },
  { latitude: 37.7896386, longitude: -122.421646 },
  { latitude: 37.7665248, longitude: -122.4161628 },
  { latitude: 37.7734153, longitude: -122.4577787 },
  { latitude: 37.7948605, longitude: -122.4596065 },
  { latitude: 37.8025259, longitude: -122.4351431 },
];

console.log(data)

export default class App extends React.Component {

  render()
  {
    return (
        <MapView
            provider={this.props.provider}
            initialRegion={{
              latitude: 42.42268,
              longitude: -76.4952,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}>

          <Polyline coordinates={data}
                    strokeColor={'#F00000'}
                    strokeWidth={1}/>


        </MapView>

    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
