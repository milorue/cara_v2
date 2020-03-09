import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView, Dimensions} from 'react-native'
import logo from '/home/mrue/senior_project/cara/assets/logo.png'
import {TextInput, Caption, Button, HelperText} from "react-native-paper";
import {Stitch, UserPasswordCredential, UserPasswordAuthProviderClient} from 'mongodb-stitch-react-native-sdk'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class Signup extends React.Component{

    state = {
        email: '',
        emailConfirm: '',
        password: '',
        passwordConfirm: '',
        firstName: '',
        lastName: '',
        client: undefined,

    }

    componentDidMount(){
        this.loadClient();
    }

    loadClient(){
        const emailPassClient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory); // creates environment for user registration
        this.setState({client: emailPassClient})
    }

    signUp(){
        if(this.state.email !== '' && this.state.password !== '' && this.state.firstName !== ''){ // need more robust testing but stitch handles it at the current moment so we good
            if(this.state.password === this.state.passwordConfirm && this.state.email === this.state.emailConfirm)
            this.state.client.registerWithEmail(this.state.email, this.state.password)
                .then(() => {
                    console.log("Created Account with email: " + this.state.email)
                    this.signIn()
                })
                .catch(err =>{
                    console.error('Error registering user: ' + err)
                })
        }
    }


    signIn(){
        this.props.navigation.navigate('Login') // this will need to request the server to authenticate
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={logo} style={{width: 60, height: 60}}/>
                </View>

                <ScrollView style={styles.loginContainer}>
                    <Caption style={{color: '#4D4CB3'}}>First Name</Caption>
                    <TextInput
                    label={'First Name'}
                    value={this.state.firstName}
                    onChangeText={firstName => this.setState({firstName})}
                    style={styles.emailInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}/>

                    <Caption style={{color: '#4D4CB3'}}>Last Name</Caption>
                    <TextInput
                    label={'Last Name'}
                    value={this.state.lastName}
                    onChangeText={lastName => this.setState({lastName})}
                    style={styles.emailInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}/>

                    <Caption style={{color: '#4D4CB3'}}>Email</Caption>
                    <TextInput
                    label={'Input email'}
                    value={this.state.email}
                    onChangeText={email => this.setState({email})}
                    style={styles.emailInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}/>

                    <HelperText
                    type={'error'}
                    visible={!this.state.email.includes('@')}>
                        Email address is invalid
                    </HelperText>

                    <Caption style={{color: '#4D4CB3'}}>Confirm email</Caption>
                    <TextInput
                    label={'Confirm email'}
                    value={this.state.emailConfirm}
                    onChangeText={emailConfirm => this.setState({emailConfirm})}
                    style={styles.emailInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}/>

                    <HelperText
                    type={'error'}
                    visible={!this.state.email.includes('@')}>
                        Email address is invalid
                    </HelperText>

                    <Caption style={{color: '#4D4CB3'}}>Password</Caption>
                    <TextInput
                    label={'Input password'}
                    value={this.state.password}
                    onChangeText={password => this.setState({password})}
                    style={styles.passwordInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}
                    />

                    <Caption style={{color: '#4D4CB3'}}>Confirm Password</Caption>
                    <TextInput
                    label={'Confirm password'}
                    value={this.state.passwordConfirm}
                    onChangeText={passwordConfirm => this.setState({passwordConfirm})}
                    style={styles.passwordInput}
                    mode={'outlined'}
                    dense={true}
                    selectTextOnFocus={true}
                    selectionColor={'lightgrey'}
                    />

                    <Button
                    icon={'check'}
                    mode={'contained'}
                    onPress={() => this.signUp()}
                    style={styles.signupButton}>Create Account</Button>

                    <Caption style={{marginTop: 10}}>Already have an account?</Caption>
                    <Button
                    style={styles.loginButton}
                    mode={'contained'}
                    onPress={() => this.signIn()}>Sign In</Button>
                    <View style={{height: height/10}}>

                    </View>
                </ScrollView>

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
        height: height/6,
        flexDirection: 'column',
        backgroundColor: '#14002E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginContainer: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        margin: 10,
        borderRadius: 10,
        height: height/1.3,
    },
    emailInput: {
        marginHorizontal: 20,
        fontSize: 13,
    },
    passwordInput: {
        marginHorizontal: 20,
        fontSize: 13,
    },
    loginButton: {
        marginHorizontal: 20,
        backgroundColor: '#000556'
    },
    signupButton: {
         marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: '#7609FF'
    },
    license:{
        height: height/10,
        alignItems: 'center',
        backgroundColor: 'grey',
        justifyContent: 'center',
    },
    learnButton: {
        color: '#000556',
        marginHorizontal: 20,
        marginTop: 50
    }

})