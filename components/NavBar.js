import React, {useState, useEffect} from "react";
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  Dimensions
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");



const NavBar = ({
    back,
    hideLeft,
    hideRight,
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
    const navStyles = [styles.navBar, transparent && styles.transparent, style];

    const renderTitle = () => {
        // console.log(title)
        if (typeof title === 'string') {
          if(title === "Chat") {
            return (        
              <View style={styles.title}>
                <Text style={[styles.titleTextStyle, titleStyle]}>{title}</Text>
              </View>
            )
          } else {
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
    navBar: {
        width: 'auto',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        // paddingVertical: theme.SIZES.BASE,
    },
    title: {
        flex: 2,
        height: 100 * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleTextStyle: {
        fontWeight: '400',
        // fontSize: theme.SIZES.FONT * 0.875,
        // color: theme.COLORS.BLACK,
    },
    left: {
        flex: 0.5,
        height: 100 * 0.07,
        justifyContent: 'center',
        // marginLeft: theme.SIZES.BASE,
    },
    right: {
        flex: 0.5,
        height: 100 * 0.07,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row',
        marginRight: 20
        // marginRight: theme.SIZES.BASE,
    },
    transparent: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
    },
});

export default NavBar;


