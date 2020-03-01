import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Button, AsyncStorage} from 'react-native';
import FormButton from '../components/FormButton'

const profilePic = require('../images/default.jpg');

class Profile extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			userDetails: {},
			auth:{}
		}
	}
	
	async removeUser(){
		try{
			await AsyncStorage.removeItem('auth');
			console.log("key removed");
		}
		catch(exception){
			console.log(exception);
		}
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
		return fetch('http://192.168.0.22:3333/api/v0.0.5/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				isLoading: false,
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
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.buttonContainer}>
						<FormButton
							buttonType="outline"
							onPress={() => this.props.navigation.navigate('EditProfile')}
							title="Edit"
							buttonColor="#FFFFFF"
						/>
						<FormButton
							buttonType="outline"
							onPress={this.Logout}
							title="Logout"
							buttonColor="#FFFFFF"
						/>
					</View>
				</View>
				<Image style={styles.avatar} source = {profilePic}/>
				<View style={styles.body}>
					<View style={styles.bodyContent}>
						<Text style={styles.name}>{this.state.userDetails.given_name} {this.state.userDetails.family_name}</Text>
						<Text style={styles.email}>{this.state.userDetails.email}</Text>
					</View>
				</View>
			</View>
		);
	}
	// Logout function
	Logout = () =>{
		return fetch('http://192.168.0.22:3333/api/v0.0.5/logout', {
			method: 'POST',
			withCredentials: true,
			headers: {
				'X-Authorization': this.state.auth.token,
				'Content-Type': 'application/json'
			}
		})
		.then((response)=>{
			this.removeUser();
			this.props.navigation.navigate('Home')
		})
		.catch(function(error){
			console.log(error);
		})
	}
	
}

const styles = StyleSheet.create({
	header:{
		backgroundColor: "#00BFFF",
		height:150,
	},
	avatar:{
		width: 130,
		height:130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: "white",
		marginBottom: 10,
		alignSelf: 'center',
		position: 'absolute',
		marginTop: 80
	},
	name: {
		fontSize: 22,
		color:"#FFFFFF",
		fontWeight:'600',
	},
	body: {
		marginTop: 40,
	},
	bodyContent: {
		flex: 1,
		alignItems: 'center',
		padding: 30,
	},
	name:{
		fontSize: 28,
		color: "#696969",
		fontWeight: "600"
	},
	email:{
		fontSize: 16,
		color: "#00BFFF",
		marginTop: 10
	},
	buttonContainer:{
		margin: 25,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});

export default Profile