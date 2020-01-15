import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import logo from '/home/mrue/senior_project/cara/assets/logo.png'
import {TextInput, Caption, Button} from "react-native-paper";

export default class Login extends React.Component{

    state = {
        email: '',
        password: '',
    };

    signIn(){
        this.props.navigation.navigate('Loading')
    }

    goHome(){
        this.props.navigation.navigate('Home')
    }

    signUp(){
        this.props.navigation.navigate('Signup')
    }

    learnMore(){
        this.props.navigation.navigate('About')
    }

    render(){
        return(
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
        )
    }
}

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
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