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
import { GiftedChat , Composer} from 'react-native-gifted-chat'

import Fire from '../Fire'

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-image-keyboard'
import {TextInput} from 'react-native';

const { width } = Dimensions.get("screen");


const ChatScreen = ({navigation}) => {
    const currentProfile = useSelector(state=>state.profile.currentProfile)
    const currentChatProfile = useSelector(state=>state.message.currentChatProfile);
    const chatId = useSelector(state=>state.message.chatId);

    const [messages, setMessages] = useState([]);
    useEffect(() => {
      Fire.shared.on(message =>
        setMessages(prevMessages => [...prevMessages, message]), chatId
      );
    }, [])
  
    const onImageChange = ({nativeEvent}) => {
      const uri = nativeEvent;
      console.log(uri);
    }
  
    const onSend = useCallback((messages = []) => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    const handleSend = (message) => {
      Fire.shared.send(message, chatId, global.s3Endpoint + currentProfile.picture[0]);
    }

    const renderComposer = props => <Composer {...props} textInputProps={{onImageChange}} />;
    const _onImageChange = (event) => {
      const {uri, linkUri, mime, data} = event.nativeEvent;
      console.log(event);
      console.log(uri)
      // Do something with this data
    }
    return (
    
      // <GiftedChat
      //   messages={messages}
      //   onSend={message => handleSend(message)}
      //   user={{
      //     _id: currentProfile?._id.$oid,
      //   }}
      //   inverted={false}
      //   renderComposer = {renderComposer}
        
      // />
      <TextInput onImageChange={_onImageChange} />
      
    );
    
}

const styles = StyleSheet.create({

});

export default ChatScreen;
