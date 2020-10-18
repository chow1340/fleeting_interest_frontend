import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";
import {SET_CURRENT_TITLE} from '../redux/actionTypes/navigationTypes'
import { HeaderHeight } from "../constants/utils";
import {SET_VIEW_PROFILE} from '../redux/actionTypes/profileTypes'

const { width } = Dimensions.get("screen");
const NavBar = ({
    back,
    hideLeft,
    hideRight,
    navigation,
    left,
    leftStyle,
    leftIconColor,
    leftHitSlop,
    leftIconName,
    leftIconFamily,
    onLeftPress,
    right,
    rightStyle,
    style,
    // styles,
    transparent,
    theme,
    title,
    titleStyle,
  }) => {

    const dispatch = useDispatch();

    const navStyles = [styles.navBar, transparent && styles.transparent, style];
    const currentChatProfile = useSelector(state => state.chat.currentChatProfile);
    const viewProfile = useSelector(state => state.profile.viewProfile);

    const handleProfileNavigation = (user) => {
      dispatch({type: SET_VIEW_PROFILE , payload: user});
      console.log("Pressed")
      navigation.navigate('View Profile');
    }

    const renderTitle = () => {
      if (typeof title === 'string') {
        switch(title) {
          case "Chat" :
            return (     
              <TouchableWithoutFeedback onPress = {()=>handleProfileNavigation(currentChatProfile)}>
                <View style={[styles.chatContainer]}>
                    <Image
                      source={{ uri: global.s3Endpoint + currentChatProfile?.picture[0] }}
                      style={styles.headerAvatar}
                    ></Image>
                    <Text style={[styles.titleTextStyle, titleStyle]}>
                      {currentChatProfile?.first_name ? currentChatProfile.first_name : title}
                    </Text>
                </View>
              </TouchableWithoutFeedback>   
            );
          
            case "View Profile": 
              return (        
                <View style={styles.title}>
                  <Text style={[styles.titleTextStyle, titleStyle]}>
                    {viewProfile?.first_name ? viewProfile.first_name + " " + viewProfile.last_name: title}
                  </Text>
                </View>
              )
            case "Messages" :
              return (
                <View style={styles.title}>
                  <Text style={[styles.titleTextStyle, titleStyle]}>{title} </Text>
                </View>
              );
            default :
              return (
                <View style={styles.title}>
                  <Text style={[styles.titleTextStyle, titleStyle]}>{title} </Text>
                </View>
              );
        }
      }
    
        if (!title) return null;
    
        return title;
      }
    
      const renderLeft = () => {
        if (!hideLeft) {
          if (leftIconName || back) {
            return (
              <View style={[styles.left, leftStyle]}>
                <TouchableOpacity onPress={() => onLeftPress && onLeftPress()} hitSlop={leftHitSlop}>
                  <Icon
                    family={leftIconFamily || "evilicons"}
                    color={leftIconColor || theme.COLORS.ICON}
                    size={theme.SIZES.BASE * 1.0625}
                    name={leftIconName || (back ? 'chevron-left' : 'navicon')}
                  />
                </TouchableOpacity>
              </View>
            );
          }
          return <View style={[styles.left, leftStyle]}>{left}</View>;
        }
        return <View style={[styles.left]} />;
      }
    
      const renderRight = () => {
        // const hasIcons = React.Children.count(right) > 1;
        const rightStyles = [styles.right, rightStyle];
        if (!hideRight) {
          return (
            <View 
            // right row={hasIcons} 
            style={rightStyles}>
              {right}
            </View>
          );
        }
        return <View style={styles.right} />;
      }

    return (
        <View style={navStyles}>
          {renderLeft()}
          {renderTitle()}
          {renderRight()}
        </View>
    );
}

const styles = StyleSheet.create({
    headerAvatar : {
      height: HeaderHeight*0.55,
      width: HeaderHeight*0.55,
      borderRadius: HeaderHeight*0.55, 
      marginLeft: 10,
      marginRight: 10
    }, 
    chatContainer:{
      flex: 2,
      height: 100 * 0.07,
      alignItems: 'center',
      flexDirection: "row"
    },
    navBar: {
        width: 'auto',
        height: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
    },
    title: {
        flex: 2,
        height: 100 * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        fontWeight: '400',
    },
    left: {
        flex: 0.5,
        height: 100 * 0.07,
        justifyContent: 'center',
    },
    right: {
        flex: 0.5,
        height: 100 * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        marginRight: 20
    },
    transparent: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
    },
});

export default NavBar;


