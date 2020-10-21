import React, {useState, useRef} from "react";

import {registerApi} from "../api/User";
import IntlPhoneInput from 'react-native-intl-phone-input';

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { NavigationContext } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");



const Register = () => {
    const [phoneInput, setPhoneInput] = useState();
    const [phoneNumberIsVerified, setPhoneNumberIsVerified] = useState()
    const [password, setPassword] = useState();
    const onChangeText = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
      if(isVerified) {
        setPhoneNumberIsVerified(true)
        setPhoneInput(dialCode + unmaskedPhoneNumber)
      }
    };

    // TODO take care of this garbage error handling
    const register = () =>{
      if(password, phoneNumberIsVerified, phoneInput){
        registerApi(phoneInput.substring(1), password);
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
                      <Button color="primary" onPress = {register} style={styles.createButton}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          CREATE ACCOUNT
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

export default Register;
