import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity} from 'react-native';
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Subheading, Paragraph, Caption, Modal, Menu, Divider,
Provider} from "react-native-paper";
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk'
import {StackActions, NavigationActions} from 'react-navigation'
import MenuDrawer from 'react-native-side-drawer'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Trips extends React.Component{
    constructor(props){
        super(props);
        this.state={
            client: undefined,

            favorites: undefined,
            recents: undefined,
            customs: undefined,

            refreshing: false,

            currentUser: undefined,

            recentModalVisible: false,
            currentModalId: 0,

            recentVisible: true,
            favoriteVisible: false,
            customVisible: false,

        }
    }

    componentDidMount(){
        this.getClient();
        this.loadData();
        this.getUser();

    }

    addFavorite = (obj) =>{
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const favorites = db.collection('favorites');

        favorites.find({_id: obj._id})
            .asArray()
            .then(docs =>{

                if(docs.length === 0){
                    favorites.insertOne({
                        userId: stitchAppClient.auth.user.id,
                        _id: obj._id,
                        title: obj.title,
                        description: obj.description,
                        icon: obj.icon,
                        color: obj.color,
                        visible: obj.visible,
                        route: obj.route,
                        favorite: true,
                        recent: true,
                        date: obj.date,
                        image: obj.image,
                        type: obj.type,
                    })
                    .then(()=>{
                        console.log('Favorite ' + obj._id + ' added')
                        this.setState({recentModalVisible: false})
                        this.refreshTrips()
                        this._hideModal();
                    })
                    .catch(err =>{
                        console.warn(err)
                    })
                }
                else{
                    console.log('Favorite ' + obj._id + ' was not added as its a duplicate to an existing')
                }



            })
            .catch(err =>{
                console.warn(err)

        })


    };

    _showModal = (modalId) => {
        this.setState({recentModalVisible: true, currentModalId: modalId})
    }

    _hideModal =
        () => this.setState({recentModalVisible: false})

    renderModal =() =>{

            if (this.state.recentModalVisible) {


                let array = this.state.recents.map((itemInfo) => {
                    return (
                        <Modal key={itemInfo._id} visible={this.state.recentModalVisible} onDismiss={this._hideModal}
                               style={{padding: 50}}>
                            <Card style={{marginHorizontal: 10, marginVertical: 50}} elevation={10}>
                                <Card.Title
                                    title={itemInfo.title}/>
                                <Card.Content>
                                    <Card.Cover source={{uri: itemInfo.image}}/>
                                    <Paragraph>{itemInfo.description}</Paragraph>
                                    <Button icon={'star'} mode={'contained'} onPress={() => this.addFavorite(itemInfo)}
                                    style={{marginHorizontal: 60, marginVertical: 20}} color={'#000556'}>Favorite</Button>
                                </Card.Content>
                            </Card>
                        </Modal>)
                });

                for(let x = 0; x<this.state.recents.length; x++){
                    if(this.state.recents[x]._id === this.state.currentModalId){
                        return array[x]
                    }
                }



                return array[0]
                // return 0th if not found (fallback but needs improvement
            }else{
                return null
            }
    };

    getUser(){
        const stitchClient = Stitch.defaultAppClient
        this.setState({currentUser: stitchClient.auth.user.profile.email})
    }

    getClient(){
        const stitchClient = Stitch.defaultAppClient
        this.setState({client: stitchClient})
    }

    loadData(){
        const stitchClient = Stitch.defaultAppClient
        const mongoClient = stitchClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const recents = db.collection('routes')
        const favorites = db.collection('favorites')

        recents.find({recent: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({recents: docs});
            })
            .catch(err =>{
                console.warn(err)
            })

        favorites.find({favorite: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({favorites: docs});
            })
            .catch(err =>{
                console.warn(err)
            })
    }

    deleteRoute = (itemId) => {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );
        const db = mongoClient.db('cara') // loads db from stitch
        const route = db.collection('routes');
        route.deleteOne({_id: itemId
        }).then(()=>{
            route.find({recent: true}, {sort: {date: -1}})
                .asArray().then(docs =>{
                    this.setState({routes: docs});
                    this.refreshTrips();
                    console.log(itemId + ' deleted');
            })
                .catch(err => {
                    console.warn(err);
                });
            }
        ).catch(err => {
            console.warn(err);
        });
    };

    deleteFavorite = (favId) => {
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );
        const db = mongoClient.db('cara'); // loads db from stitch
        const favorites = db.collection('favorites');
        favorites.deleteOne({_id: favId}).then(()=>{
        favorites.find({favorite: true}, {sort: {date: -1}})
            .asArray().then(docs =>{
                this.setState({favorites: docs});
                this.refreshTrips()
                console.log(favId + ' deleted');
        })
            .catch(err => {
                console.warn(err);
            })
            }).catch(err =>{
                console.warn(err)
        })
    };

    renderRecents(){
        if(this.state.recents !== undefined){
            return this.state.recents.map((itemInfo)=> {
                return (
                    <List.Item key={itemInfo._id} title={itemInfo.title} description={itemInfo.description}
                               onPress={() => this._showModal(itemInfo._id)}
                               style={{backgroundColor: 'lightgrey', borderRadius: 10, margin: 10}}
                    titleStyle={{fontSize: 14}}
                    descriptionStyle={{fontStyle: 'italic', fontSize: 10}}/>
                )
            })
        }
        else{
            return null
        }
    }

    renderFavorites(){
        if(this.state.favorites !== undefined){
            return this.state.favorites.map((favInfo) => {
                return(
                    <List.Item key={favInfo._id} title={favInfo.title} description={favInfo.description}
                    right={props => <IconButton {...props} icon={'delete-outline'} onPress={() => this.deleteFavorite(favInfo._id)}
                                                size={30} color={'#C33C3D'} style={{backgroundColor: 'white'}}/>}
                    onPress={() => console.log('Fav press')}
                    style={{backgroundColor: '#E89F17', borderRadius: 10, margin: 10}}
                    titleStyle={{color: 'black', fontWeight: 'bold', fontSize: 14}}
                    descriptionStyle={{color: 'black', fontStyle: 'italic', fontSize: 10}}/> //need to implement
                )
            })
        }
        else{
            return null
        }
    }

    refreshTrips = () =>{
        this.loadData();
    }

    revealRecent = () =>{
        this.setState({customVisible: false, recentVisible: true, favoriteVisible: false});
        console.log('Revealed Recent trips')
    }

    revealCustom = () =>{
        this.setState({recentVisible: false, customVisible: true, favoriteVisible: false});
        console.log('Revealed Custom trips')
    }

    revealFavorite = () =>{
        this.setState({recentVisible: false, customVisible: false, favoriteVisible: true})
        console.log('Revealed Favorite Trips')
    }

    render(){
        return(
            <Provider>
                <View style={styles.container}>
                    <Appbar.Header style={{marginBottom: 10, flexDirection: 'row', alignContent: 'center', backgroundColor: 'white'}}>
                        <Appbar.Action icon={'menu'} onPress={()=>console.log('Setting press')} color={'black'}/>
                        <Appbar.Content title={'Trips'} titleStyle={{fontSize: 20,}} subtitle={this.state.currentUser}/>
                    </Appbar.Header>
                    <View style={{flexDirection: 'row', padding: 10}}>
                        <Button style={{flex: 1, marginHorizontal: 5,}} icon={'alarm'} mode={'contained'} labelStyle={styles.selecterText} color={'lightgrey'} onPress={() => this.revealRecent()}>Recents</Button>
                        <Button style={{flex: 1, marginHorizontal: 5,}} icon={'star'} mode={'contained'} labelStyle={styles.selecterText} color={'#E89F17'} onPress={() => this.revealFavorite()}>Favorites</Button>
                        <Button style={{flex: 1, marginHorizontal: 5,}} icon={'brush'} mode={'contained'} labelStyle={styles.selecterText} color={'#8A3E5A'} onPress={() => this.revealCustom()}>Customs</Button>
                </View>
                    <Divider/>

                    { this.state.recentVisible ?
                         <ScrollView style={{flexDirection: 'column', paddingTop: 10, marginBottom: height/30, height: Dimensions.get('window').height - Dimensions.get('window').height/3.9}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshTrips}/>}>
                        {this.renderRecents()}
                    </ScrollView>
                        : null
                    }


                    { this.state.customVisible ?
                        <ScrollView style={{flexDirection: 'column', paddingTop: 10, marginBottom: height/25, height: Dimensions.get('window').height - Dimensions.get('window').height/3.9}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshTrips}/>}>
                            <Title>Unfinished</Title>
                    </ScrollView>
                        : null
                    }

                    { this.state.favoriteVisible ?
                        <ScrollView style={{flexDirection: 'column', paddingTop: 10, marginBottom: height/25, height: Dimensions.get('window').height - Dimensions.get('window').height/3.9}}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshTrips}/>}>
                        {this.renderFavorites()}
                        </ScrollView>
                    : null}


                    {this.renderModal()}

                </View>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
    },
    avatarContainer:{
        backgroundColor: 'lightgrey',
        flexDirection: 'column',
        paddingTop: 10,
        marginBottom: height/10,
        height: Dimensions.get('window').height - Dimensions.get('window').height/3.9
    },
    listItem:{
        backgroundColor: 'lightgrey',
        margin: 10,
        borderRadius: 5,
    },
    favItem:{
        backgroundColor: '#EAF499',
        margin: 10,
        borderRadius: 5,
    },
    buttonContainer:{
        flexDirection: 'row',
        margin: 10,
    },
    listSelecters:{
        flex: 1,
        marginHorizontal: 5,
        fontSize: 20,
    },
    selecterText:{
        fontSize: 13,
    },

});
