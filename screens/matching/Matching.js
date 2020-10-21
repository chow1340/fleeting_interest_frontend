import React, {useEffect, useState} from "react";
import {getNearbyUsersApi} from "../../api/Location"
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  TouchableWithoutFeedback,
  Text,
} from "react-native";



const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const getNearbyUsersHelper = async () => {
  const nearbyUsers = await getNearbyUsersApi();
  console.log(nearbyUsers)
}


const Matching  = ({navigation}) => {
  useEffect(()=> {
    getNearbyUsersHelper();
  },[])
  return(
    <View>
        <Text>test</Text>
    </View>
  )
}

const styles = StyleSheet.create({

});

export default Matching;
