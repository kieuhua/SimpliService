/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, FlatList, Image, Dimensions, Button,TouchableOpacity
} from 'react-native';

import {Login, Service} from './src';
import { styles } from './styles';

import firebase from 'react-native-firebase';

export default class App extends Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('services');
    this.firestoreUnsubscriber = null;
    this.authUnsubscriber = null;
    this.state = { services: [], loading: true, logginIn: false, user: null,
         emailValue: '', passwordValue: '', hasError: false, error: '',
    }
  }

   componentDidMount() {
       this.authUnsubscriber = firebase.auth().onAuthStateChanged((user) => {
         this.setState({user});
      })
      this.firestoreUnsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
     }

   componentWillUnmount() {
      if (this.authUnsubscriber) { this.authUnsubscriber(); }
      if (this.firestoreUnsubscriber) { this.firestoreUnsubscriber(); }
    }

   onCollectionUpdate = (querySnapshot) => {
      const services = [];
      querySnapshot.forEach((doc) => {
           const {uri, likes, title} = doc.data();
           services.push({
               key: doc.id,    // Document ID
               doc,    // DocumentSnapshot
               title, uri, likes,
           })
       })
       this.setState({ services, loading: false,})
   }

   addRandomService = () => {
       const counter = Math.round((Math.random() * 100))
       this.ref.add({
           title: 'Added service photo ' + counter,
           likes: Math.floor((Math.random() * 10) +1),
           uri: `https://picsum.photos/200/300?image=${Math.floor((Math.random() * 100) + 1)}`,
       })
   }

   onLogin = async () => {
       try {
            const response = await firebase.auth().signInWithEmailAndPassword(this.state.emailValue, this.state.passwordValue);
            console.log(response);
            this.setState({
                logginIn: false, emailValue: '', passwordValue: '', hasError: false, error: '',
            })
       } catch (error) {
            this.setState({ logginIn: false, error: error.toString(), hasError: true})
       }
       this.setState({ logginIn: false, })
   }

   onChangeLogin = (e, type) => { this.setState({ [`${type}Value`]: e })}

  render() {
     if (this.state.loading) {
          return <ActivityIndicator size="large" />
      }

      return (
          <View style={styles.container}>
              <View style={styles.headerContainer} >
                  <Text style={styles.headerText}>SimpliService</Text>
                  {this.state.user && (<TouchableOpacity style={styles.headerButton} onPress={() => firebase.auth().signOut()}><Text>Logout</Text></TouchableOpacity>)}
              </View>
              {this.state.user ?
                (
                    <FlatList data={this.state.services} renderItem={( {item}) => <Service service={item}/>}
                        ListFooterComponent={<Button title="Add random service photo" onPress={() => this.addRandomService()} /> }
                    />
                ) 
                :
                (<Login emailValue={this.state.emailValue} passwordValue={this.state.passwordValue}
                    onChange={(e, type) => this.onChangeLogin(e, type)}
                    loggingIn={this.state.hasError} hasError={this.state.hasError} errorMessage={this.state.error}
                    onPress={() => this.setState(state => ({ loggingIn: true}), this.onLogin)}
                 />
                )
              }            
          </View>
      );
    }
  }

  