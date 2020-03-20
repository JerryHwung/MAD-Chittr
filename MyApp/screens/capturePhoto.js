/*
	This screen is similar to editphoto.js, but this screen return
	the captured image back to postchit.js to let user to preview 
	instead of instant post the image.
	(Although it is impossible to post without the chit id)
*/

import React,{Component, Fragment} from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, Alert, Image, Button } from 'react-native';
import {RNCamera} from 'react-native-camera';
import {baseUrl} from '../components/baseUrl'

export default class capturePhoto extends Component {
	
	// Constructor to set the states
	constructor(props){
		super(props);
		this.state={
			photo: null
		};
	}
	
	takePicture = async() => {
		if(this.camera){
			const options = {quality: 0.5, base64: true};
			const receivedImage = this.props.navigation.getParam('receivedImage', ()=>{});
			const data = await this.camera.takePictureAsync(options);
			receivedImage(data)
			this.props.navigation.goBack()
		}
	}
	
	render() {
		return (
		  <View style={styles.container}>
			<RNCamera
				ref={ref=>{
					this.camera = ref;
				}}
				style={styles.preview}
			/>
			<View style={{flex:0, flexDirection:'row', justifyContent:'center'}}>
				<TouchableOpacity
					onPress={this.takePicture.bind(this)}
					style={styles.capture}
				>
				<Text style={{fontSize: 16}}>
					CAPTURE
				</Text>
				</TouchableOpacity>
			</View>
		  </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1, flexDirection: 'column'},
	preview: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
	capture: {flex: 0, borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: 'center', margin: 20,}
});