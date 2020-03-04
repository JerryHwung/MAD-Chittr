import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';

const profilePic = require('../images/default.jpg');

export default class Search extends Component{
	
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			userListData: [],
			search: '',
		}
	}
	
	updateSearch = text => {
		// change state of 'search'
		this.setState({search: text});
		if(text == ''){
			this.setState({
				userListData: [],
			});
		} else {
			return fetch('http://192.168.1.103:3333/api/v0.0.5/search_user?q=' + text)
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
	
	render(){
		return(
			<View style={styles.viewStyle}>
				<SearchBar
					placeholder="Type here..."
					onChangeText={this.updateSearch}
					value={this.state.search}
				/>
				<FlatList
					data={this.state.userListData}
					renderItem={({item}) => (
						<ListItem
							leftAvatar={{source: {profilePic}}}
							title={`${item.given_name} ${item.family_name}`}
							subtitle={item.email}
							bottomDivider
							chevron
							onPress={()=>console.log("clicked!")}
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