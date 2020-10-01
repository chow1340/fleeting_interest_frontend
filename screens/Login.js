import React, {useState, useEffect} from "react";
import axios from 'axios';
import IntlPhoneInput from 'react-native-intl-phone-input';
import {useSelector, useDispatch} from 'react-redux';
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");


const Login = ({navigation}) => {
    const [phoneInput, setPhoneInput] = useState();
    const [phoneNumberIsVerified, setPhoneNumberIsVerified] = useState()
    const [password, setPassword] = useState();
    const dispatch = useDispatch()
    const onChangeText = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
      if(isVerified) {
        setPhoneNumberIsVerified(true)
        setPhoneInput(dialCode + unmaskedPhoneNumber)
      }
    };


    const currentProfile = useSelector(state=>state.profile.currentProfile);

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
      getCurrentProfile();
    }, [])

    // TODO take care of this garbage error handling
    const login = () =>{
      if(password, phoneNumberIsVerified, phoneInput){
        axios.post(global.server + '/api/user/login', 
        {
          params: {
            phone_number: phoneInput.substring(1), //take out the +
            password: password
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        
        )
        .then(res=>{
            console.log(res.data)
            if(res.data == "Login Successful") {
              navigation.reset({
                index: 0,
                routes:[{name: 'AppStack'}]
              })
              // navigation.push("AppStack")
            } 
        })
        .catch(function (error) {
          console.log(error);
        })
      }
    }
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              {/* TODO can do social signup later */}
              <Block flex>
                <Block flex={0.17} middle>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <SafeAreaView>
                      <IntlPhoneInput 
                      defaultCountry="CA"
                      // customModal = {renderCustomModal} 
                      filterInputStyle={{textTransform: 'capitalize'}}
                      onChangeText = {onChangeText}
                      lang="EN"
                
                      />
                    </SafeAreaView>

                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText = {password => setPassword(password)}
                      />
                    </Block>
                    <Block middle>
                      <Button color="primary" onPress = {login} style={styles.createButton}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          Log In
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  
}

const styles = StyleSheet.create({
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
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  },
  phoneInput:{
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginBottom: 15,
    paddingBottom: 10
  },
  flagStyle:{
    display: "none"
  }
});

export default Login;
