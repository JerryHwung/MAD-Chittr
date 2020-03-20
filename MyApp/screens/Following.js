/*
	A screen to show list of following, the list items are 
	clickable and will redirect user to that particular user
	profile.
*/

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, AsyncStorage} from 'react-native';
import {ListItem} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'

const profilePic = require('../images/default.jpg');

export default class Following extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			followingList: [],
		}
	}
	// Navigate to OtherProfile after saving the id in AsyncStorage
	moreDetails = id => {
		this.storeId(id);
		this.props.navigation.push('OtherProfile');
	}
	
	storeId=async(id)=>{
		try{
			// Asyncstorage only store strings hence id need to be string
			await AsyncStorage.setItem('id', JSON.stringify(id));
		} catch (error) {
			console.log(error.message);
		}
	}
	
	getFollowers=async()=>{
		let id = JSON.parse(await AsyncStorage.getItem('id'));
		return fetch(baseUrl+'/user/'+id+'/following')
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				followingList: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	
	componentDidMount(){
		this.getFollowers();
	}
	
	render(){
		return(
			<View style={styles.viewStyle}>
				<FlatList
					data={this.state.followingList}
					renderItem={({item}) => (
						<ListItem
							leftAvatar={{source: {profilePic}}}
							title={`${item.given_name} ${item.family_name}`}
							subtitle={item.email}
							bottomDivider
							chevron
							onPress={() => this.moreDetails(item.user_id)}
						/>
					)}
					enableEmptySections={true}
					style={{marginTop: 10}}
					// tried {(item,index) => item} but 
					// a warning is return hence this version to resolve
					keyExtractor={(item, index) => String(index)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	viewStyle: {
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'lightgrey',
	},
	textStyle: {
		padding: 10,
		fontSize: 25,
	},
});