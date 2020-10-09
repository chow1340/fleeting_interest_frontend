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
import {useSelector} from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat'

import Fire from '../Fire'

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get("screen");


const ChatScreen = ({navigation}) => {
    const currentChatProfile = useSelector(state=>state.message.currentChatProfile);
    const chatId = useSelector(state=>state.message.chatId);

    const [messages, setMessages] = useState([]);
    useEffect(() => {
      Fire.shared.on(message =>
        setMessages(prevMessages => [...prevMessages, message]),
        chatId
      );
      // console.log(messages, "message")
    }, [])
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    return (
      <GiftedChat
        messages={messages}
        // onSend={messages => onSend(messages)}
        onSend={message => Fire.shared.send(message, chatId)}
        user={{
          _id: 1,
        }}
        inverted={false}
      />
    );
    
}

const styles = StyleSheet.create({

});

export default ChatScreen;
