import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import logo from '/home/mrue/senior_project/cara/assets/logo.png'
import {TextInput, Caption, Button, Dialog, Portal, Paragraph, Provider} from "react-native-paper";
import {AnonymousCredential, Stitch, UserPasswordCredential} from "mongodb-stitch-react-native-sdk"
import appCredential from "../credentials";

export default class Login extends React.Component{

    state = {
        email: '',
        password: '',
        currentUserId: undefined,
        client: undefined,
        isLoadingComplete: false,
        signInError: false,
    };

    componentDidMount(){
        if(this.client === undefined){
            this.loadClient();
        }

    }


    loadClient(){
        Stitch.initializeDefaultAppClient(appCredential).then(client =>{
            this.setState({client: client});
            console.log('Hit client')
        })

    }

    showSignInError = () => {
        this.setState({signInError: true});
        console.log('Hit SignIn Error');
    }

    hideSignInError = () => this.setState({signInError: false});

    signIn(){
        this.state.client.auth.loginWithCredential(new UserPasswordCredential(this.state.email, this.state.password))
            .then((user) => {
                console.log('Logged in as ' + user.profile.email + ' with id: ' + user.id)
                 this.props.navigation.navigate('Home')
            })
            .catch(err =>{
                console.log('Failed to Log In: ' + err)
                this.showSignInError();
            })
    }

    goHome(){
        this.state.client.auth // authorizes anon user
              .loginWithCredential(new AnonymousCredential())
              .then(user => {
                  console.log('Log In Success as user: ' + user.id );
                  this.setState({currentUserId: user.id});
                  this.setState({currentUserId: this.state.client.auth.user.id})
                  this.props.navigation.navigate('Home')
              })
              .catch(err => {
                  console.log('Failed to Log In: ' + err);
                  this.setState({currentUserId: undefined})
              })

    }

    signUp(){
        console.log('goTo SignUp')
        this.props.navigation.navigate('SignUp')
    }

    learnMore(){
        this.props.navigation.navigate('About')
    }

    render(){
        return(
            <Provider>
            <Portal>

            <View style={styles.container}>

                <View style={styles.logoContainer}>
                    <Image source={logo} style={{width: 150, height: 150}}/>
                </View>

                <View style={styles.loginContainer}>
                    <Caption style={{color: '#4D4CB3'}}>Email</Caption>
                    <TextInput
                        label={'Sign in with email'}
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                        style={styles.emailInput}
                        mode={'outlined'}
                        selectTextOnFocus={true}
                        selectionColor={'lightgrey'}/>


                        <Caption style={{color: '#4D4CB3'}}>Password</Caption>
                    <TextInput
                        label={'Enter password'}
                        value={this.state.password}
                        onChangeText={password => this.setState({password})}
                        type={'outlined'}
                        style={styles.passwordInput}
                        mode={'outlined'}
                        secureTextEntry={true} //important to be true
                        selectTextOnFocus={true}
                        selectionColor={'lightgrey'}
                        />

                        <Button
                        icon={"lock"}
                        mode={'contained'}
                        onPress={() => this.signIn()}
                        style={styles.loginButton}>
                            Sign In
                        </Button>

                    <Button
                    icon={'account'}
                    mode={'contained'}
                    onPress={() => this.goHome()}
                    style={styles.guestButton}
                    >Continue as Guest</Button>

                    <Button
                        style={{fontSize: 20, marginHorizontal: 20, marginTop: 10}}
                        onPress={() =>console.log('Forgot Press')}
                        mode={'text'}
                        color={'#000556'}>Forgot Password?</Button>

                    <Caption style={{marginTop: 10}}>Don't have an account?</Caption>

                    <Button
                    icon={'check'}
                    mode={'contained'}
                    onPress={() =>this.signUp()}
                    style={styles.signupButton}
                    >Create Account</Button>

                    <Button
                    mode={'text'}
                    onPress={() => this.learnMore()}
                    style={styles.learnButton}
                    color={'#EE4F59'}
                    >Learn More</Button>
                </View>

                <View style={styles.license}>
                    <Text style={{fontSize: 10, color: 'white'}}>Developed by Milo Rue © 2020</Text>
                    <Text style={{fontSize: 10, color: 'white'}}>All rights reserved</Text>
                </View>

            </View>
                <Dialog visible={this.state.signInError}
                    onDismiss={this.hideSignInError}>
                        <Dialog.Title>Failed to Sign In</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Username or password was incorrect</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideSignInError}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </Provider>
        )
    }
}

const styles = StyleSheet.create({
    container:{        ...StyleSheet.absoluteFillObject,

        flexDirection: 'column',
    },
    logoContainer: {
        flex: 2,
        flexDirection: 'column',
        backgroundColor: '#14002E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flex: 5,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        margin: 10,
        borderRadius: 10,
    },
    emailInput: {
        marginHorizontal: 20,
    },
    passwordInput: {
        marginHorizontal: 20,
    },
    loginButton: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#000556'
    },
    signupButton: {
        marginHorizontal: 20,
        backgroundColor: '#7609FF'
    },
    license:{
        flex: .5,
        alignItems: 'center',
        backgroundColor: 'grey',
        justifyContent: 'center',
    },
    learnButton: {
        color: '#000556',
        marginHorizontal: 20,
        marginTop: 50
    },
    guestButton: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#65879A'
    }

})