/*
	This screen is to search users by typing keywords in the search bar.
	A fetch request is called when the text in search bar is change.
	There is a problem when user hit backspace too fast and left nothing in the
	search bar will not clear the result below. (Maybe add setTimeOut could solve it)
	User can click on the search result and get redirect to profile(other users) screen.
	User can see themselves in the result too...
	Sadly there are no profile picture for every user now used icon to substitute
*/

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, AsyncStorage} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'

export default class Search extends Component{
	
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			userListData: [],
			search: '',
		}
	}

	// Everytime user typed will trigger this function
	updateSearch = text => {
		// change state of 'search'
		this.setState({search: text});
		if(text == ''){
			this.setState({
				userListData: [],
			});
		} else {
			return fetch(baseUrl+'/search_user?q=' + text)
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					userListData: responseJson,
				});
			})
			.catch((error)=>{
				console.log(error);
			});
		}
	}
	
	storeId=async(id)=>{
		try{
			// Asyncstorage only store strings hence id need to be string
			await AsyncStorage.setItem('id', JSON.stringify(id));
		} catch (error) {
			console.log(error.message);
		}
	}
	
	// Navigate to OtherProfile after saving the id in AsyncStorage
	moreDetails = id => {
		this.storeId(id);
		this.props.navigation.navigate('OtherProfile');
	} 
	
	render(){
		return(
			<View style={styles.viewStyle}>
				<SearchBar
					placeholder='Type here...'
					onChangeText={this.updateSearch}
					value={this.state.search}
				/>
				<FlatList
					data={this.state.userListData}
					renderItem={({item}) => (
						<ListItem
							leftIcon={{ name: 'person' }}
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