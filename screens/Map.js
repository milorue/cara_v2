import React from 'react';
import {View, Text, StyleSheet, Dimensions, RefreshControl, ScrollView, TouchableHighlight, Picker, TouchableOpacity} from 'react-native';
import {Button, IconButton, Appbar, Modal, Searchbar, Avatar, Menu, Provider, Card, Paragraph, Dialog, Caption, Divider, List
, Drawer} from "react-native-paper";
import MapView, {Callout, Polyline, ProviderPropType, Marker} from "react-native-maps";
import data from '/home/mrue/senior_project/cara/assets/route'
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk';
import MenuDrawer from 'react-native-side-drawer'
import MapViewDirections from "react-native-maps-directions";
import googleKey from "../assets/apiKey";

import constructionIcon from '../assets/construction.png'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Map extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            currentUserId: undefined,
            color: ['#EE5B5C', '#6670CC', '#D9E54D', '#53E052'],
            markers: undefined,
            buildings: null,
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
            },
            startBuilding: 'Start',
            endBuilding: 'End',
            startModalVisible: false,
            endModalVisible: false,
            startPosition:{
                latitude: null,
                longitude: null
            },
            endPosition:{
                latitude: null,
                longitude: null,
            },
            icon: 'pin',
            description: '',
            image: '',
            favorite: false,
            title: '',
            drawerState: false,

        }
    }

    componentDidMount(){
        this.loadFavorites();
        this.loadMarker();
        this.loadBuildings();
        this.getUser();
        navigator.geolocation.getCurrentPosition(position => {

            this.setState({location: position})
        },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    };

    renderRoute = () =>{
        if(this.state.endPosition.latitude != null){
            return(
            <MapViewDirections apikey={googleKey}
            origin={this.state.startPosition}
            destination={this.state.endPosition}
            strokeWidth={4}
            strokeColor={'red'}
            mode={'WALKING'}/>
            )
        }
    }

    toggleDrawer = () =>{
        console.log('toggled drawer')
        this.setState({drawerState: !this.state.drawerState});
    };

    handleRouteSubmit = () =>{  // need to implement a simple client grabber function for production this works for now
        Keyboard.dismiss();
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        )

        const db = mongoClient.db('cara');
        const routes = db.collection('routes');
        routes.insertOne({
            userId: stitchAppClient.auth.user.id,
            title: this.state.startBuilding + ' -> ' + this.state.endBuilding,
            description: this.state.description,
            icon: this.state.icon,
            color: this.determineColor(),
            route: this.state.route,
            startLocation: this.state.startPosition,
            endLocation: this.state.endPosition,
            favorite: this.state.favorite,
            recent: true,
            date: new Date(),
            image: this.generateImage(),
            type: 'default',
        })
            .then(() =>{
                this.setState({title: '', description: ''})
                console.log('route created successfully')
            })
            .catch(err =>{
                console.warn(err);
            });
    };

    generateImage = () => {
        let imageURL = 'https://picsum.photos/id/' + this.getRandomInt(0, 1000) + '/500/300';
        console.log(imageURL)
        this.setState({image: imageURL})
        console.log('Hit Image Generator')
        return imageURL;
    }

    determineColor(){
        var randNum = Math.floor(Math.random() * 4);
        return this.state.color[randNum]
    };

    remountMap = () =>{
        this.setState(({reloadValue}) => ({
            reloadValue: reloadValue + 1
        }));
    };

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

    loadBuildings = () => {
        const stitchAppClient = Stitch.defaultAppClient
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory, 'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const buildings = db.collection('buildings');
        console.log('loading buildings')
        buildings.find({loaded: true})
            .asArray()
            .then(docs =>{
                this.setState({buildings: docs})
                console.log('loaded all buildings')
                // console.log(this.state.buildings)
            }).catch(err =>{
                console.warn(err)
        })
    }

    openFavorites = () =>{
        this.setState({favoritesVisible: true});
        this.toggleDrawer();
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

    renderStartPosition = (name, lat, lon) =>{
        this.setState({startBuilding: name,
        });
        console.log(lat);
        console.log(lon);
        this.setState({startPosition:{
            latitude: lat, longitude: lon
            }})

    };

    renderEndPosition = (name, lat, lon) =>{
        this.setState({endBuilding: name})
        console.log(lat);
        console.log(lon);
        this.setState({
            endPosition:{
                latitude: lat, longitude: lon
            }
        })
    }

    renderStartMarkers = () =>{
        if(this.state.startPosition.latitude !== null){
            return(
                <Marker title={this.state.startBuilding} pinColor={'#00C256'}
                coordinate={this.state.startPosition}/>
            )
        }
    };

    renderEndMarkers = () =>{
        if(this.state.endPosition.latitude !== null){
            return(
                <Marker title={this.state.endBuilding} pinColor={'#C2006D'}
                coordinate={this.state.endPosition}/>
            )
        }
    }

    renderStartBuilding = () =>{
        if(this.state.startModalVisible && this.state.buildings !== null){
            return this.state.buildings.map((buildingInfo) =>{
                return buildingInfo.building.buildings.map((building)=>{
                    return(
                        <List.Item key={building.building} title={building.building}
                        left={props => <List.Icon {...props} icon={'domain'} color={'black'} size={40}/>}
                        onPress={() => {this.renderStartPosition(building.building, building.latitude, building.longitude); this.closeStartBuilding() }} style={{paddingHorizontal: 30}}/>
                    )
                })

            })
        }
    };

    renderEndBuilding = () =>{
        if(this.state.endModalVisible && this.state.buildings !== null){
            return this.state.buildings.map((buildingInfo) =>{
                return buildingInfo.building.buildings.map((building)=>{
                    return(
                        <List.Item key={building.building} title={building.building}
                        left={props => <List.Icon {...props} icon={'domain'} color={'black'} size={40}/>}
                        onPress={() => {this.renderEndPosition(building.building, building.latitude, building.longitude); this.closeEndBuilding() }} style={{paddingHorizontal: 30}}/>
                    )
                })

            })
        }
    };

    openEndBuilding = () =>{
        this.setState({endModalVisible: true})
    };

    closeEndBuilding = () =>{
        this.setState({endModalVisible: false})
    }

    openStartBuilding = () =>{
        this.setState({startModalVisible: true})
    };

    closeStartBuilding = () =>{
        this.setState({startModalVisible: false})
    };

    goToFeatures(){
        this.toggleDrawer();
        this.props.navigation.navigate('FeatureMap')
    }

    getUser(){
        const stitchClient = Stitch.defaultAppClient
        console.log(stitchClient.auth.user.profile.email)
        this.setState({currentUserId: stitchClient.auth.user.profile.email})
    }

    render(){

        return(

            <Provider>


            <View style={styles.container}>
                <MenuDrawer
                    open={this.state.drawerState}
                    drawerContent={<View style={{flexDirection: 'row'}}>
                        <ScrollView style={{paddingVertical: height/20 ,backgroundColor: 'white', width: width/2.4, height: height}}>
                        <Button mode={'contained'} onPress={()=> this.goToFeatures()} color={'#000556'} style={styles.bottomButtons} icon={'plus'}>
                            Add Feature</Button>
                        <Button mode={'contained'} onPress={this.openFavorites} color={'whitesmoke'} icon={'star'} style={styles.bottomButtons}>Favorites</Button>
                        <Divider style={{marginTop: 15}}/>
                        <Button mode={'contained'} onPress={() => console.log('Test Button')} style={styles.bottomButtons}>Item 1</Button>
                            <Button mode={'contained'} onPress={() => console.log('Test Button')} style={styles.bottomButtons}>Item 2</Button>
                            <Button mode={'contained'} onPress={() => console.log('Test Button')} style={styles.bottomButtons}>Item 3</Button>
                            <Divider style={{marginTop: 15}}/>
                            <Button mode={'contained'} onPress={() => console.log('Test Button')} style={styles.bottomButtons}>Item 1</Button>
                        </ScrollView>
                        <View style={{width: width/1.8, height: height}}>
                            <TouchableOpacity style={{width: width/1.8, height: height}} onPress={this.toggleDrawer}/>
                        </View>
                    </View>
                        }
                    drawerPercentage={100}
                    animationTime={250}
                    overlay={true}
                    opacity={0.5}>



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
                {this.renderStartMarkers()}
                {this.renderEndMarkers()}
                {this.renderRoute()}
                {/*<Polyline coordinates={this.state.route}*/}
                {/*          strokeColor={'#F00000'}*/}
                {/*          strokeWidth={4}/>*/}
            </MapView>

                <View style={styles.interactionLayer}>
                    <Appbar.Header style={{ backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', marginBottom: 10}}>
                    <Appbar.Action icon={'menu'} onPress={this.toggleDrawer}/>
                    <Appbar.Content title={'Map'} subtitle={this.state.currentUserId}/>
                </Appbar.Header>
                    <View style={{flexDirection: 'row', backgroundColor: 'transparent', marginHorizontal: 10, marginTop: 10}}>
                        <Button mode={'contained'} onPress={this.openStartBuilding} color={'#00C256'} icon={'map-marker'} style={styles.buildingButtons}>{this.state.startBuilding}</Button>
                        <IconButton mode={'contained'} onPress={this.toggleDrawer} icon={'crosshairs-gps'} style={{width: 50, backgroundColor: 'white', marginHorizontal: 10, height: 50}} color={'black'}/>
                        <Button mode={'contained'} onPress={this.openEndBuilding} color={'#C2006D'} icon={'map-marker'} style={styles.buildingButtons}>{this.state.endBuilding}</Button>
                        </View>
                    <View style={styles.buttonContainer}>





                    </View>

                </View>
                <Dialog
                visible={this.state.startModalVisible}
                onDismiss={this.closeStartBuilding}
                style={{marginTop: height/19, marginHorizontal: width/8, height: height/1.4, width: width/1.3, paddingVertical: 10}}>
                    <Dialog.Title>Start Locations</Dialog.Title>
                    <ScrollView>
                            {this.renderStartBuilding()}
                    </ScrollView>

                </Dialog>
                <Dialog
                visible={this.state.endModalVisible}
                onDismiss={this.closeEndBuilding}
                style={{marginTop: height/19, marginHorizontal: width/8, height: height/1.4, width: width/1.3, paddingVertical: 10}}>
                    <Dialog.Title>End Locations</Dialog.Title>
                    <ScrollView>
                        {this.renderEndBuilding()}
                    </ScrollView>
                </Dialog>
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
                </MenuDrawer>




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
    buildingButtons:{
      height: height/20,
        width: width/3,
        flex: 1,
    },
    interactionLayer:{
      flexDirection: 'column',
        backgroundColor: 'transparent',
        justifyContent: 'flex-end'
    },
    bottomButtons:{
      marginHorizontal: 10,
        height: height/20,
        flex: 1,
        marginTop: 15,
    },
    buttonContainer:{
      flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        marginHorizontal: 20,
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