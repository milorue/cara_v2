import React from 'react';
import {View, Text, StyleSheet, ScrollView, Platform, StatusBar} from 'react-native';
import {AppLoading, Asset, Font, Icon} from "expo";
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Paragraph, Caption, Modal} from "react-native-paper";

import {Stitch, AnonymousCredential} from 'mongodb-stitch-react-native-sdk'

export default class Concept extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            currentUserId: undefined,
            client: undefined,
            isLoadingComplete: false
        };
        this._loadClient = this._loadClient.bind(this);
    }

    componentDidMount(){
        this._loadClient(); // loads the client application from stitch
    }

    render(){
        return(
                <View style={styles.container}>
                    {Platform.OS === 'android' && <StatusBar barStyle={'default'}/>}
                </View>
            )
        }

  // _handleLoadingError = error => {
  //   console.warn(error);
  // };
  //
  // _handleFinishLoading = () => {
  //   this.setState({ isLoadingComplete: true });
  // };

  _loadClient(){
      Stitch.initializeDefaultAppClient("cara-pvrxo").then(client => {
          this.setState({client}) //set the client in state
          this.state.client.auth
              .loginWithCredential(new AnonymousCredential())
              .then(user => {
                  console.log('Log In Success as user: ' + user.id );
                  this.setState({currentUserId: user.id});
                  this.setState({currentUserId: client.auth.user.id})
              })
              .catch(err => {
                  console.log('Failed to Log In: ' + err);
                  this.setState({currentUserId: undefined})
              })
      })
  }



}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    }
})
