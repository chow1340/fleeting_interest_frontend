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
import {SET_CURRENT_CHAT_PROFILE} from '../redux/actionTypes/messageTypes'



const MessageList = ({navigation}) => {
    const dispatch = useDispatch();
    
    const [matches, setMatches] = useState([]);
    const currentProfile = useSelector(state => state.profile.currentProfile)


    useEffect(() => {
      console.log("ranhere")
        async function getMatches() {
          axios.get(global.server + '/api/match/getMatches')
          .then(res => {
            setMatches(res.data);
          })
          .catch(err => {
            console.log(err)
          })
        } 
        getMatches();
    }, [])

    const handleNavigation = (user) => {
      dispatch({type: SET_CURRENT_CHAT_PROFILE, payload: user})
      navigation.navigate('Chat');
    }

    const render_matches = (match) => {
      // console.log(match)
      let user = match.item.user;
      return (
        <TouchableOpacity
          onPress={()=> handleNavigation(user)}
        >
          <View
            key={user._id.$oid}
            style={styles.messageContainer}
          >
            <Image
              source={{ uri: global.s3Endpoint+user.picture[0] }}
              // key={`viewed-${item.key}`}
              // resizeMode="cover"
              style={styles.displayPicture}
            />
            <View>
              <Text style={styles.name}>{user.first_name}</Text>
              <Text numberOfLines={1} style={styles.messagePreview}>
                lets do the sex lets do the sex  lets do the sex lets do the sex lets do the sex 
              </Text>
            </View>
            <Ionicons style={styles.forward} name="ios-arrow-forward" size={50} color="black" />
          </View>
        </TouchableOpacity>
      )
    }
    
    return (
      <FlatList
        data={matches}
        renderItem={(match) => render_matches(match)}
        keyExtractor={(match)=>match.user._id.$oid}
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

export default MessageList;
