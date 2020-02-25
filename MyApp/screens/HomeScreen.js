import React, {Component} from 'react';
import {FlatList, ActivityIndicator, Text, View} from 'react-native';

// This is the home screen
class HomeScreen extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			chitListData: []
		}
	}
	// A function to retrieve chits
	getData(){
		// Will be changed to 10.0.2.2 in the future for uni 
		return fetch('http://192.168.0.22:3333/api/v0.0.5/chits')
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				isLoading: false,
				chitListData: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	
	componentDidMount(){
		this.getData();
	}
	
	render(){
		// Display activity indicator while waiting data to appear
		if(this.state.isLoading){
			return(
				<View>
				<ActivityIndicator/>
				</View>
			)
		}
		
		return(
			<View>
				<FlatList
					data={this.state.chitListData}
					renderItem={({item}) => <Text>{item.chit_content}</Text>}
					keyExtractor={({chit_id}, index) => chit_id}
				/>
			</View>
		);
	}
}

export default HomeScreen