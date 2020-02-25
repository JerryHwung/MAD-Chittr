import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

class HomeScreen extends Component{
	
	render(){
		return(
			<View>
				<Text>Home Screen</Text>
				<Button
					title="Chit" 
					onPress={() => this.props.navigation.navigate('Chit')}
				/>
			</View>
		);
	}
}

export default HomeScreen