import React, {Component} from 'react';
import {FlatList, ActivityIndicator, Text, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {ListItem, Image, Card} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl';

// This is the home screen which contains a chit list
class HomeScreen extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photoList: [],
			chitListData: [],
			refreshing: false,
		}
	}
	// An async function to do GET/chits request
	getData(){
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
		this.getData()
		.then(async()=>{
			// Async function to retrieve photo
			const list = [];
			for(var chit of this.state.chitListData){
				try{
					let data = await this.getPhoto(chit.chit_id)
					// made a async function to read blob data
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
			}
			return list;
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list,
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}
	
	// This will be called after user refresh the flatlist 
	getApiData(){
		this.getData()
		.then(async()=>{
			const list = [];
			for(var chit of this.state.chitListData){
				try{
					let data = await this.getPhoto(chit.chit_id)
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
			}
			return list;
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list,
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}
	
	// Used promise wrapper for file reading
	readFileAsync(file){
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
	async getPhoto(chit_id){
		let response = await fetch(baseUrl+'/chits/'+chit_id+'/photo')
		if(response.status=='200'){
			return await response.blob();
		} else {
			return null;
		}
		
	}
	
	handleRefresh = () => {
		this.setState({
			isFetching: true
		}, function(){this.getApiData()});
	}
	// Get image uri from state and return an image
	showImage(chit_id){
		let response = this.state.photoList.find(img => img.id == chit_id);
		if(response){
		return (<Image source={{uri: response.image}} style={{height: 200, width: 200}}/>)
		}
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
							<Card>
								<View>
									<Text>{item.chit_content}</Text>
									{this.showImage(item.chit_id)}
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

export default HomeScreen