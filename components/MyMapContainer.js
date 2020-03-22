import React from 'react';
import { Constants } from 'expo';
import {Dimensions, View} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import googleKey from "../assets/apiKey";
import MapView, {ProviderPropType} from "react-native-maps";
import {Button, IconButton, Appbar, Modal, Searchbar, Avatar, Menu, Provider, Card, Paragraph, Dialog, Caption, Divider, List
, Drawer} from "react-native-paper";
import Map from "../screens/Map";

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

export default class MyMapContainer extends React.Component{
  render() {
    return (
        <View style={{backgroundColor: 'lightgrey', flex: 1}}>
            <Appbar.Header style={{ backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', marginBottom: 10}}>
                    <Appbar.Action icon={'menu'} onPress={() => console.log('test')}/>
                    <Appbar.Content title={'Search'}/>
                    <Appbar.Action icon={'reload'} onPress={() => console.log('reload')}/>
                </Appbar.Header>


        <GooglePlacesAutocomplete
            suppressDefaultStyles={true}
          placeholder="Start Location"
            placeholderTextColor={'black'}
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            console.log(data);
            console.log(details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: googleKey,
            language: 'en', // language of the results
            types: '', // default: 'geocode'
          }}
          styles={{
              textInputContainer:{
                  backgroundColor: 'white',
                  height: height/13,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
              },
              textInput:{
                  marginVertical: 10,
                  padding: 10,
                  height: height/18,
                  backgroundColor: 'white',
                  fontStyle: 'italic'
              },
              description: {
                  padding: 10,
                  borderRadius: 5,
                  margin: 10,

              },
              predefinedPlacesDescription: {
                  margin: 5,
                  color: '#E89F17',
                  fontWeight: 'bold',
              },
              container:{
                  marginVertical: 10,
                  marginHorizontal: 10,
              },
              listView:{
                  borderTopWidth: 2,
                  borderTopColor: 'grey',
                  backgroundColor: 'white',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
              },
              poweredContainer:{
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
              }
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
        />

        <GooglePlacesAutocomplete
            suppressDefaultStyles={true}
            placeholderTextColor={'black'}
          placeholder="End Location"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            console.log(data);
            console.log(details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: googleKey,
            language: 'en', // language of the results
            types: '', // default: 'geocode'
          }}
          styles={{
              textInputContainer:{
                  backgroundColor: 'white',
                  height: height/13,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
              },
              textInput:{
                  marginVertical: 10,
                  padding: 10,
                  height: height/18,
                  backgroundColor: 'white',
                  fontStyle: 'italic'
              },
              description: {
                  padding: 10,
                  borderRadius: 5,
                  margin: 10,

              },
              predefinedPlacesDescription: {
                  color: '#E89F17',
                  fontWeight: 'bold',
                  margin: 5,
              },
              container:{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  elevation: 2,
              },
              listView:{
                  borderTopWidth: 2,
                  borderTopColor: 'grey',
                  backgroundColor: 'white',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
              },
              poweredContainer:{
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
              }
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={
            {
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }
          }
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
        />
        <Button icon={'magnify'} mode={'contained'} style={{marginHorizontal: width/3, marginTop: 20, backgroundColor: '#44BB76'}}>Go</Button>
            </View>
    );
  }
}

MyMapContainer.propTypes = {
  provider: ProviderPropType,
};
