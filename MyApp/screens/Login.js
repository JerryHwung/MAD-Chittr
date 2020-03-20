/*
	This screen let user to login.
	Formik and Yup are used to validate the form.
	User will be redirect to home screen if user successfully logged in,
	else will be staying at the same screen.
	The token will also be saved in AsyncStorage for future use after user logged in.
	User can also sign up by clicking the orange link below.
*/

import React, {Component, Fragment} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Alert, AsyncStorage} from 'react-native';
import {Button, Icon, Image} from 'react-native-elements';
import { Formik } from 'formik';
import {NavigationActions} from 'react-navigation';
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import * as yup from 'yup'
import ErrorMessage from '../components/ErrorMessage'
import {baseUrl} from '../components/baseUrl'

const logo = require('../images/Logo.jpg');

export default class Login extends Component{
	
	handleSubmit = (values) => {
		
		if(values.email.length>0 && values.password.length>0){
			return fetch (baseUrl+'/login',
			{
				method: 'POST',
				headers: {
					Accept: 'applicaation/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: values.email,
					password: values.password
				})
			})
			.then((response) => {
				if(response.status == '200'){
					this.props.navigation.navigate('Home')
					// reponse.json() here requires return
					// because it is within {}
					return response.json()
				} else {
					Alert.alert('Wrong email/password!')
					// return empty object to handle warning
					return {}
				}
			})
			.then((responseJson) => {
				// extract token and id for authorisation
				console.log(responseJson);
				// Store it with AsyncStorage
				this.storeAuth('auth', responseJson)
			})
			.catch((error)=>{
				console.error(error);
			})
		}
	}
	
	goToSignup = () => this.props.navigation.navigate('SignUp')
	
	storeAuth =async(key, item)=>{
		try{
			await AsyncStorage.setItem(key, JSON.stringify(item));
		} catch (error) {
			console.log(error.message);
		}
	}
	
	render(){
		return(
			<SafeAreaView style={styles.container}>
				<Formik
					initialValues={{email: '', password: ''}}
					onSubmit={(values, {resetForm} )=> {this.handleSubmit(values)}}
					validationSchema={validationSchema}
				>
					{({handleChange, values, handleSubmit, errors, isValid, isSubmitting, touched, handleBlur}) => (
						<Fragment>
							<View style={{alignItems: 'center'}}>
							<Image
								source={logo}
								style={{width: 260, height: 80}}
							/>
							</View>
							<ErrorMessage errorValue={touched.family_name && errors.family_name} />
							<FormInput
								name='Email'
								value={values.email}
								placeholder='Enter Email'
								autoCapitalize='none'
								onChangeText={handleChange('email')}
								iconName='email'
								iconColor='#2C384A'
								onBlur={handleBlur('email')}
							/>
							<ErrorMessage errorValue={touched.email && errors.email} />
							<FormInput
								name='Password'
								value={values.password}
								placeholder='Enter Password'
								secureTextEntry
								onChangeText={handleChange('password')}
								iconName='lock'
								iconColor='#2C384A'
								onBlur={handleBlur('password')}
							/>
							<ErrorMessage errorValue={touched.password && errors.password} />
							
							<View style={styles.buttonContainer}>
								<FormButton
									buttonType='outline'
									onPress={handleSubmit}
									title='LOGIN'
									buttonColor='#039BE5'
									disabled={!isValid}
								/>
							</View>
							<Button
								title='Not a member? Join Chittr today!'
								onPress={this.goToSignup}
								titleStyle={{
									color: '#F57c00'
								}}
								type='clear'
							/>
						</Fragment>
					)}
				</Formik>	
			</SafeAreaView>	
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	buttonContainer: {
		margin: 25
	}
})

const validationSchema = yup.object().shape({
	email: yup.string()
		.label('Email')
		.email('Enter a valid email')
		.required('Please enter a registered email'),
	password: yup.string()
		.label('Password')
		.required()
		.min(4, 'Password must have at least 4 characters ')
})