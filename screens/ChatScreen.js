import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";
const { width } = Dimensions.get("screen");


const ChatScreen = ({navigation}) => {
    console.log(navigation)
    const currentChatProfile = useSelector(state=>state.message.currentChatProfile);
    console.log(currentChatProfile);
    let test = styles.test
    return (
      <Text>XD</Text>
    );
}

const styles = StyleSheet.create({

});

export default ChatScreen;
