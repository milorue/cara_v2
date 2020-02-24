import React from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity} from 'react-native';
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Paragraph, Caption, Modal, Menu, Divider,
Provider} from "react-native-paper";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Map from "./Map";
import Community from "./Community";
import {Image} from "react-native-web";
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk'
import {StackActions, NavigationActions} from 'react-navigation'
import MenuDrawer from 'react-native-side-drawer'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Trips extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showFavorites: false,
            showRecent: true,
            client: undefined,
            favorites: undefined,
            recents: undefined,
            refreshing: false,
            currentUser: undefined,

        }
    }

    componentDidMount(){
        this.getClient();

    }

    getClient(){
        const stitchClient = Stitch.defaultAppClient
        this.setState({client: stitchClient})
    }

    loadData(){
        const mongoClient = this.state.client.getServiceClient(
            RemoteMongoClient.factory,
            'mongodb-atlas'
        );

        const db = mongoClient.db('cara');
        const recents = db.collection('routes')
        const favorites = db.collection('favorites')
    }
}
