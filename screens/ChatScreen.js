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
    let currentChat = chatList?.get(chatId);
    
    const [messages, setMessages] = useState([]);
    const [lastKey, setLastKey] = useState("");
    //Get messages 
    useEffect(() => {
      if(messages.length == 0){
        Fire.shared.on(message =>
          setMessages(prevMessages => [message, ...prevMessages]), 
          chatId
        );
      }
    }, [])



    const handleSend = (message) => {
      // TODO messaging error handling
      try {
        Fire.shared.send(message, chatId, global.s3Endpoint + currentProfile.picture[0],  currentChat[0].totalMessages.toString());
      }
      catch(err){
        // console.log(err);
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
        let tempMap = new Map([...chatList])
        currentChat[0].lastMessageSent = message[0].text;
        currentChat[0].totalMessages++;
        tempMap.set(chatId, currentChat)
        dispatch({type: SET_CHAT_LIST, payload: tempMap})        
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
          _id: currentProfile?._id.$oid,
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
