import React, {useEffect} from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import articles from '../constants/articles';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const { width } = Dimensions.get('screen');

const Home = () => {
  console.log("ran")
  //LOCATION SERVICES
  // const getGeocodeAsync = async (location) => {
  //   let geocode = await Location.reverseGeocodeAsync(location)
  //   console.log(geocode)
  // }

  // getLocationAsync = async () => {
  //   let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //   if (status !== 'granted') {
  //     // this.setState({
  //     //   errorMessage: 'Permission to access location was denied',
  //     // });
  //     console.log("no permission")
  //   }

  //   let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
  //   const { latitude , longitude } = location.coords

  //   console.log(location)
  //   getGeocodeAsync({latitude, longitude});
  // };
  // getLocationAsync();

  useEffect(()=>{
    
    async function getGeocodeAsync(location){
      let geocode = await Location.reverseGeocodeAsync(location);
      console.log(geocode)
    }

    async function getLocationAsync(){
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        // this.setState({
        //   errorMessage: 'Permission to access location was denied',
        // });
        console.log("no permission")
      }
  
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest});
      const { latitude , longitude } = location.coords
  
      console.log(location)
      getGeocodeAsync({latitude, longitude});
    }

    getLocationAsync();
  })
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
