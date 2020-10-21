import React, {useEffect, useState} from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';
import {updateLocationApi} from "../api/Location";
import { Card } from '../components';
import articles from '../constants/articles';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import {useSelector, useDispatch} from 'react-redux';
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'

const { width } = Dimensions.get('screen');

const Home = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState();
  const [geocode, setGeocode] = useState();
  const [isLoaded, setIsLoaded] = useState();

  //LOCATION SERVICE
  useEffect(()=>{
    let mounted = true;
      async function getGeocodeAsync(location){
        let geocode = await Location.reverseGeocodeAsync(location);
        if(mounted){
          setGeocode(geocode);
        }
      }
  
      async function getLocationAsync(){
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          console.log("no permission")
        }
    
        let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
        const { latitude , longitude } = location.coords
        if(mounted){
          setLocation(location)
        }
        getGeocodeAsync({latitude, longitude});
      }
  
      async function updateLocation(){
        const updateLocationResult = await updateLocationApi(location, geocode)
        if(updateLocationResult.data){
          dispatch({type: SET_CURRENT_PROFILE, payload: updateLocationResult.data})
        }
      }
      getLocationAsync();
      
      if(location){
        updateLocation();
        setIsLoaded(true);
      }
    return () => mounted = false
  }, [])

  const renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Card item={articles[0]} horizontal  />
          <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block>
          <Card item={articles[3]} horizontal />
          <Card item={articles[4]} full />
        </Block>
      </ScrollView>
    )
  }

  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
    </Block>
  );
  
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
