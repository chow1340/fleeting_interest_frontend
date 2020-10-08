import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  Text,
  View,
  ScrollView,
  StyleSheet
} from "react-native";

import {useSelector, useDispatch} from 'react-redux';



const MessageList = ({navigation}) => {
    const [matches, setMatches] = useState();
    const currentProfile = useSelector(state => state.profile.currentProfile)
    useEffect(() => {
        async function getMatches() {
          axios.get(global.server + '/api/match/getMatches')
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            console.log(err)
          })
        } 
        getCurrentProfile();
    }, [currentProfile])
    return (
      
       <ScrollView>
           <Text>Hi</Text>
       </ScrollView>
    );
}

const styles = StyleSheet.create({

});

export default MessageList;
