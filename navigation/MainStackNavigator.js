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
import FeatureMap from "../screens/FeatureMap";
import Trips from "../screens/Trips";


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
    },
    FeatureMap:{
        screen: FeatureMap,
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

const TripStack = createStackNavigator({
    Trips:{
        screen: Trips,
        navigationOptions:{
            headerShown: false,
        }
    }
})

const TabNavigator = createMaterialBottomTabNavigator({
    Home:{
        screen: HomeStack,
        navigationOptions:{
            tabBarColor: 'white',
            tabBarIcon: <IconButton
            icon={'home'}
            color={'black'}
            size={30}
            style={{paddingBottom: 15}}/>
        }
    },
    Trips:{
        screen: TripStack,
        navigationOptions:{
            tabBarColor: 'white',
            tabBarIcon: <IconButton
            icon={'map-marker-path'}
            color={'black'}
            size={30}
            style={{paddingBottom: 15}}
            />,
        }
    },
    Maps:{
        screen: MapStack,
        navigationOptions:{
            tabBarColor: 'white',
            tabBarIcon: <IconButton
            icon={'map'}
            color={'black'}
            size={30}
            style={{paddingBottom: 15}}/>
        }
    },
    Community:{
        screen: CommunityStack,
        navigationOptions:{
            tabBarColor: 'white',
            tabBarIcon: <IconButton
            icon={'account-multiple'}
            color={'black'}
            size={30}
            style={{paddingBottom: 15}}
            />,
            tabBarAccessibilityLabel: 'Community Tab'
        }
    },


},
    {
        shifting: true,
        labeled: false,
        initialRouteName: 'Home',
        activeColor: '#000000',
        inactiveColor: '#ffffff',
        barStyle: {backgroundColor: 'white', paddingBottom: 10}
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