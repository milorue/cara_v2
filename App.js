import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppLoading } from "expo";

import AppNavigator from "./navigation/AppNavigator";

import {AnonymousCredential, Stitch} from "mongodb-stitch-react-native-sdk";

// console.log(data)

export default class App extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            currentUserId: undefined,
            client: undefined,
            isLoadingComplete: false
        };
        this.loadClient = this.loadClient.bind(this);
    }

    componentDidMount(){
        this.loadClient(); // loads the client application from stitch
    }

    render(){

            return(
                <View style={styles.container}>
                    <AppNavigator/>
                </View>
            )
    }

    handleLoadingError = error => {
        console.warn(error);
    };

    handleFinishLoading = () => {
        console.log('application loaded')
        this.setState({ isLoadingComplete: true });
    };

    loadClient(){
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
  container: {
    flex: 1,
      backgroundColor: '#fff'
  },
});

// const AppNavigator = createStackNavigator({
//     Login:{
//         screen: Login,
//         navigationOptions:{
//             headerShown: false,
//         }
//     },
//     Signup:{
//         screen: Signup,
//         navigationOptions:{
//             headerShown: false,
//         }
//
//     },
//     Loading:{
//         screen: Loading,
//         navigationOptions:{
//             headerShown: false,
//         }
//     },
//     About:{
//         screen: About,
//         navigationOptions:{
//             headerShown: false,
//         }
//     },
//     Home:{
//         screen: Home,
//         navigationOptions:{
//             headerShown: false,
//         }
//     }
// });
