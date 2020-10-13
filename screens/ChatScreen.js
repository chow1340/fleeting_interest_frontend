import React, {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions
} from "react-native";
import {useSelector, useDispatch} from 'react-redux';
import { GiftedChat , Composer} from 'react-native-gifted-chat'
import {SET_CHAT_LIST} from '../redux/actionTypes/chatTypes'

import Fire from '../Fire'


const { width, height } = Dimensions.get("screen");


const ChatScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const currentProfile = useSelector(state=>state.profile.currentProfile)
    const chatId = useSelector(state=>state.chat.chatId);
    const chatList = useSelector(state => state.chat.chatList)
    let currentChat = chatList?.get(chatId)
    const [messages, setMessages] = useState([]);

    useEffect(() => {
      Fire.shared.on(message =>
        setMessages(prevMessages => [message, ...prevMessages]), chatId
      );
    }, [])

    const handleSend = (message) => {
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
        //Update chat status
        let tempMap = new Map([...chatList])
        currentChat[0].lastMessageSent = message[0].text
        tempMap.set(chatId, currentChat)
        dispatch({type: SET_CHAT_LIST, payload: tempMap})        
      })
      Fire.shared.send(message, chatId, global.s3Endpoint + currentProfile.picture[0]);
    }

    //Scrolling to load more
    const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
      return contentOffset.y === 0
    }

    const fetchMoreMessages = () => {
      // Fire.shared.fetchMoreMessages(message => 
      //   setMessages(prevMessages => [...prevMessages, message]), 
      //   chatId
      // );
    }

    return (
    
      <GiftedChat
        messages={messages}
        onSend={message => handleSend(message)}
        user={{
          _id: currentProfile?._id.$oid,
        }}
        inverted={false}
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
