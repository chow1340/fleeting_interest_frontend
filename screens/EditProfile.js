import React, {useState, useRef} from "react";
import axios from 'axios';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
import IntlPhoneInput from 'react-native-intl-phone-input';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { NavigationContext } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'

const { width, height } = Dimensions.get("screen");



const EditProfile = ({navigation}) => {
    const currentProfile = useSelector(state=>state.profile.currentProfile)
    const dispatch = useDispatch();
    const [phoneNumberIsVerified, setPhoneNumberIsVerified] = useState()
    const [password, setPassword] = useState();

    const onChangeFirstName = (value) => {
      currentProfile.first_name = value
    };
    const onChangeLastName = (value) => {
      currentProfile.last_name = value
    };

    const saveEditProfile = () => {
      axios.post(global.server + '/api/user/editProfile', 
      {
        params: {
          currentProfile : currentProfile
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res=>{
          dispatch({type: SET_CURRENT_PROFILE, payload: res.data});
          navigation.goBack()
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    return (
      <Block flex middle>
        <StatusBar hidden />
        {/* <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height}}
        > */}
          <Block flex middle>
            <Block style={styles.registerContainer}>

              <ScrollView contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps='handled'
              >
                 <Block width={width * 0.7}>
                      <Text>
                        First Name
                      </Text>
                      <Input
                        placeholder="First Name"
                        onChangeText={value =>onChangeFirstName(value)}
                      >
                        {currentProfile?.first_name ? currentProfile.first_name : ""}

                        </Input>
                  </Block>

                  <Block width={width * 0.7}>
                      <Text>
                        Last Name
                      </Text>
                      <Input
                        placeholder="Last Name"
                        onChangeText={value=>onChangeLastName(value)}
                        >
                        {currentProfile?.last_name ? currentProfile.last_name : ""}

                        </Input>
                  </Block>

              </ScrollView>
                <Block>
                    <Block middle>
                      <Button 
                      color="primary"  
                      style={styles.saveButton}
                      onPress = {saveEditProfile}
                      >
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          SAVE
                        </Text>
                      </Button>
                    </Block>
              </Block>
            </Block>
          </Block>
        {/* </ImageBackground> */}
      </Block>
    );
  
}

const styles = StyleSheet.create({
    
  inputStyle :{
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    width: 0.8*width,
    height: 50,
    marginTop: 50
  },

  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    padding: 30
  },

  saveButton: {
    width: width * 0.3,
    marginTop: 25
  },

});

export default EditProfile;
