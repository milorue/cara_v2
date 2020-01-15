import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button, IconButton, Appbar, List, Avatar, Card, Portal, Title, Paragraph, Caption, Modal} from "react-native-paper";

export default class Community extends React.Component{
    
    state = {
        forum: [
            {
                topicId: 0,
                topic: 'Help',
                locked: true,
                admin: true,
                topicIcon: 'alert',
                topicColor: 'red',
                latestPost: '',
                posts: [
                    {
                        postId: 0,
                        title: 'Test Post',
                        tags: [
                            'help', 'test', 'accessibility'
                        ],
                        likes: 0,
                        replies: 2,
                        postingUser: 'admin',
                        content: {
                            description: 'This is a test post to test the working value of the forums section of this application' +
                                ' it is not final text or the overall look of the application',
                            images: [
                                {
                                    title: 'Test Image 1',
                                    caption: 'This is a test image',
                                    url: 'https://picsum.photos/500/300' //can be replaced with picture file from async or server side
                                }
                            ]
                        },
                        comments: [
                            {
                                commentId: 0,
                                commentUser: 'milorue',
                                commentContent: 'This is a test comment',
                            }
                        ]
                        
                    }
                ]
            }
        ]
    }

    componentDidMount() {
        for(var i = 0; i<this.state.forum.length; i++){
            var postsLength = this.state.forum[i].posts.length - 1
            this.state.forum[i].latestPost = this.state.forum[i].posts[postsLength].title
            this.setState({  //forces an update for the screen (should be a better way but this works rn
                state: this.state
            })


        }
        console.log('hit component mount')
        console.log(this.state.forum[0])
    }


    renderForumTopics(){
        return this.state.forum.map((forumInfo) =>{
            return(
                <List.Item key={forumInfo.topicId} title={'Topic: ' + forumInfo.topic} description={'Latest Post: ' + forumInfo.latestPost}
                           left={props => <Avatar.Text size={50} label={'MR'} style={{backgroundColor: forumInfo.topicColor}} labelStyle={{fontSize: 20, fontWeight: 'bold'}}/>}
                           style={{backgroundColor: 'lightgrey'}}
                />
            )
        })
    }
    
    render(){
        return(
            <View>
                <Appbar style={{paddingTop: 50, paddingBottom: 30, marginBottom: 10, flexDirection: 'row', alignContent: 'center', backgroundColor: '#14002E'}}>
                    <View style={{flex: 1}}>
                    <Avatar.Text size={47} label={'MR'} style={{backgroundColor: '#656D9A'}} labelStyle={{fontSize: 20, fontWeight: 'bold'}}/>
                    </View>
                    <Appbar.Action icon='settings' onPress={() => console.log('Settings')} color={'white'}/>
                </Appbar>
                <ScrollView style={styles.forumContainer}>
                    {this.renderForumTopics()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    forumContainer:{
        flexDirection: 'column',
        paddingTop: 30,
        marginBottom: 140,
    }
})