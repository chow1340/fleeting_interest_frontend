import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import {useSelector, useDispatch} from 'react-redux';
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme"; 
import Images from "../constants/Images";

const Onboarding = ({navigation}) => {
    const dispatch = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currentProfile = useSelector(state=>state.profile.currentProfile);
    
    //Check if session exists, and if does go to home page
    useEffect(() => {
      async function getCurrentProfile() {
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => {
          console.log(res.data);
          if(res.data != "Session does not exist"){
              dispatch({type: SET_CURRENT_PROFILE, payload: res.data})
              setIsLoggedIn(true)
              navigation.reset({
                index: 0,
                routes:[{name: 'AppStack'}]
              })
          } 
        })
        .catch(err => {
          console.log(err)
        })
      }
      if(isLoggedIn == false){
        getCurrentProfile();
        setIsLoggedIn(true)
      }
    }, [])

    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
        <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block center>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
        </Block>
        <Block flex space="between" style={styles.padded}>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block style={styles.title}>
                <Block>
                  <Text color="white" size={60}>
                    Get
                  </Text>
                </Block>
                <Block>
                  <Text color="white" size={60}>
                    The Sex
                  </Text>
                </Block>
                <Block style={styles.subTitle}>
                  <Text color="white" size={16}>
                    Super 69 matchmaking
                  </Text>
                </Block>
              </Block>
              <Block center>
                <Button
                  style={styles.button}
                  color={argonTheme.COLORS.SECONDARY}
                  onPress={() => navigation.navigate("Login")}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
                  Log In
                </Button>
              </Block>
              <Block center>
                
                <Button
                  style={styles.button}
                  color={argonTheme.COLORS.SECONDARY}
                  onPress={() => navigation.navigate("Register")}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
                  Register
                </Button>
              </Block>
          </Block>
        </Block>
      </Block>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;
