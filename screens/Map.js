import React from 'react';
import {View, Text, StyleSheet, Dimensions, RefreshControl, ScrollView, TouchableHighlight} from 'react-native';
import {Button, IconButton, Appbar, Modal, Searchbar, Avatar, Menu, Provider, Card, Paragraph, Dialog, Caption, List} from "react-native-paper";
import MapView, {Callout, Polyline, ProviderPropType, Marker} from "react-native-maps";
import data from '/home/mrue/senior_project/cara/assets/route'
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk';

import constructionIcon from '../assets/construction.png'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Map extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            markers: undefined,
            searchQuery: '',
            favoritesVisible: false,
            favoritesList: undefined,
            modalVisible: false,
            favoriteId: null,
            route: data,
            reloadValue: 1,
            location: {
                coords: {
                    latitude: 42,
                    longitude: -76
                }
            }

        }
    }

    componentDidMount(){
        this.loadFavorites();
        this.loadMarker();
        navigator.geolocation.getCurrentPosition(position => {

            console.log(this.state.location.coords.latitude);

            this.setState({location: position})

            console.log('State is: ' + this.state.location.coords.latitude)
        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    };

    remountMap = () =>{
        this.setState(({reloadValue}) => ({
            reloadValue: reloadValue + 1
        }));
    }

    showModal = (modalId) => {
        this.setState({modalVisible: true, favoriteId: modalId});
    }

    hideModal = () => {
        this.setState({modalVisible: false});
    }


    loadFavorites(){
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const favorites = db.collection('favorites');
        favorites.find({favorite: true}, {sort: {date: -1}}) //sort by recent dates
            .asArray()
            .then(docs => {
                this.setState({favoritesList: docs});
            })
            .catch(err =>{
                console.warn(err) // warn on client error
            })
    }

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
                                            <Card.Cover source={{uri: 'https://picsum.photos/200/300'}} style={{height: 100}}/>
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

    loadMarker = () =>{
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
    };

    openFavorites = () =>{
        this.setState({favoritesVisible: true});
        this.loadFavorites();
    };

    closeFavorites = () =>{
        this.setState({favoritesVisible: false})
    };

    renderFavorites= () =>{
        if(this.state.favoritesVisible) {
            return this.state.favoritesList.map((favoriteInfo) => {
                return (
                    <List.Item key={favoriteInfo._id} title={favoriteInfo.title}
                               left={props => <List.Icon {...props} icon={'border-inside'} color={favoriteInfo.color} size={40}/>}
                               right={props => <IconButton {...props} icon={'camera-control'} onPress={() => console.log("Execute Route")}
                               color={"#14002E"} size={30}/>}
                    onPress={() => {this.showModal(favoriteInfo._id); this.closeFavorites()}} style={{paddingHorizontal: 30}}/>

                )
            });
        }else{
            return null
        }
    };

    renderFavoriteModal = () =>{

        if(this.state.modalVisible){
            let favoritesModals = this.state.favoritesList.map((favoriteInfo) => {
                return(
                    <Modal key={favoriteInfo._id} visible={this.state.modalVisible} onDismiss={this.hideModal}
                    style={{padding: 50, backgroundColor: 'transparent'}}>
                        <Card style={{marginHorizontal: 10, marginVertical: 50}} elevation={10}>
                            <Card.Title
                            title={favoriteInfo.title}/>
                            <Card.Content>
                                <Card.Cover source={{uri: favoriteInfo.image}}/>
                                <Paragraph>{favoriteInfo.description}</Paragraph>
                                <Button color={'#DE606D'} mode={'contained'}>Run Route</Button>
                            </Card.Content>
                        </Card>
                    </Modal>
                )
            })

            for(let x = 0; x<this.state.favoritesList.length; x++){
                if(this.state.favoritesList[x]._id === this.state.favoriteId){
                    return favoritesModals[x]
                }
            }

        return favoritesModals[0] // fallback 0th
        }else{
            return null // exit case
        }


    };

    goToFeatures(){
        this.props.navigation.navigate('FeatureMap')
    }

    render(){

        return(

            <Provider>


            <View style={styles.container}>

            <MapView
                key={this.state.reloadValue}
                provider={this.props.provider}
                region={
                    {
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: 0.0401,
                        longitudeDelta: 0.0101,
                    }
                }
                style={styles.map}
            showsUserLocation={true}
            followsUserLocation={true}>
                {this.renderMarkers()}
                <Polyline coordinates={this.state.route}
                          strokeColor={'#F00000'}
                          strokeWidth={4}/>
            </MapView>
                <View style={styles.interactionLayer}>
                    <Searchbar placeholder={'Find a route'} onChangeText={search => {this.setState({searchQuery: search});}} value={this.state.searchQuery}/>
                    <View style={styles.buttonContainer}>
                        <Button mode={'contained'} onPress={this.openFavorites} color={'white'} style={styles.bottomButtons}
                        icon={'star'}>
                            Favorites</Button>




                        <Button mode={'contained'} onPress={()=> this.goToFeatures()} color={'#EE5B5C'} style={styles.bottomButtons}
                            icon={'plus'}>
                            Add Feature</Button>
                    </View>

                </View>
                <Dialog
                        visible={this.state.favoritesVisible}
                        onDismiss={this.closeFavorites}
                        style={{marginTop: height/19, marginHorizontal: width/8, height: height/2, width: width/1.3, paddingVertical: 10}}>
                        <Dialog.Title>Favorites</Dialog.Title>
                            <ScrollView>
                                     {this.renderFavorites()}
                            </ScrollView>

                        </Dialog>
                    {this.renderFavoriteModal()}


            </View>

                </Provider>
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
    },
    transparentLayer:{
      backgroundColor: 'transparent',
        flex: 1,
    }
});