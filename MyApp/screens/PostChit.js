import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, TextInput, AsyncStorage, Alert, PermissionsAndroid} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'
import ImagePicker from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';

const options = {
	title: 'Select Image',
	takePhotoButtonTitle: 'Take a photo',
	chooseFromLibraryButtonTitle: 'Choose from library',
};
// This screen will contain a textarea to let user create chits
class PostChit extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			chitId: '',
			auth: {},
			image: {},
			location: null,
			locationPermission: false,
			text: '',
			numChar: 141
		}
	}
	
	handleLocation = () => {
		if(!this.state.locationPermission){
			this.state.locationPermission = requestLocationPermission();
		}
		
		Geolocation.getCurrentPosition(
			(position) => {
				const location = JSON.stringify(position.coords);
				
				this.setState({location});
			},
			(error)=>{
				Alert.alert(error.message)
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000
			}
		);
	};
	
	handleImage = () => {
		ImagePicker.showImagePicker(options,(response)=>{
			if(response.didCancel){
				console.log('User cancelled');
			} else if(response.error){
				console.log(response.error);
			} else {
				let source = {uri: 'data:image/jpeg;base64,'+response.data};
				
				this.setState({
					image: source
				});
			}
		})
	}
	
	// This async function will get the first chit's id(which is the latest chit)
	// then upload the photo to that chit.
	async uploadPhoto(){
		await this.getChitId(this.state.auth.id)
		let chitId = this.state.chitId
		let token = this.state.auth.token
		await this.postPhoto(token,chitId)
	}
	
	postPhoto(token,id){
		return fetch(baseUrl+'/chits/'+id+'/photo', {
			method: 'POST',
			withCredentials: true,
			headers: {
				'X-Authorization': token,
				'Content-Type': 'image/jpeg'
			},
			body: this.state.image.uri
		})
		.then((response)=>{
			console.log('Picture added!');
			console.log(this.state.image.uri);
		})
		.catch((error)=>{
			console.log(error);
		});
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
				// Upload image if the chit post successfully
				// and image is not empty object
				if(this.state.image != {}){
					this.uploadPhoto();
				}
				Alert.alert("Chit posted successfully!")
				this.setState({
					text: '',
					numChar: 141,
					image: {},
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
	}
	// A function to do GET/user request to retrieve user details
	getChitId(id){ 
		return fetch(baseUrl+'/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			let id = responseJson.recent_chits[0].chit_id
			this.setState({
				chitId : id
			})
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
					<Icon
						name='image'
						type='evilicon'
						color='#339aff'
						size= {55}
						onPress={this.handleImage}
					/>
					<Icon
						name='location'
						type='evilicon'
						color='#339aff'
						size= {55}
						onPress={this.handleLocation}
					/>
					<Text style={styles.counter}>
						{this.state.numChar}
					</Text>
					<Button 
						title="Chit"
						onPress={()=> {this.postChit(this.state.auth.token, this.state.userDetails)}}
					/>
				</View>
				<Text>Location: {this.state.location}</Text>
				<Image 
					source={this.state.image}
					style={{width: 200, height: 200}}	
				/>
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

async function requestLocationPermission(){
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: 'Lab04 Location Permission',
				message:'This app requires access to your location.',
				buttonNeutral: 'Ask Me Later',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can access location');
			return true;
		} else {
			console.log('Location permission denied');
			return false;
		}} 
	catch (err) {console.warn(err);}
}
export default PostChit