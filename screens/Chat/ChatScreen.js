import React, {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  BackHandler
} from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import { GiftedChat , Composer} from 'react-native-gifted-chat'
import {SET_CHAT_LIST} from '../../redux/actionTypes/chatTypes'
import {SET_CURRENT_TITLE} from '../../redux/actionTypes/navigationTypes'

import Fire from '../../Fire'
import { initialWindowMetrics } from "react-native-safe-area-context";


const { width, height } = Dimensions.get("screen");


const ChatScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const currentProfile = useSelector(state=>state.profile.currentProfile);
    const currentChatProfile = useSelector(state => state.chat.currentChatProfile);
    const chatId = useSelector(state=>state.chat.chatId);
    const [messages, setMessages] = useState([]);


    //Get initial messages 
    useEffect(() => {
      if(messages.length == 0){
        Fire.shared.on((message) => {
          setMessages(prevMessages => [message, ...prevMessages]);
        } ,chatId);
      }
    }, []);

    BackHandler.addEventListener('hardwareBackPress', ()=>{
      dispatch({type: SET_CURRENT_TITLE, payload: "Messages"});
    })
  
    const handleSend = (message) => {
      // TODO messaging error handling
      try {
        Fire.shared.send(message, chatId, global.s3Endpoint + currentProfile.picture[0]);
      }
      catch(err){
        console.log(err);
        return
      }

      //Update chat status
      axios.post(global.server + '/api/chat/updateChatStatus', 
        {
          params: {
            message : message[0].text,
            chatId: chatId
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
      }).then(res=>{
      
      })
      .catch(err => {
        console.log(err);
      })
    }

    //Scrolling to load more
    const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
      return (contentSize.height - (contentOffset.y + layoutMeasurement.height)) < 10
    }

    const fetchMoreMessages = () => {
      let tempMessage = [];
      let offset = messages[messages.length-1]._id

      Fire.shared.fetchMoreMessages(message =>
        tempMessage.push(message),
        chatId,
        offset
      );
      tempMessage.pop()

      let newMessages = messages.concat(tempMessage.reverse())
      setMessages(newMessages);
    }

    return (

      <GiftedChat
        messages={messages}
        onSend={message => handleSend(message)}
        user={{
          _id: currentProfile?._id?.$oid,
        }}
        alwaysShowSend={true}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }) => {
            if (isCloseToTop(nativeEvent)) {
              fetchMoreMessages();
            }
          }
        }}
        
      />
      
    );
    
}

const styles = StyleSheet.create({

});

export default ChatScreen;
