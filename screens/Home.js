import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity} from 'react-native';
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Paragraph, Caption, Modal, Menu, Divider,
Provider} from "react-native-paper";
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk'
import {StackActions, NavigationActions} from 'react-navigation'
import MenuDrawer from 'react-native-side-drawer'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Home extends React.Component{


    constructor(props) {
        super(props);
        this.state = {
            colors: ['#EE5B5C', '#6670CC', '#D9E54D', '#53E052'],
            showFavorites: false,
            showAlerts: true,
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
            favorites: undefined,
            refreshing: false,
            favRefreshing: false,
            image: 'https://picsum.photos/500/300',
            settingVisible: false,

        };
    }

    componentDidMount(){
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

    _showModal = (modalId) => {
        this.setState({modalVisible: true, currentModalId: modalId})
    }

    _hideModal =
        () => this.setState({modalVisible: false})

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

    favorites(){
        if(this.state.showFavorites){
            return this.state.favorites.map((favInfo) => {
                return(
                    <List.Item key={favInfo._id} title={favInfo.title} description={favInfo.description}
                    left={props => <IconButton {...props} icon={'star'} onPress={() => console.log('Map Press')}
                    color={'black'} size={30}/>}
                    right={props => <IconButton {...props} icon={'delete'} onPress={() => this.deleteFavorite(favInfo._id)}
                                                size={30} color={'#E44953'}/>}
                    onPress={() => console.log('Fav press')}
                    style={styles.favItem}
                    titleStyle={{color: 'black', fontWeight: 'bold'}}
                    descriptionStyle={{color: 'black', fontStyle: 'italic'}}/> //need to implement
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

    renderAlerts(){
        this.setState({
            showFavorites: false,
            showAlerts: true,
        });
    }

    openSetting = () => this.setState({settingVisible: true});

    closeSetting = () => this.setState({settingVisible: false});




    render(){
        return(
            <Provider>
            <View style={styles.container}>
                <MenuDrawer
                open={this.state.settingVisible}
                drawerContent={<View style={{flexDirection: 'row',}}>
                    <ScrollView style={{backgroundColor: 'white', width: width/2.4, height: height}}>
                        <Appbar.Header style={{backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', marginBottom: 10}}>
                            <Appbar.Content subtitle={this.state.currentUserId}/>
                        </Appbar.Header>
                        <Button mode={'contained'} dense={true} onPress={() =>console.log('Setting Press')} style={{margin: 10}} color={'#000556'}>Settings</Button>
                        <Button mode={'contained'} dense={true} onPress={() =>console.log('Trips Press')} style={{margin: 10}} color={'lightgrey'}>Trips</Button>
                        <Button mode={'contained'} dense={true} onPress={() =>this.logOut()} style={{margin: 10}} color={'#A9AEFF'}>Log Out</Button>

                    </ScrollView>
                    <View style={{width: width/1.8, height: height}}>
                        <TouchableOpacity style={{width: width/1.8, height: height}} onPress={this.closeSetting}/>
                    </View>

                </View>}
                drawerPercentage={100}
                    animationTime={250}
                    overlay={true}
                    opacity={0.5}>


                <Appbar.Header style={{ marginBottom: 10, flexDirection: 'row', alignContent: 'center', backgroundColor: 'white'}}>
                    <Appbar.Action icon='menu' onPress={this.openSetting} color={'black'}/>
                    <Appbar.Content title={'Home'} titleStyle={{fontSize: 20,}} subtitle={this.state.currentUserId}/>
                    <Appbar.Action icon={'account'} onPress={() =>console.log('Account press')} style={{backgroundColor: 'whitesmoke', marginRight: 20}} size={30}/>

                </Appbar.Header>
                
                {/*Shows Alerts*/}
                {this.state.showAlerts ?
                    <ScrollView style={styles.avatarContainer}>
                        {this.alerts()}
                </ScrollView> : null
                }

                    </MenuDrawer>

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