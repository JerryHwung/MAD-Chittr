/*
	The very first screen that welcomes the user.
	Because home screen doesn't require token to access hence
	I put it as first page. The user's avatar part is not complete yet,
	so I addded default pic as a placeholder.(Could have use icons tho...)
*/

import React, {Component} from 'react';
import {StyleSheet, FlatList, ActivityIndicator, Text, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {ListItem, Image, Card, Avatar, Divider, Icon} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl';
import Geocoder from 'react-native-geocoding';
// Placeholder image
const profilePic = require('../images/default.jpg');

export default class HomeScreen extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photoList: [],
			chitListData: [],
			locationList: [],
			refreshing: false,
		}
	}
	// An async function to do GET/chits request
	getData=()=>{
		return fetch(baseUrl+'/chits')
		.then((response)=> response.json())
		.then((responseJson)=>{
			this.setState({
				chitListData: responseJson,
			});
		})
		.catch((err)=>{
			console.error(err);
		});
	}
	
	componentDidMount(){
		// Initiate geocoder for reverse geocoding, the string is my API Key
		Geocoder.init('AIzaSyDCbAbkl8akmZnC5p2rehOXQAkdn863tpw');
		this.getData()
		.then(async()=>{
			// Async function to retrieve photo
			const list = [];
			const addressList = [];
			for(let chit of this.state.chitListData){
				// get photos
				try{
					let data = await this.getPhoto(chit.chit_id)
					// made a async function to read blob data
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
				if(chit.location){
					// get locations(address)
					let address = await this.getLocation(chit.location);
					addressList.push({id: chit.chit_id, location: address});
				}
			}
			return [list, addressList];
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list[0],
				locationList: list[1],
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}
	
	// This will be called after user refresh the flatlist
	// It is actually the same as componentDidMount()
	getApiData=()=>{
		this.getData()
		.then(async()=>{
			const list = [];
			const addressList = [];
			for(let chit of this.state.chitListData){
				try{
					let data = await this.getPhoto(chit.chit_id)
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
				if(chit.location){
					// get locations(address)
					let address = await this.getLocation(chit.location);
					addressList.push({id: chit.chit_id, location: address})
				}
			}
			return [list, addressList];
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list[0],
				locationList: list[1],
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}
	
	// Used promise wrapper for file reading
	// to prevent decode string set in wrong id
	readFileAsync=(file)=>{
		return new Promise((resolve, reject)=>{
			let reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		})
	}
	// Extract photo as a blob data
	getPhoto=async(chit_id)=>{
		let response = await fetch(baseUrl+'/chits/'+chit_id+'/photo')
		if(response.status=='200'){
			return await response.blob();
		} else {
			return null;
		}	
	}
	// Pull to refresh will trigger this function
	handleRefresh = () => {
		this.setState({
			isFetching: true
		}, function(){this.getApiData()});
	}
	// Get image uri from state and return an image
	showImage = (chit_id) =>{
		let response = this.state.photoList.find(img => img.id == chit_id);
		if(response){
		return (<Image source={{uri: response.image}} style={{height: 200, width: 200}}/>)
		}
	}
	// A small icon is added beside the readable address
	// to indicate it is a loaction(also the text color is different)
	showLocation = (chit_id) =>{
		let response = this.state.locationList.find(add => add.id == chit_id);
		if(response){
			return (
			<View style={styles.address}>
				<Icon 
					name='location'
					type='evilicon'
					color='gray'
					size={18}
				/>
				<Text style={{color: 'gray'}}>{response.location}</Text>
			</View>);
		}
	}
	
	// Translate coordiantes to human-readable address
	// (Reverse Geocoding)
	getLocation = async(coords)=>{
		try{
			let response = await Geocoder.from(coords.latitude, coords.longitude);
			let addressComponent = await response.results[5].formatted_address;
			return addressComponent;
		}catch(err){
			console.error(err);
		}
	}
	// Translate timestamp to readable date and time
	showTime=(timestamp)=>{
		let time = new Date(timestamp);
		return time.toUTCString();
	}
	
	render(){
		// Display activity indicator while waiting data to appear
		if(this.state.isLoading){
			return(
				<View>
				<ActivityIndicator/>
				</View>
			)
		}else{
		// iterate data in a flatlist
		// This flatlist implemnted a pull to refresh function
			return(
				<View>
					<FlatList
						data={this.state.chitListData}
						renderItem={({item}) => (
							<Card 
								titleStyle={{textAlign: 'left'}} 
								title={
									<View style={styles.header}>
										<Avatar 
											rounded
											source={profilePic}
											containerStyle={{marginRight: 20, marginTop: 5}}
										/>
										<Text style={{flex: 1, flexWrap: 'wrap'}}>{item.user.given_name} {item.user.family_name}</Text>
										<Text style={{flex: 2, color: 'gray'}}>{this.showTime(item.timestamp)}</Text>
									</View>
									
								}
							>
								<View style={{paddingTop: 10}}>
									<Divider style={styles.divider}/>
									<Text style={{marginBottom: 10}}>{item.chit_content}</Text>
									{this.showImage(item.chit_id)}
									{item.location &&
										this.showLocation(item.chit_id)
									}
								</View>
							</Card>
							
						)}
						keyExtractor={({chit_id}, index) => chit_id.toString()}
						refreshing={this.state.refreshing}
						onRefresh={this.handleRefresh}
					/>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	divider: {
		backgroundColor:'gray', 
		marginBottom: 10,
	},
	address: {
		marginTop: 10,
		flexDirection: 'row',
	},
})