import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView, FlatList} from 'react-native';
import logo from '/home/mrue/senior_project/cara/assets/logo.png'
import {TextInput, Caption, Button, Title, Subheading, Paragraph} from "react-native-paper";

export default class About extends React.Component{
    state = {
        agreement: false,
    };

    // signAgreement(signature){
    //     signature => this.setState({agreement: signature})
    // }

    render(){
        return(
            <ScrollView style={styles.container}>
                <View style={styles.titleBox}>
                    <Image source={logo} style={{height: 100, width: 100, marginTop: 20, marginRight: 10,}}/>
                    <View style={styles.aboutTitle}>
                        <Title style={{marginTop: 30, fontSize: 16, color: 'white'}}>Frequently Asked Questions</Title>
                        <Button
                            icon={'arrow-left'}
                        mode={'contained'}
                            compact={true}
                        onPress={() => this.props.navigation.goBack()}
                        style={{width: 50, height: 50, margin: 20, justifyContent: 'center'}}
                        color={'#285680'}/>
                    </View>

                </View>

                <View style={styles.aboutBody}>
                    <View style={styles.card}>
                        <Subheading>What is Cara?</Subheading>
                        <Paragraph>Cara is a mobile application aimed at providing accessible mapping/routing & other related services for college campuses.</Paragraph>
                    </View>
                    <View style={styles.card}>
                        <Subheading>How does it work?</Subheading>
                        <Paragraph>Cara utilizes a crowd sourced data set of current permanent and temporary obstacles within a college campus
                        and attempts to create a route that avoids accessibility hazards</Paragraph>
                    </View>
                    <View style={styles.card}>
                        <Subheading>Do I need an account to utilize Cara?</Subheading>
                        <Paragraph>Although so some features like hazard reporting, saved routes, and community will be unavailable without an account you
                        can still utilize Cara's maps/routes, news feed, and other features as a guest.</Paragraph>
                    </View>
                    <View style={styles.card}>
                        <Subheading>My route was inaccurate or it didn't plot a route at all why?</Subheading>
                        <Paragraph>Cara is in an extremely beta state and I am still working out the kinks and mapping features. If you run into any issues
                        feel free to report them to the bug tracker.</Paragraph>
                    </View>
                    <View style={styles.card}>
                        <Subheading>I'm experiencing an app layout issue help?</Subheading>
                        <Paragraph>The application is currently in active development so some formats may not be supported (ex: iPhone 4/5, Note 7, etc.) feel free to
                        notify me via the bug tracker on formats that aren't currently supported.</Paragraph>
                    </View>

                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
    },
    titleBox:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#14002E'
    },
    aboutTitle:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        height: 100,
        color: 'white',
    },
    aboutBody:{
        flex: 5,
        flexDirection: 'column'
    },
    card:{
        margin: 10,
        backgroundColor: 'lightgrey',
        padding: 10,
        borderRadius: 5,
    }

})