import React, {Component} from 'react';
import {FlatList, ActivityIndicator, Text, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {ListItem, Image, Card} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl';

const profilePic = require('../images/default.jpg');

// This is the home screen which contains a chit list
class HomeScreen extends Component{
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photo: [],
			chitListData: []
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
	}
	
	/* getPhoto(chit_id){
		fetch(baseUrl+'/chits/'+chit_id+'/photo')
		.then((response)=> {
			if(response.status=='200'){
				return response.blob();
			}else{
				this.state.photo.push({id: chit_id, source:''})
			}
		})
		.then((image)=>{
			var reader = new FileReader();
			reader.onload =()=>{
				this.state.photo.push({id: chit_id, source: reader.result})
			}
			reader.readAsDataURL(image);
		})
		.catch((err)=>{
			console.log(err);
		});
	} */
	
	render(){
		// Display activity indicator while waiting data to appear
		if(this.state.isLoading){
			return(
				<View>
				<ActivityIndicator/>
				</View>
			)
		}
		// iterate data in a flatlist
		return(
			<View>
			<NavigationEvents onDidFocus={() => this.getData()}/>
				<FlatList
					data={this.state.chitListData}
					renderItem={({item}) => (
						/* <ListItem 
							title={item.chit_content}
							subtitle={new Date(item.timestamp).toUTCString()}
							leftAvatar={{source: profilePic}}
							bottomDivider
							chevron
							onPress={() => console.log("check chit")}
						/> */
						<Card>
							<View>
								<Text>{item.chit_content}</Text>
							</View>
						</Card>
						
					)}
					keyExtractor={({chit_id}, index) => chit_id.toString()}
				/>
			</View>
		);
	}
}

export default HomeScreen