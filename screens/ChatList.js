import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Button
} from "react-native";

import { Ionicons } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");
import {SET_CHAT_LIST, SET_MATCH_LIST} from '../redux/actionTypes/chatTypes'
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import RenderMatches from '../components/RenderMatches';


import Fire from '../Fire'

const ChatList = ({navigation}) => {
    const dispatch = useDispatch();
    
    const matchList = useSelector(state => state.chat.matchList);
    const chatList = useSelector(state => state.chat.chatList)
    const currentProfile = useSelector(state=>state.profile.currentProfile)


    const testSend = () => {
      var DateTime = new Date()
      // let chatId = "5f849953afb93e5b940e784c" //jeffrey2
      let chatId = "5f8499dda823f459fae619e5" //jeffrey3
      let message = {
        _id: "-asdasdasd",
        text: "test",
        createdAt: DateTime.valueOf(),
        user: {
          _id: "5f7274dd74415c6435d6434b",
          avatar: "https://app-jeffrey-chow.s3.ca-central-1.amazonaws.com/5f7274dd74415c6435d6434b0b5a34db-804a-4483-8ee1-c7aa9434d8fb"
        }
      }
      let profilePicture = "5f7274dd74415c6435d6434b0b5a34db-804a-4483-8ee1-c7aa9434d8fb"
      try {
        Fire.shared.send([message], chatId, global.s3Endpoint + profilePicture,  23);
      } catch(err){
        console.log(err);
      }
    }

    const sortList = () => {
      let tempMatch = [...matchList]
      tempMatch.sort((a, b) => {

        let firstDate = a.chat[0].lastMessageDate.$date || a.chat[0].lastMessageDate;
        let secondDate = b.chat[0].lastMessageDate.$date || b.chat[0].lastMessageDate;

        if(firstDate > secondDate) {
          return -1;
        }
        if(firstDate < secondDate) {
          return 1;
        }
        return 0;
      }); 
      dispatch({type: SET_MATCH_LIST, payload: tempMatch});
    }

    useEffect(() => {
      console.log("ranhere");
        let tempMatchMap = new Map();
        async function getMatches() {
          axios.get(global.server + '/api/match/getMatches')
          .then(res => {
            for(let i = 0; i < res.data.length; i++){
              tempMatchMap.set(res.data[i].chatId,res.data[i].chat)
            }
            dispatch({type: SET_MATCH_LIST, payload: res.data});
            dispatch({type: SET_CHAT_LIST, payload: tempMatchMap});
          })
          .catch(err => {
            console.log(err)
          })
        } 
        getMatches();
    }, [])

    //Sort matches by last message date
    useEffect(()=>{
      // sortList();
    }, [matchList])

  
    useEffect(() => {
      async function getCurrentProfile() {
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => {
          dispatch({type: SET_CURRENT_PROFILE, payload: res.data})
        })
        .catch(err => {
          console.log(err)
        })
      } 
      if(Object.keys(currentProfile._id) === 0 ) {
        getCurrentProfile();
      }
    })

    const render_matches = (match, navigation, chatList) => {
      return(
        <RenderMatches 
          match={match} 
          navigation={navigation}
          chatList = {chatList}
          sortListFunction = {sortList}
        ></RenderMatches>
      )
    }
    return (
      <View>
      <FlatList
        data={matchList}
        renderItem={(match) => render_matches(match, navigation, chatList)}
        keyExtractor={(match)=>match.user._id.$oid}
        extraData={chatList}
      ></FlatList>
      <Button
        title = "Test button"
        onPress = {() => testSend()}
      >
      </Button>
      </View>
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
