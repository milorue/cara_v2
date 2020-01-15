import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {Button, IconButton, Appbar, Modal, Searchbar, Avatar} from "react-native-paper";
import MapView, {Callout, Polyline, ProviderPropType} from "react-native-maps";
import data from '/home/mrue/senior_project/cara/assets/route'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Map extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            searchQuery: '',
        }
    }

    render(){
        return(

            <View style={styles.container}>
            <MapView
                provider={this.props.provider}
                initialRegion={{
                    latitude: 42.42268,
                    longitude: -76.4952,
                    latitudeDelta: 0.0101,
                    longitudeDelta: 0.0101,
                }}
                style={styles.map}>

                <Polyline coordinates={data}
                          strokeColor={'#F00000'}
                          strokeWidth={1}/>
            </MapView>
                <View style={styles.interactionLayer}>
                    <Searchbar placeholder={'Find a route'} onChangeText={search => {this.setState({searchQuery: search});}} value={this.state.searchQuery}/>
                    <View style={styles.buttonContainer}>
                        <Button mode={'contained'} onPress={()=> console.log('Search button')} color={'white'} style={styles.bottomButtons}
                        icon={'star'}>
                            Favorites</Button>
                        <Button mode={'contained'} onPress={()=> console.log('Hazard button')} color={'#EE5B5C'} style={styles.bottomButtons}
                            icon={'pin'}>
                            Add Hazard</Button>
                    </View>
                </View>


            </View>
        )
    }
}

Map.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
      justifyContent: 'flex-start'
  },
  map: {
      ...StyleSheet.absoluteFillObject,
  },
    interactionLayer:{
      flexDirection: 'column',
        marginVertical: 30,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    bottomButtons:{
      marginHorizontal: 10,
        height: height/20,
    },
    buttonContainer:{
      flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center'
    },
    topContainer:{
      flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: height/20,

    },
    searchBar: {
      marginTop: height/32,
    }
});