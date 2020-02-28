import React, {Component} from 'react';
import {Text, View, Button, AsyncStorage, Alert} from 'react-native';

class Profile extends Component{
	
	render(){
		return(
			<View>
				<Text>Profile Screen</Text>
				<Button
					title="Edit" 
					onPress={() => this.props.navigation.navigate('EditProfile')}
				/>
				<Button
					title="Logout" 
					onPress={this.Logout}
				/>
			</View>
		);
	}
	
	Logout = () =>{
		AsyncStorage.getItem('key', (err,result)=>{
			console.log(result);
			
			return fetch('http://192.168.1.103:3333/api/v0.0.5/logout',{
				method: 'POST',
				withCredentials: true,
				headers: {
					'X-Authorization': result,
					'Content-Type': 'application/json'
				}	
			})
			.then((response) => {
				AsyncStorage.removeItem('key');
				this.props.navigation.navigate('Home')
			})
			.catch(function(error){
				console.log(error);
			})
		})
	}
	
}

export default Profile