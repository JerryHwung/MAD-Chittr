// This script contains the whole navigation structure of the app
// The top level is the drawer navigator then the stacks and tabs
// There are stacks within the tab navigator too

import React, {Compoenent} from 'react';
import{Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

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

// Tabs' screens
import Search from './screens/Search'
import PostChit from './screens/PostChit'
import capturePhoto from './screens/capturePhoto'

// OtherUserStack screens
import OtherProfile from './screens/OtherProfile'
import Followers from './screens/Followers'
import Following from './screens/Following'

export const MainStack = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
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
// Removed the header of post chit screen
export const PostChitStack = createStackNavigator({
	Create: {
		screen: PostChit,
		navigationOptions: {
			headerShown: false,
		},
	},
	Photo: {
		screen: capturePhoto
	}
})
// Inserted icons for each tab
// So people who can't read english could at least know the icons
export const Tabs = createBottomTabNavigator({
	Home: {
		screen: MainStack,
		navigationOptions:{
			tabBarIcon:({tintColor}) => (
				<Icon name='home'/>
			)
		},
	},
	Create: {
		screen: PostChitStack,
		navigationOptions:{
			tabBarIcon:({tintColor}) => (
				<Icon name='add'/>
			)
		},
	},
	Search: {
		screen: OtherUserStack,
		navigationOptions:{
			tabBarIcon:({tintColor}) => (
				<Icon name='search'/>
			)
		},
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

// The top level must be render last else will return error
export const Drawer = createDrawerNavigator({
	Home: {screen: Tabs},
	Login: {screen: LoginStack},
	Profile: { screen: UserStack}
})