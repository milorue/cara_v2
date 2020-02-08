import React from 'react';
import {StyleSheet, View, ScrollView, Keyboard, Dimensions} from 'react-native'
import {TextInput, Caption, Button, Menu} from 'react-native-paper'
import {Stitch, RemoteMongoClient} from 'mongodb-stitch-react-native-sdk'

export default class Routes extends React.Component{

    constructor(props){
        super(props);
        this.state={
            title: '',
            description: '',
            startPosition:{
                latitude: null,
                longitude: null
            },
            endPosition:{
                latitude: null,
                longitude: null,
            },
        }
    }

    render(){
        return(
        <View style={styles.container}>
            <TextInput
            label={'Enter a description for this route'}/>
        </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center'
    }
})