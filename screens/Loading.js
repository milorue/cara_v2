import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import logo from '/home/mrue/senior_project/cara/assets/logo.png';

export default class Loading extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Image source={logo} style={{width: 150, height: 150}}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#14002E',
        justifyContent: 'center',
        alignItems: 'center',
    }

})