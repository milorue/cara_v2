import React from 'react';
import {Dimensions, Image, Picker, ScrollView, StyleSheet, TouchableHighlight, View} from 'react-native';
import {
    Button,
    Caption,
    Card,
    Dialog,
    List,
    Modal,
    Paragraph,
    Provider,
    Subheading,
    TextInput
} from "react-native-paper";
import MapView, {Marker, ProviderPropType} from "react-native-maps";
import {RemoteMongoClient, Stitch} from 'mongodb-stitch-react-native-sdk';
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions'
import Map from "./Map";

import fakeMarker from '../assets/fakeMarker.png'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;



export default class FeatureMap extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            markers: undefined,
            name: '',
            description: '',
            type: 'other',
            markerId: undefined,
            location: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.0101,
                longitudeDelta: 0.0101,
            },
            addedLatitude: null,
            addedLongitude: null,
            modalVisible: false,
            markersListVisible: false,
            markerImage: null,
            markerImageBlob: null,
        }
    }

    componentDidMount(){

        this.getPermissionAsync()

        this.loadMarkers()

        navigator.geolocation.getCurrentPosition(position => {
            this.setState({location: {latitude: position.coords.latitude, longitude: position.coords.longitude,
                    latitudeDelta: 0.0101, longitudeDelta: 0.0101}});
        },
            (error) => alert(JSON.string(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    }

    // parseBlob = (blob) =>{
    //     return URL.createObjectURL(blob);
    // }

    renderMarkers = () =>{
        if(this.state.markers !== undefined){
            return this.state.markers.map((markerInfo) =>{
                return(
                    <Marker key={markerInfo._id} onPress={e => e.showCallout} title={markerInfo.name} description={markerInfo.description} pinColor={'blue'} coordinate={markerInfo.coordinates}>
                        <MapView.Callout tooltip>
                            <TouchableHighlight onPress={() => this.console(markerInfo._id + ' pressed')}>
                                    <Card style={{width: width/2}}>
                                        <Card.Title title={markerInfo.name} titleStyle={{fontSize: 10}}/>
                                        <Card.Content>
                                            <Card.Cover source={{uri: "https://picsum.photos/200/100"}} style={{height: 100}}/>
                                            <Caption style={{fontSize: 8}}>Type: {markerInfo.type}</Caption>
                                            <Paragraph style={{fontSize: 10}}>{markerInfo.description}</Paragraph>
                                        </Card.Content>
                                    </Card>
                            </TouchableHighlight>

                        </MapView.Callout>
                    </Marker>
                )
            })
        }
    };

    goBack = () =>{
        this.props.navigation.goBack();
    };

    showModal = () => {
        this.setState({modalVisible: true})
    }

    hideModal = () => {
        this.setState({modalVisible: false})
    }

    getRegionCenter = region =>{
        this.setState({
            addedLatitude: region.latitude,
            addedLongitude: region.longitude,
            location:{ latitude: region.latitude, longitude: region.longitude,
                latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta},
        });
    };

    renderMarkerList = () =>{
        if(this.state.markersListVisible && this.state.markers !== undefined){
            return(this.state.markers.map((markerInfo) => {
                return(
                    <List.Item key={markerInfo._id} title={markerInfo.name}
                    left={props => <List.Icon {...props} icon={'pin'} color={'#DE606D'}/>}
                     onPress={() => console.log('pin press')}/>
                )
            }))
        }
    };

    openMarkerList = () =>{
        this.setState({markersListVisible: true});
        this.loadMarkers()
    };

    closeMarkerList = () =>{
        this.setState({markersListVisible: false});
    };

    createMarker= () =>{
        let marker = {
            coordinates:{
                latitude: this.state.addedLatitude,
                longitude: this.state.addedLongitude,
            },
            name: this.state.name,
            description: this.state.description,
            type: this.state.type,
            image: this.state.markerImageBlob,

        }

        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const markers = db.collection('markers');
        console.log('inserting a marker')
        markers.insertOne({
            name: marker.name,
            description: marker.description,
            type: marker.type,
            image: marker.image,
            coordinates:{
                latitude: marker.coordinates.latitude,
                longitude: marker.coordinates.longitude,
            },
            date: new Date(),
            recent: true,
        }).then(()=>{
            this.setState({name: ''});
            this.setState({description: ''});
            this.setState({type: ''});
            this.setState({image: null});
            this.setState({addedLatitude: null});
            this.setState({addedLongitude: null});
            console.log('insert marker success')
        })
            .catch(err => {
                console.warn(err)
            });
    };


    loadMarkers(){
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const markers = db.collection('markers');
        markers.find({recent: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({markers: docs});
            })
            .catch(err =>{
                console.warn(err)
            })
    }

    getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ markerImage: result.uri});
      let response = await fetch(result.uri)
      let blob = await response.blob();
      this.setState({markerImageBlob: blob})
    }
  };

    render(){
        let {markerImage} = this.state
        return(
        <Provider>
            <View style={styles.container}>
                <MapView
                provider={this.props.provider}
                region={
                    {
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude,
                        latitudeDelta: this.state.location.latitudeDelta,
                        longitudeDelta: this.state.location.longitudeDelta,
                    }
                }
                onRegionChangeComplete={this.getRegionCenter}
                style={styles.map}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsBuildings={true}
                moveOnMarkerPress={false}>
                    {this.renderMarkers()}
                </MapView>
                <View style={styles.fixedMarker}>
                    <Image style={styles.marker} source={fakeMarker}/>
                </View>
                <View style={styles.interactionLayer}>
                    <Button mode={'contained'} icon={'pin'} color={'white'} style={styles.addButton} onPress={this.openMarkerList}>View All</Button>
                    <Button mode={'contained'} icon={'plus'} color={'#000556'} style={styles.addButton} onPress={this.showModal}>Add</Button>
                    <Button mode={'contained'} icon={'arrow-left'} color={'white'} style={styles.addButton} onPress={this.goBack}>Go Back</Button>
                </View>
                <Modal visible={this.state.modalVisible} onDismiss={this.hideModal}
                style={styles.addModal}>
                    <View style={{backgroundColor: 'white', height: height/1.5, width: width/1.3, left: '12%', borderRadius: 5, alignItems: 'center'}}>
                        <ScrollView>
                        <View style={{backgroundColor: 'lightgrey', marginTop: 10, width: width/1.4, paddingHorizontal: width/10, alignItems: 'center'}}>
                        <Subheading>What type of feature?</Subheading>
                        <Picker
                        selectedValue={this.state.type}
                        onValueChange={(itemValue, itemIndex) =>
                        this.setState({type: itemValue})}
                        style={{width: width/2}}
                        mode={'dropdown'}>
                            <Picker.Item label={'Construction'} value={'construction'}/>
                            <Picker.Item label={'Ramp'} value={'ramp'}/>
                            <Picker.Item label={'Stairs'} value={'stair'}/>
                            <Picker.Item label={'Hazard'} value={'hazard'}/>
                            <Picker.Item label={'Other'} value={'other'}/>
                        </Picker>
                            </View>
                        <View style={{backgroundColor: 'lightgrey', marginTop: 10, paddingHorizontal: width/10, width: width/1.4, alignItems: 'center', paddingBottom: 10}}>
                            <Subheading>Provide a name</Subheading>
                            <TextInput label={'Feature name'}
                            value={this.state.name}
                            onChangeText={name => this.setState({name: name})}
                            type={'outlined'}
                            selectTextOnFocus={true}
                            style={{width: width/1.5, fontColor: '#4D4CB3'}}
                            dense={true}/>
                        </View>
                        <View style={{backgroundColor: 'lightgrey', marginTop: 10, paddingHorizontal: width/10, width: width/1.4, alignItems: 'center', paddingBottom: 10}}>
                            <Subheading>Provide a description</Subheading>
                            <TextInput label={'Feature description'}
                            value={this.state.description}
                            onChangeText={description => this.setState({description: description})}
                            type={'outlined'}
                            selectTextOnFocus={true}
                            style={{width: width/1.5, fontColor: '#4D4CB3'}}
                            dense={true}
                            multiline={true}
                            numberOfLines={5}/>
                        </View>
                        <View style={{backgroundColor: 'lightgrey', marginTop: 10, paddingHorizontal: width/10, width: width/1.4, alignItems: 'center', paddingBottom: 10}}>
                            <Subheading>Provide a picture</Subheading>
                            <Image source={{uri: markerImage}}
                            style={{width: width/1.5, height: width/2.5, marginBottom: 20, backgroundColor: '#e1e1e1'}}/>
                            <Button mode={'contained'} icon={'image'} style={{width: width/1.5}} color={'#6670CC'} onPress={this.pickImage}>Upload Image</Button>
                        </View>
                            <View style={{backgroundColor: 'lightgrey', marginVertical: 10, paddingHorizontal: width/10, width: width/1.4, alignItems: 'center', paddingVertical: 20}}>
                                <Button mode={'contained'} color={'#DE606D'} icon={'plus'} onPress={() => {this.createMarker(); this.hideModal()}}>Submit Feature</Button>
                            </View>
                            </ScrollView>
                    </View>

                </Modal>
                <Dialog visible={this.state.markersListVisible}
                onDismiss={this.closeMarkerList}
                style={{marginTop: height/19, marginHorizontal: width/8, height: height/2, width: width/1.3, paddingVertical: 10}}>
                    <Dialog.Title>Features</Dialog.Title>
                    <ScrollView>
                        {this.renderMarkerList()}
                    </ScrollView>
                </Dialog>
            </View>
        </Provider>
        )
    }

}

Map.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center'
    },
    map:{
        ...StyleSheet.absoluteFillObject,
    },
    fixedMarker:{
        left: '50%',
        marginLeft: -28,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    marker:{
        height: 70,
        width: 70,
    },
    interactionLayer:{
        top: '7%',
        flexDirection: 'row',
        position: 'absolute',
    },
    addButton:{
        marginHorizontal: 10,
    },
    addModal:{
        top: '10%',
        width: width/1.3,
        backgroundColor: 'whitesmoke',
    }


})