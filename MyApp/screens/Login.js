import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

class Login extends Component{
	
	render(){
		return(
			<View>
				<Text>Login Screen</Text>
				<Button
					title="Sign Up" 
					onPress={() => this.props.navigation.navigate('SignUp')}
				/>
			</View>
			
		);
	}
}

export default Login