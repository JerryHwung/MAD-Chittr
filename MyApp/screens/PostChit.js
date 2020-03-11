import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, AsyncStorage, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'

// This screen will contain a textarea to let user create chits
class PostChit extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			userDetails: {},
			auth: {},
			text: '',
			numChar: 141
		}
	}
	
	postChit(token,user){
		return fetch(baseUrl+'/chits',
		{
			method: 'POST',
			withCredentials: true,
			headers: {
			'X-Authorization': token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				timestamp: Date.parse(new Date()),
				chit_content: this.state.text,
				user: user,
			})
		})
		.then((response)=>{
			if(response.status == "201"){
				Alert.alert("Chit posted successfully!")
				this.setState({
					text: '',
				});
			} else {
				Alert.alert("Chit failed to post...")
			}
		})
		.catch((error)=>{
			console.error(error);
		})
	}
	
	async getUser(){
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		this.setState({
			auth: authKey
		});
		this.getData(this.state.auth.id)
	}
	// A function to do GET/user request to retrieve user details
	getData(id){
		// Will be changed to 10.0.2.2 in the future for uni 
		return fetch(baseUrl+'/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				userDetails: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	
	componentDidMount(){
		this.getUser();
	}

	render(){
		return(
			<View>
				<TextInput
					style={styles.textbox}
					multiline={true}
					numberOfLines={5}
					maxLength={141}
					placeholder={"What's going on?"}
					onChangeText={(text) => this.setState({text, numChar: (141-text.length)})}
					value={this.state.text}
				/>
				<View style={styles.buttonContainer}>
					<Text style={styles.counter}>
						{this.state.numChar}
					</Text>
					<Button 
						title="Chit"
						onPress={()=> {this.postChit(this.state.auth.token, this.state.userDetails)}}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	textbox: {
		fontSize: 25,
	},
	counter: {
		fontSize: 25,
		marginRight: 20,
	},
	buttonContainer:{
		margin: 25,
		flexDirection: 'row',
		justifyContent:'flex-end',
	},
})
export default PostChit