// Profile page(user's)
/* 
	Requires user to login to show any information in this page
	otherwise will only shows buttons and an empty avatar.
	Haven't handle errors when user tries to click button without logged in
	Profile screen let's user to edit user's avatar and a button to redirect
	to edit profile screen.
	The only way for user to logout is the logout button here.
	Recent chits will be shown below too, although they are clickable, but
	it does nothing at all. (Was expecting to implement view chit in another screen.)
*/
import React, {Component} from 'react';
import {StyleSheet, Alert, Text, View, ActivityIndicator, FlatList, Image, Button, TouchableOpacity, AsyncStorage} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {ListItem, Avatar} from 'react-native-elements';
import FormButton from '../components/FormButton'
import {baseUrl} from '../components/baseUrl'

export default class Profile extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photo: null,
			userDetails: {},
			auth:{}
		}
	}
	// Remove token and resets states similar to remove session
	removeUser=async()=>{
		try{
			await AsyncStorage.removeItem('auth');
			console.log('key removed');
			this.setState({
				photo: null,
				userDetails: {},
				auth: {},
			});
		}
		catch(exception){
			console.log(exception);
		}
	}
	// Retrieve authorization info and data about user
	getUser=async()=>{
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		this.setState({
			auth: authKey
		});
		this.getData(this.state.auth.id)
		this.getPhoto(this.state.auth.id)
	}
	// A function to do GET/user request to retrieve user details
	getData=id=>{ 
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
	// Extract and read the base64 image
	getPhoto=id=>{
		return fetch(baseUrl+'/user/'+id+'/photo')
		.then(response => response.blob())
		.then((image)=>{
			let reader = new FileReader();
			reader.onload =()=>{
				this.setState({
					isLoading: false,
					photo: reader.result
				});
			}
			reader.readAsDataURL(image);
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	
	componentDidMount(){
		this.getUser();
	}
	// User able to change image by clicking on avatar
	imagePressed=()=>{
		this.props.navigation.navigate('EditPhoto')
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
		else{
		return(
			<View style={{flex: 1}}>
			<NavigationEvents onDidFocus={() => this.getUser()}/>
				<View style={styles.header}>
					<View style={styles.buttonContainer}>
						<FormButton
							buttonType='outline'
							onPress={() => this.props.navigation.navigate('EditProfile')}
							title='Edit'
							buttonColor='#FFFFFF'
						/>
						<FormButton
							buttonType='outline'
							onPress={this.Logout}
							title='Logout'
							buttonColor='#FFFFFF'
						/>
					</View>
				</View>
				<Avatar style={styles.avatar}
					size='xlarge'
					rounded
					source={{uri: this.state.photo}}
					onPress={()=>this.imagePressed()}
					activeOpacity={0.7}
				/>
				<View style={styles.body}>
					<View style={styles.bodyContent}>
						<Text style={styles.name}>{this.state.userDetails.given_name} {this.state.userDetails.family_name}</Text>
						<Text style={styles.email}>{this.state.userDetails.email}</Text>
					</View>
				</View>
				<FlatList style={{marginTop: 80}}
						data={this.state.userDetails.recent_chits}
						renderItem={({item}) => (
							<ListItem 
								title={item.chit_content}
								subtitle={new Date(item.timestamp).toUTCString()}
								bottomDivider
								chevron
								onPress={() => console.log('check chit')}
							/>
						)}
						keyExtractor={({chit_id}, index) => chit_id.toString()}
					/>
			</View>
		);}
	}
	// Logout function
	// Brings user back to homepage upon clicking logout
	Logout = () =>{
		return fetch(baseUrl+'/logout', {
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
	container:{
		width: 300,
		marginBottom: 15,
		marginTop: 50
	},
	header:{
		backgroundColor: '#00BFFF',
		height:150,
	},
	avatar:{
		width: 130,
		height:130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: 'white',
		alignSelf: 'center',
		marginTop:-60
	},
	name: {
		fontSize: 22,
		color:'#FFFFFF',
		fontWeight:'600',
	},
	body: {
	},
	bodyContent: {
		flex: 1,
		alignItems: 'center',
		padding: 30,
	},
	name:{
		fontSize: 28,
		color: '#696969',
		fontWeight: '600'
	},
	email:{
		fontSize: 16,
		color: '#00BFFF',
		marginTop: 10
	},
	buttonContainer:{
		margin: 25,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
});