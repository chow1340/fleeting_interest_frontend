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
import {Capitalize} from "../../hooks/display/Capitalize";

const { width } = Dimensions.get("screen");
import {SET_CURRENT_CHAT_PROFILE, SET_CURRENT_CHAT_ID, SET_CHAT_LIST} from '../../redux/actionTypes/chatTypes'
import {SET_CURRENT_TITLE} from '../../redux/actionTypes/navigationTypes'

import Fire from '../../Fire'

const RenderMatches = ({match, navigation, chatList, sortListFunction}) => {

    let user = match.item.user;
    let chatId = match.item.chatId;
      
    const dispatch = useDispatch();

    const [lastMessage, setLastMessage] = useState("");
    const currentProfile = useSelector(state=> state.profile.currentProfile);
    const currentTitle = useSelector(state => state.navigation.currentTitle);
    const [hasRead, setHasRead] = useState();
    const currentChatIndex = chatList.findIndex(x=>
      x.chat._id.$oid === chatId
    )
    const chatObject = chatList[currentChatIndex].chat;

    
    const handleChatNavigation = (user, chatId) => {

      dispatch({type: SET_CURRENT_CHAT_PROFILE, payload: user});
      dispatch({type: SET_CURRENT_CHAT_ID, payload: chatId});
      dispatch({type: SET_CURRENT_TITLE, payload: chatId});

      axios.post(global.server + '/api/chat/setIsRead', 
      {
        params: {
          chatId : chatId,
          isRead : true
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(()=>{setHasRead(true)})

      navigation.navigate('Chat');
    }


    useEffect(()=>{
      if(chatObject) {
        if(chatObject.user1._id === currentProfile._id.$oid) {
          setHasRead(chatObject.user1.hasRead);
        } else {
          setHasRead(chatObject.user2.hasRead);
        }
      }
    }, [chatObject])
    
    //Fetch initial last messages
    useEffect(()=>{
      let isSet = false;
      if(!isSet){
        Fire.shared.fetchInitialLastMessage((message) =>{
          setLastMessage(message);
          console.log(message);
        }, chatId);
      }
      isSet = true;
    }, [])

    //After the initial render, listen for changes on messages
    useEffect(()=>{
      Fire.shared.listen((message) =>{
        let DateTime = new Date()
        setLastMessage(message);

        let tempChatList = [...chatList];

        //Update chatList
        let currentChat = tempChatList[currentChatIndex];
        currentChat.chat.lastMessageDate.$date = DateTime.valueOf();
        currentChat.chat.lastMessageSent = message.text;

        let sortedChatList = sortListFunction(tempChatList);
        //CHange is read status if you did not send it
        if(currentProfile._id.$oid != message.user._id) {
          axios.post(global.server + '/api/chat/setIsRead', 
          {
            params: {
              chatId : chatId,
              isRead : false
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          setHasRead(false);
          console.log("raninhere");
        }
        dispatch({type: SET_CHAT_LIST, payload: sortedChatList});
        
      }, chatId)
      return () => {
        Fire.shared.off()
      }
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
            <Text style={[styles.name, !hasRead? styles.boldFont : ""]}>{Capitalize(user.first_name)}</Text>
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