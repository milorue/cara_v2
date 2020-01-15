import React from 'react';
import {Platform} from 'react-native'
import {createStackNavigator} from "react-navigation-stack";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Loading from "../screens/Loading";
import About from "../screens/About";
import Home from "../screens/Home";
import Map from "../screens/Map";
import Community from "../screens/Community";
import {IconButton} from "react-native-paper";
import ConceptHome from "../screens/ConceptHome";


const LoginStack = createStackNavigator({
    Login:{
        screen: Login,
        navigationOptions: {
            headerShown: false,
        }
    },
    SignUp:{
        screen: Signup,
        navigationOptions: {
            headerShown: false,
        }
    },
    Loading: {
        screen: Loading,
        navigationOptions:{
            headerShown: false,
        }
    },
    About:{
        screen: About,
        navigationOptions:{
            headerShown: false,
        }
    },
});

const HomeStack = createStackNavigator({
    Home:{
        screen: Home,
        navigationOptions:{
            headerShown: false,
        }
    },
});

const MapStack = createStackNavigator({
    Map:{
        screen: Map,
        navigationOptions:{
            headerShown: false,
        }
    }
});

const CommunityStack = createStackNavigator({
    Community:{
        screen: Community,
        navigationOptions:{
            headerShown: false,
        }
    }
});

const TabNavigator = createMaterialBottomTabNavigator({
    Home:{
        screen: HomeStack,
        navigationOptions:{
            tabBarColor: '#14002E',
            tabBarIcon: <IconButton
            icon={'home'}
            color={'#ffffff'}
            size={30}
            style={{paddingBottom: 25}}/>
        }
    },
    Maps:{
        screen: MapStack,
        navigationOptions:{
            tabBarColor: '#14002E',
            tabBarIcon: <IconButton
            icon={'map'}
            color={'#ffffff'}
            size={30}
            style={{paddingBottom: 25}}/>
        }
    },
    Community:{
        screen: CommunityStack,
        navigationOptions:{
            tabBarColor: '#14002E',
            tabBarIcon: <IconButton
            icon={'account-multiple'}
            color={'#ffffff'}
            size={30}
            style={{paddingBottom: 25}}
            />,
        }
    },
    Testing:{
        screen: ConceptHome,
        navigationOptions:{
            tabBarColor: '#14002E',
            tabBarIcon: <IconButton
            icon={'alert'}
            color={'#ffffff'}
            size={30}
            style={{paddingBottom: 25}}
            />,
        }
    }

},
    {
        shifting: true,
        labeled: false,
        initialRouteName: 'Home',
        activeColor: '#000000',
        inactiveColor: '#ffffff',
        barStyle: {backgroundColor: '#65879A'}
    });

export default createStackNavigator({
    Login:{
        screen: LoginStack,
        navigationOptions:{
            headerShown: false,
        }
    },
    Tabs:{
        screen: TabNavigator,
        navigationOptions:{
            headerShown: false,
        }
    },
})