import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Dimensions
} from "react-native";

import { Ionicons } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");
import {SET_CURRENT_CHAT_PROFILE, SET_CURRENT_CHAT_ID, SET_CHAT_LIST} from '../redux/actionTypes/chatTypes'
import {SET_VIEW_PROFILE} from '../redux/actionTypes/profileTypes'

import Fire from '../Fire'
import { set } from "react-native-reanimated";
import {useRoute} from '@react-navigation/native';

const RenderMatches = ({match, navigation, chatList, sortListFunction}) => {

    let user = match.item.user;
    let chatId = match.item.chatId;
      
    const dispatch = useDispatch();
    const route = useRoute();

    const [lastMessage, setLastMessage] = useState("");
    const currentProfile = useSelector(state=> state.profile.currentProfile);
    const [currentChatObjectUser, setCurrentChatObjectUser] = useState(); 
    const [hasRead, setHasRead] = useState(true);
    const currentChatIndex = chatList.findIndex(x=>
      x.chat[0]._id.$oid === chatId
    )

    const chatObject = chatList[currentChatIndex].chat[0];


    const handleProfileNavigation = (user) => {
      dispatch({type: SET_VIEW_PROFILE , payload: user});
      navigation.navigate('View Profile');
    }

    const handleChatNavigation = (user, chatId) => {

      dispatch({type: SET_CURRENT_CHAT_PROFILE, payload: user})
      dispatch({type: SET_CURRENT_CHAT_ID, payload: chatId})

      navigation.navigate('Chat');
    }

    useEffect(()=>{
      if(chatObject) {
        if(chatObject.user1._id === currentProfile._id.$oid) {
          setCurrentChatObjectUser(chatObject.user1);
        } else {
          setCurrentChatObjectUser(chatObject.user2);
        }
        setHasRead(currentChatObjectUser?.hasRead);
        console.log(hasRead)
      }
    }, [chatObject])
    
    //Fetch initial last messages
    useEffect(()=>{
      let isSet = false;
      if(!isSet){
        Fire.shared.fetchInitialLastMessage((message) =>{
          setLastMessage(message);
        }, chatId);
      }

      isSet = true;
    }, [])

    //After the initial render, listen for changes on messages
    useEffect(()=>{
      Fire.shared.listen((message) =>{
        console.log(this.props)
        let DateTime = new Date()
        setLastMessage(message);

        let tempChatList = [...chatList];

        //Update chatList
        let currentChat = tempChatList[currentChatIndex];
        currentChat.chat[0].lastMessageDate.$date = DateTime.valueOf();
        currentChat.chat[0].lastMessageSent = message.text;


        dispatch({type: SET_CHAT_LIST, payload: tempChatList});
        
        sortListFunction();
      }, chatId)
       
    }, [])


    return (
      <TouchableOpacity
        onPress={()=> handleChatNavigation(user, chatId)}
      >
        <View
          key={user._id.$oid}
          style={styles.messageContainer}
        >
          <Image
            source={{ uri: global.s3Endpoint+user.picture[0] }}
            style={styles.displayPicture}
          />
          <View>
            <Text style={styles.name}>{user.first_name}</Text>
            <Text numberOfLines={1} style={[styles.messagePreview, !hasRead ? styles.boldFont : ""]}>
              {lastMessage.text}
            </Text>
          </View>
          <Ionicons style={styles.forward} name="ios-arrow-forward" size={50} color="black" />
        </View>
      </TouchableOpacity>
    )
  }

export default RenderMatches

const styles = StyleSheet.create({
  messageContainer:{
    height: 100,
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  boldFont: {
    fontWeight: "bold"
  },
  displayPicture:{
    height: 70,
    width: 70,
    borderRadius: 35,
    marginTop:15,
    marginLeft:15,
  },
  forward:{
    marginTop:38,
    marginRight:20,
    fontSize: 25
  },
  name:{
    fontWeight: 'bold',
    fontSize:20,
    marginBottom: -20,
    marginTop:10
  },
  messagePreview:{
    overflow: 'hidden',
    width: width/1.8,
    marginTop: 40,
  } 

});