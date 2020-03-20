/*
	This script is for creating new post/chit.
	Logged in user can attach one image and tag a location in each post/chit.
	User can also save unfinished text(only) to draft by clicking the red cross at
	the top left corner.(Was expecting to trigger whenever user leaves the page)
	A draft button will show up if user has saved any draft(s), and it will show 
	an overlay with lickable list to retrieve draft.
	Text is limited to 141 a counter beside the Post button will show user how many words left.
	User can also cancel the tagged location and image before posting with the red cross
	icon on their right.
	Every time user try to post a chit, an alert will show whether it is success or fail.
	(Should have try to implement breadcrumbs for more the aesthetic...)
*/

import React, {Component} from 'react';
import {StyleSheet, FlatList, Image, Text, View, TextInput, AsyncStorage, Alert, PermissionsAndroid} from 'react-native';
import {Button, Icon, Overlay, ListItem} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {NavigationEvents} from 'react-navigation';

// This screen will contain a textarea to let user create chits
export default class PostChit extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isVisible: false,
			showDraft: false,
			draft: null,
			chitId: '',
			auth: {},
			image: null,
			location: null,
			coords: null,
			locationPermission: false,
			text: '',
			numChar: 141
		}
	}
	// The filter here is to get a list without the selected object
	// hence 'removed' the selected object.
	handleDraft = (msg) => {
		let temp = this.state.draft.filter(item=>item.msg != msg);
		this.setState({
			showDraft: false,
			draft: temp,
			text: msg
		});
	}
	
	// Geolocating and reverse geocoding are done in here
	handleLocation = () => {
		if(!this.state.locationPermission){
			this.state.locationPermission = requestLocationPermission();
		}
		// Use geolocation to get coordinates
		Geolocation.getCurrentPosition(
			(position) => {
				let coords = {
					'longitude': position.coords.longitude,
					'latitude': position.coords.latitude
				};
				
				this.setState({coords});
				
				// Reverse geocoding to get address
				Geocoder.from(position.coords.latitude, position.coords.longitude)
				.then(json => {
					let addressComponent = json.results[5].formatted_address;
					this.setState({
						location: addressComponent
					})
					console.log(addressComponent);
				})
				.catch(err => console.log(err));
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
	
	receivedImage =(image) =>{
		this.setState({image})
	}
	
	// To handle the image received from capture photo screen
	// and also redirect to capture photo screen
	handleImage = () => {
		this.props.navigation.navigate('Photo',{receivedImage: this.receivedImage});
	}
	
	// This async function will get the first recent chit's id(which is the latest chit)
	// then upload the photo to that chit.
	uploadPhoto=async()=>{
		await this.getChitId(this.state.auth.id)
		let chitId = this.state.chitId
		let token = this.state.auth.token
		await this.postPhoto(token,chitId)
	}
	
	postPhoto=(token,id)=>{
		return fetch(baseUrl+'/chits/'+id+'/photo', {
			method: 'POST',
			withCredentials: true,
			headers: {
				'X-Authorization': token,
				'Content-Type': 'image/jpeg'
			},
			body: this.state.image
		})
		.then((response)=>{
			console.log('Picture added!');
			this.setState({
				image: null
			})
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	// Contains two version of fetch api
	// One is with location in body another without
	postChit=(token)=>{
		
		if(this.state.coords == null){
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
				})
			})
			.then((response)=>{
				if(response.status == '201'){
				// Upload image if the chit post successfully
				// and image is not empty object
					if(this.state.image != null){
						this.uploadPhoto();
					}
					Alert.alert('Chit posted successfully!')
					// reset state
					this.setState({
						text: '',
						numChar: 141,
						coords: null,
						location: null,
					});
				} else {
					Alert.alert('Chit failed to post...')
				}
			})
		}
		else {
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
					location: this.state.coords,
				})
			})
			.then((response)=>{
				if(response.status == '201'){
				// Upload image if the chit post successfully
				// and image is not empty object
					if(this.state.image != null){
						this.uploadPhoto();
					}
					Alert.alert('Chit posted successfully!')
					// reset state
					this.setState({
						text: '',
						numChar: 141,
						coords: null,
						location: null,
					});
				} else {
					Alert.alert('Chit failed to post...')
				}
			})
		}
	}
	// To retrieve user's token and draft(s) belongs to user
	// The JSON.parse is to load the json string to object
	// because AsyncStorage only saves string.
	getUser=async()=>{
		try{
			let response = await AsyncStorage.getItem('auth');
			let authKey = await JSON.parse(response) || {};
			this.setState({
				auth: authKey
			});
			console.log(this.state.auth);
		}catch(err){
			console.log(err);
		}
		try{
			let resp = await AsyncStorage.getItem('draft');
			let draft = await JSON.parse(resp) || [];
			let result = await draft.filter(item => item.id == this.state.auth.id);
			this.setState({
				draft: result,
			});
			console.log(this.state.draft);
		}catch(err){
			console.log(err);
		}
		
	}
	// A function to do GET/user request to retrieve user details
	getChitId=(id)=>{ 
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
	// reset state and redirect to home screen 
	resetInOverlay=()=>{
		this.setState({
			isVisible: false,
			draft: null,
			image: null,
			location: null,
			coords: null,
			locationPermission: false,
			text: '',
			numChar: 141
		})
		this.props.navigation.navigate('Home');
	}
	
	// Geocoder is initiate here
	componentDidMount(){
		this.getUser();
		Geocoder.init('AIzaSyDCbAbkl8akmZnC5p2rehOXQAkdn863tpw');
	}
	
	// the onDidFocus() here is to reload user details and draft box
	// everytime user arrive in this screen. Draft object is stringified 
	// because AsyncStorage only saves string.
	render(){
		return(
			<View>
				<NavigationEvents onDidFocus={() => this.getUser()}/>
				<View style={{flexDirection: 'row', marginLeft: 20, marginTop: 20}}>
				<Icon
					name='close'
					type='evilicon'
					color='#FF7256'
					size={40}
					onPress={()=>this.setState({isVisible: true})}
				/>
				</View>
				<Overlay
					isVisible={this.state.showDraft}
					onBackdropPress={()=>this.setState({showDraft: false})}>
					<View>
						<FlatList
							keyExtractor={(item,index)=>index.toString()}
							data={this.state.draft}
							renderItem={({item})=>(
								<ListItem
									title={item.msg}
									bottomDivider
									chevron
									onPress={()=>{this.handleDraft(item.msg)}}
								/>
							)}
						/>
					</View>
				</Overlay>
				<Overlay
					width='auto'
					height='auto'
					isVisible={this.state.isVisible}
					onBackdropPress={()=>this.setState({isVisible: false})}>
					<View style={{margin: 50}}>
						<Text style={{textAlign: 'center'}}>Save draft?</Text>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<Button
							title='Delete'
							type='clear'
							onPress={async()=>{
								try{
									let tempList = [];
									if(this.state.draft != null){
										tempList = this.state.draft;
									}
									let draft = await JSON.stringify(tempList);
									await AsyncStorage.setItem('draft', draft);
								}catch(err){
									console.log(err);
								}
								this.resetInOverlay()
							}}
						/>
						<Button
							title='Save'
							type='clear'
							onPress={async()=>{
								try{
									let tempList = [];
									if(this.state.draft != null){
										tempList = this.state.draft;
									}
									let resp = await tempList.push({id: this.state.auth.id, msg: this.state.text});
									let draft = await JSON.stringify(tempList);
									await AsyncStorage.setItem('draft', draft);
								}catch(err){
									console.log(err)
								}
								this.resetInOverlay()
							}}
						/>
						</View>
					</View>
				</Overlay>
				<TextInput
					style={styles.textbox}
					multiline={true}
					numberOfLines={5}
					maxLength={141}
					placeholder={`What's going on?`}
					onChangeText={(text) => this.setState({text, numChar: (141-text.length)})}
					value={this.state.text}
				/>
				<View style={styles.buttonContainer}>
					{this.state.draft != null&&
						<Button
							title='draft'
							onPress={()=>this.setState({showDraft: true})}
						/>
					}
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
						title='Chit'
						onPress={()=> {this.postChit(this.state.auth.token)}}
					/>
				</View>
				{this.state.location != null &&
					<View style={styles.addOn}>
						<Text> Location: {this.state.location}</Text>
						<Icon
							name='close-o'
							type='evilicon'
							color='#FF7256'
							size= {25}
							onPress={()=>{
								this.setState({
									location: null
								});
							}}
						/>
					</View>
				}
				{this.state.image != null &&
					<View style={styles.addOn}>
						<Image 
							source={this.state.image}
							style={{width: 200, height: 200}}	
						/>
						<Icon
							name='close-o'
							type='evilicon'
							color='#FF7256'
							size= {30}
							onPress={()=>{
								this.setState({
									image: null
								});
							}}
						/>
					</View>
				}
				
			</View>
		);
	}
}

const styles = StyleSheet.create({
	textbox: {
		fontSize: 25,
		marginLeft: 20,
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
	addOn:{
		flexDirection: 'row',
		padding: 15,
	},
})
// Request permission to get location
async function requestLocationPermission(){
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: 'Location Permission',
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