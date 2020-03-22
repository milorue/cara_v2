import React from 'react';
import GooglePlacesAutocomplete from "react-native-google-places-autocomplete";
import googleKey from "../assets/apiKey";

class MyMapInput extends React.Component{
    render() {
        return (
            <GooglePlacesAutocomplete
                placeholder={'Search'}
                minLength={2}
                autoFocus={true}
                returnKeyType={'search'}
                listViewDisplayed={false}
                fetchDetails={true}
                onPress={(data, details = null) => { // details is grabbed from fetch
                    props.notifyChange(details.geometry.location);
                }}
                query={{
                    key: googleKey,
                    language: 'en'
                }}
                nearbyPlacesAPI={'GooglePlacesSearch'}
                debounce={200}/>
        )
    }
}

export default MyMapInput;