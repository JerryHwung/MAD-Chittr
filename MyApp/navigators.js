import React, {Compoenent} from 'react';
import{Text, View} from 'react-native';

// Navigators
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';

// UserStack screens
import Profile from './screens/Profile'
import EditProfile from './screens/EditProfile'
import EditPhoto from './screens/EditPhoto'

// LoginStack screens
import Login from './screens/Login'
import SignUp from './screens/SignUp'

// MainStack screens
import HomeScreen from './screens/HomeScreen'
import Chit from './screens/Chit'

// Tabs' screens
import Search from './screens/Search'
import PostChit from './screens/PostChit'

// OtherUserStack screens
import OtherProfile from './screens/OtherProfile'
import Followers from './screens/Followers'
import Following from './screens/Following'

export const MainStack = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Chit: {
		screen: Chit
	}
})

export const OtherUserStack = createStackNavigator({
	Search: {
		screen: Search
	},
	OtherProfile: {
		screen: OtherProfile
	},
	Followers: {
		screen: Followers
	},
	Following: {
		screen: Following
	}
})

export const Tabs = createBottomTabNavigator({
	Home: {
		screen: MainStack
	},
	Create: {
		screen: PostChit
	},
	Search: {
		screen: OtherUserStack
	}
})

export const UserStack = createStackNavigator({
	Profile: {
		screen: Profile
	},
	EditProfile: {
		screen: EditProfile
	},
	EditPhoto: {
		screen: EditPhoto
	}
})

export const LoginStack = createStackNavigator({
	Login: {
		screen: Login
	},
	SignUp: {
		screen: SignUp
	}
})


export const Drawer = createDrawerNavigator({
	Home: {screen: Tabs},
	Login: {screen: LoginStack},
	Profile: { screen: UserStack}
})