import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

class Profile extends Component{
	
	render(){
		return(
			<View>
				<Text>Profile Screen</Text>
				<Button
					title="Edit" 
					onPress={() => this.props.navigation.navigate('EditProfile')}
				/>
			</View>
		);
	}
}

export default Profile