import React from 'react';
import {Platform, StyleSheet, View, ScrollView,
  Keyboard, Dimensions} from "react-native";
import {TextInput, Caption, Button, Menu} from "react-native-paper";
import { Stitch, RemoteMongoClient } from "mongodb-stitch-react-native-sdk";

export default class ConceptHome extends React.Component{

    constructor(props) {
        super(props);
        this.state ={
            value: false,
            title: '',
            description: '',
            icon: 'pin',
            color: ['#EE5B5C', '#6670CC', '#D9E54D', '#53E052'],
            visible: false,
            image: 'https://picsum.photos/500/300',
            id: 0,
            route: [{latitude: 10, longitude: 20}],
            favorite: false, // needs to be changed when in production (will always favorite things)


        }

    }

    getRandomInt = (min, max)  => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    generateImage = () => {
        let imageURL = 'https://picsum.photos/id/' + this.getRandomInt(0, 1000) + '/500/300';
        console.log(imageURL)
        this.setState({image: imageURL})
        console.log('Hit Image Generator')
        return imageURL;
    }

    handleSubmit = () => {
        Keyboard.dismiss();
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );

        const db = mongoClient.db('cara');
        const routes = db.collection('routes');
        console.log('Instantiated Client')
        if (this.state.text !== ""){
            routes.insertOne({
                id: this.state.id,
                title: this.state.title,
                description: this.state.description,
                icon: this.state.icon,
                color: this.determineColor(),
                visible: this.state.visible,
                route: this.state.route,
                favorite: this.state.favorite,
                recent: true,
                date: new Date(),
                image: this.generateImage(),
                type: 'default'
            })
                .then(() => {
                    this.setState({value: !this.state.value})
                    this.setState({id: this.state.id + 1}) // gonna need to fix this for indexing purposes
                    this.setState({title: ''})
                    this.setState({description: ''})
                    console.log('Successful Insertion')
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    }

    determineColor(){
        var randNum = Math.floor(Math.random() * 4);
        return this.state.color[randNum]
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput
                    label={'Enter title'}
                    value={this.state.title}
                    onChangeText={title => this.setState({title: title})}
                    type={'outlined'}
                    mode={'outlined'}
                    style={{color: 'lightgray', fontSize: 16}}/>

                    <TextInput
                    label={'Enter description'}
                    value={this.state.description}
                    onChangeText={description => this.setState({description: description})}
                    type={'outlined'}
                    mode={'outlined'}
                    style={{color: 'lightgray', fontSize: 16}}/>

                    <Button
                    icon={"plus"}
                    mode={'contained'}
                    onPress={() => this.handleSubmit()}>Submit</Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
    }
});