import React, {useState, useEffect} from "react";
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
import {SET_CHAT_LIST} from '../redux/actionTypes/chatTypes'
import RenderMatches from '../components/RenderMatches';




const ChatList = ({navigation}) => {
    const dispatch = useDispatch();
    
    const [matches, setMatches] = useState([]);
    const chatList = useSelector(state => state.chat.chatList)
    useEffect(() => {
        let tempMatchMap = new Map();

        async function getMatches() {
          axios.get(global.server + '/api/match/getMatches')
          .then(res => {
            for(let i = 0; i < res.data.length; i++){
              tempMatchMap.set(res.data[i].chatId,res.data[i].chat)
            }
            setMatches(res.data)
            dispatch({type: SET_CHAT_LIST, payload: tempMatchMap});
          })
          .catch(err => {
            console.log(err)
          })
        } 
        getMatches();
    }, [])



    const render_matches = (match, navigation, chatList) => {
      console.log("render ran");
      return(
        <RenderMatches 
          match={match} 
          navigation={navigation}
          chatList = {chatList}
        ></RenderMatches>
      )
    }
    
    return (
      <FlatList
        data={matches}
        renderItem={(match) => render_matches(match, navigation, chatList)}
        keyExtractor={(match)=>match.user._id.$oid}
        extraData={chatList}
      ></FlatList>
    );
}

const styles = StyleSheet.create({
  messageContainer:{
    height: 100,
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginTop: 40
  } 
});

export default ChatList;
