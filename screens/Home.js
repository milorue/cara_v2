import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions} from 'react-native';
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Paragraph, Caption, Modal, Menu, Divider,
Provider} from "react-native-paper";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Map from "./Map";
import Community from "./Community";
import {Image} from "react-native-web";
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk'
import {StackActions, NavigationActions} from 'react-navigation'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Home extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            colors: ['#EE5B5C', '#6670CC', '#D9E54D', '#53E052'],
            showFavorites: false,
            showRecent: false,
            showAlerts: true,
            itemArr: [
                {
                    title: 'Williams Hall -> Textor Hall',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'red',
                    id: 0,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
                {
                    title: 'Phillips Hall ->  Peggy Ryan Williams',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'blue',
                    id: 1,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
                {
                    title: 'A&E Center ->  Campus Center',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'blue',
                    id: 2,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
                {
                    title: 'Williams Hall ->  Peggy Ryan Williams',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'blue',
                    id: 3,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
                {
                    title: 'Phillips Hall ->  Williams Hall',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'blue',
                    id: 4,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
                {
                    title: 'Textor Hall ->  Friends Hall',
                    description: 'Be aware of construction in the the Business/Textor parking lot',
                    icon: 'pin',
                    color: 'blue',
                    id: 5,
                    visible: false,
                    image: "https://picsum.photos/500/300",

                },
            ],
            alertsArr: [
                {
                    title: "Summer '20 Construction",
                    description: "There will be construction that blocks the majority of handicapped" +
                        "parking spots outside of Textor & the Business School from May 17th - August 1st",
                    imageUrl: 'https://i.picsum.photos/id/181/1920/1189.jpg',
                    icon: 'alert',
                    postDate: '01/08/2020',
                    postUser: 'SASAdmin',
                    color: '#DA2576',
                    postId: 0
                },
                {
                    title: "Updates to Accessibility Form",
                    description: "Starting 01/05/2020 there will be a new version of the Student Disability Reporting Form" +
                        ". This will be made available on the ithaca.edu website.",
                    imageUrl: 'https://i.picsum.photos/id/1/5616/3744.jpg',
                    icon: 'information',
                    postDate: '01/01/2020',
                    postUser: 'SASAdmin',
                    color: '#2F25DA',
                    postId: 1,
                }
            ],
            modalVisible: false,
            currentModalId: 0,

            currentUserId: undefined,
            client: undefined,
            routes: undefined,
            favorites: undefined,
            refreshing: false,
            favRefreshing: false,
            image: 'https://picsum.photos/500/300',
            settingVisible: false,
        };
        this.loadRecents = this.loadRecents.bind(this);
    }

    componentDidMount(){
        this.loadRecents();
        this.loadFavorites();
        this.getUser();
    }

    logOut(){
        const stitchClient = Stitch.defaultAppClient;
        this.setState({currentUserId: undefined})
        stitchClient.auth.logout();
        this.props.navigation.navigate({ routeName: 'Login' })
    }

    getUser(){
        const stitchClient = Stitch.defaultAppClient
        console.log(stitchClient.auth.user.profile.email)
        this.setState({currentUserId: stitchClient.auth.user.profile.email})
    }

    onRefresh = () => {
        this.setState({refreshing: true});
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );
        const db = mongoClient.db('cara');
        const routes = db.collection('routes');
        console.log('Instantiated Client Load') // instantiates our mongo client to read from
        routes.find({recent: true}, {sort: {date: -1}})
            .asArray()
            .then(docs=>{
                this.setState({routes: docs});
                this.setState({refreshing: false}); //update our refresh for stack calls
            })
            .catch(err =>{
                console.warn(err);
            });
    };

    refreshFavs = () => {
        this.setState({favRefreshing: true});
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );
        const db = mongoClient.db('cara');
        const favorites = db.collection('favorites');
        console.log('Reloading favorites');
        favorites.find({favorite: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({favorites: docs});
                this.setState({favRefreshing: false});
            })
            .catch(err =>{
                console.warn(err);
            })
    };

    loadRecents(){
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const routes = db.collection('routes');
        routes.find({recent: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({routes: docs});
            })
            .catch(err => {
                console.warn(err);
            });
    }

    loadFavorites(){
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const favorites = db.collection('favorites');
        favorites.find({favorite: true}, {sort: {date: -1}})
            .asArray()
            .then(docs =>{
                this.setState({favorites: docs});
            })
            .catch(err => {
                console.warn(err);
            })
    };

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

                console.log(docs);

                if(docs.length === 0){
                    favorites.insertOne({
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
                    })
                    .catch(err =>{
                        console.warn(err)
                    })
                }
                else{
                    console.log('Favorite ' + obj._id + ' was not added as its a duplicate')
                }



            })
            .catch(err =>{
                console.warn(err)

        })


    };


    _showModal = (modalId) => {
        this.setState({modalVisible: true, currentModalId: modalId})
    }

    _hideModal =
        () => this.setState({modalVisible: false})

    determineColor(){
        var randNum = Math.floor(Math.random() * 4);
        return this.state.colors[randNum]
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
                    this.onRefresh();
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
                this.refreshFavs();
                console.log(favId + ' deleted');
        })
            .catch(err => {
                console.warn(err);
            })
            }).catch(err =>{
                console.warn(err)
        })
    };



    renderModal =() =>{

            console.log(this.state.currentModalId);

            if (this.state.modalVisible) {


                let array = this.state.routes.map((itemInfo) => {
                    return (
                        <Modal key={itemInfo._id} visible={this.state.modalVisible} onDismiss={this._hideModal}
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

                for(let x = 0; x<this.state.routes.length; x++){
                    if(this.state.routes[x]._id === this.state.currentModalId){
                        return array[x]
                    }
                }



                return array[0]
                // return 0th if not found (fallback but needs improvement
            }else{
                return null
            }
    };



    recents(){

        if(this.state.showRecent) {

            return this.state.routes.map((itemInfo) => {
                return (
                    <List.Item key={itemInfo._id} title={itemInfo.title} description={itemInfo.description}
                               left={props => <IconButton {...props} icon={'camera-control'} onPress={() => console.log('Map Press')}
                                                         color={'#14002E'} size={30}/>}
                               right={props => <IconButton {...props} icon={'delete'} onPress={() => this.deleteRoute(itemInfo._id)} size={30}
                                                           color={'#E44953'}
                                                           />}
                               onPress={() => this._showModal(itemInfo._id)}
                               style={styles.listItem}
                    titleStyle={{fontWeight: 'bold'}}
                    descriptionStyle={{fontStyle: 'italic'}}/>
                )
            })
        }
        else{
            return null
        }
    }

    favorites(){
        if(this.state.showFavorites){
            return this.state.favorites.map((favInfo) => {
                return(
                    <List.Item key={favInfo._id} title={favInfo.title} description={favInfo.description}
                    left={props => <IconButton {...props} icon={'star'} onPress={() => console.log('Map Press')}
                    color={'white'} size={30}/>}
                    right={props => <IconButton {...props} icon={'delete'} onPress={() => this.deleteFavorite(favInfo._id)}
                                                size={30} color={'#E44953'}/>}
                    onPress={() => console.log('Fav press')}
                    style={styles.favItem}
                    titleStyle={{color: 'white', fontWeight: 'bold'}}
                    descriptionStyle={{color: 'white', fontStyle: 'italic'}}/> //need to implement
                )
            })
        }
        else{
            return null
        }
    }

    alerts(){
        if(this.state.showAlerts){

            return this.state.alertsArr.map((alertInfo) => {
                return(
                    <Card style={{marginHorizontal: 10, marginVertical: 15}} elevation={10} key={alertInfo.postId}>
                        <Card.Title
                        title={alertInfo.title}
                        left={(props) => <Avatar.Icon {...props} icon={alertInfo.icon} size={30} style={{backgroundColor: alertInfo.color}} color={'white'}/>}/>
                        <Card.Content>
                            <Caption>Posted {alertInfo.postDate} by {alertInfo.postUser}</Caption>
                            <Card.Cover source={{ uri: alertInfo.imageUrl}}/>
                            <Paragraph style={{marginTop: 10}}>{alertInfo.description}</Paragraph>
                        </Card.Content>
                    </Card>
                )
            })

        }
        else{
            return null
        }

    }

    renderFavorites(){
        this.setState({
            showFavorites: true,
            showAlerts: false,
            showRecent: false,
        });
    }

    renderRecent(){
        this.setState({
            showFavorites: false,
            showAlerts: false,
            showRecent: true,
        });
    }

    renderAlerts(){
        this.setState({
            showFavorites: false,
            showAlerts: true,
            showRecent: false,
        });
    }

    openSetting = () => this.setState({settingVisible: true});

    closeSetting = () => this.setState({settingVisible: false});




    render(){
        return(
            <Provider>
            <View style={styles.container}>
                <Appbar.Header style={{ marginBottom: 10, flexDirection: 'row', alignContent: 'center', backgroundColor: 'white'}}>
                    <Appbar.Action icon='menu' onPress={this.openSetting} color={'black'}/>
                    <Appbar.Content title={'Home'} titleStyle={{fontSize: 20,}} subtitle={this.state.currentUserId}/>
                    <Appbar.Action icon={'account'} onPress={() =>console.log('Account press')} style={{backgroundColor: 'whitesmoke', marginRight: 20}} size={30}/>

                </Appbar.Header>

                <View style={styles.buttonContainer}>
                    <Button style={styles.listSelecters} icon={'star'} mode={'contained'} labelStyle={styles.selecterText} color={'#000556'} onPress={() => this.renderFavorites()}>Favorites</Button>
                    <Button style={styles.listSelecters} icon={'history'} mode={'contained'} labelStyle={styles.selecterText} color={'lightgrey'} onPress={() => this.renderRecent()}>Recent</Button>
                    <Button style={styles.listSelecters} icon={'alert'} mode={'contained'} labelStyle={styles.selecterText} color={'#7609FF'} onPress={() => this.renderAlerts()}>Alerts</Button>
                </View>
                {/*Shows Alerts*/}
                {this.state.showAlerts ?
                    <ScrollView style={styles.avatarContainer}>
                        {this.alerts()}
                </ScrollView> : null
                }

                {/*Shows Favorites*/}
                {this.state.showFavorites ?
                    <ScrollView style={styles.avatarContainer}
                    refreshControl={<RefreshControl refreshing={this.state.favRefreshing}
                    onRefresh={this.refreshFavs}/>}>
                        {this.favorites()}
                </ScrollView> : null}

                {/*Shows Recent*/}
                {this.state.showRecent ?
                 <ScrollView style={styles.avatarContainer}
                 refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                                 onRefresh={this.onRefresh}/>}>
                     {this.recents()}
                </ScrollView> : null}

            {/*Renders Modal*/}
                {this.renderModal()}
                <Portal>
                     <Modal visible={this.state.settingVisible} onDismiss={this.closeSetting}>
                    <View style={{backgroundColor: 'white', borderRadius: 10,}}>
                        <List.Item title={'Account'} onPress={() => console.log('Logout')}
                        left={props => <IconButton {...props} icon={'account'}/>}/>
                        <List.Item title={'Advanced'} onPress={() => console.log('Logout')}
                        left={props => <IconButton {...props} icon={'settings'}/>}/>
                        <List.Item title={'Info'} onPress={() => console.log('Logout')}
                        left={props => <IconButton {...props} icon={'information'}/>}/>
                        <List.Item title={'Logout'} onPress={() => this.logOut()}
                        left={props => <IconButton {...props} icon={'logout'}/>}/>
                    </View>

                    </Modal>
                </Portal>

            </View>

                </Provider>


        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
    },
    avatarContainer:{
        flexDirection: 'column',
        paddingTop: 10,
        height: Dimensions.get('window').height - Dimensions.get('window').height/3.9
    },
    listItem:{
        backgroundColor: 'lightgrey',
        margin: 10,
        borderRadius: 5,
    },
    favItem:{
        backgroundColor: '#000556',
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
})

// export default createMaterialBottomTabNavigator({
//     Home: { screen: Home, navigationOptions:{
//         tabBarColor: '#14002E',
//             tabBarIcon: <IconButton
//             icon={'home'}
//             color={'#ffffff'}
//             size={30}
//             style={{paddingBottom: 25}}/>
//         }},
//     Maps: { screen: Map, navigationOptions:{
//         tabBarColor: '#14002E',
//             tabBarIcon: <IconButton
//             icon={'map'}
//             color={'#ffffff'}
//             size={30}
//             style={{paddingBottom: 25}}/>
//         }},
//     Community: { screen: Community, navigationOptions:{
//         tabBarColor: '#14002E',
//             tabBarIcon: <IconButton
//             icon={'account-multiple'}
//             color={'#ffffff'}
//             size={30}
//             style={{paddingBottom: 25}}
//             />,
//         }},
// },
//     {
//         shifting: true,
//         labeled: false,
//         initialRouteName: 'Home',
//         activeColor: '#000000',
//         inactiveColor: '#ffffff',
//         barStyle: {backgroundColor: '#65879A'}
//     })