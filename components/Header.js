import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, Text, theme } from 'galio-framework';
import NavBar from '../components/NavBar';
import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../constants/Theme';
import { Feather } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import {useSelector, useDispatch} from 'react-redux';
import {SET_CURRENT_TITLE} from '../redux/actionTypes/navigationTypes'
import { EvilIcons } from '@expo/vector-icons'; 
const { height, width } = Dimensions.get('window');

const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const ProfileButton = ({isWhite, style, navigation,title }) => {
  const dispatch = useDispatch();

  if(title === 'Profile' || title === 'Edit Profile'){
    return(
      <TouchableOpacity style={[styles.button, style, styles.highlight]} 
        onPress={() => {
          navigation.navigate('Profile');
          dispatch({type: SET_CURRENT_TITLE, payload: "Profile"});
        }}>
        <Feather name="user" size={24} color="black" />
      </TouchableOpacity>
    )
  } else {
    return(
      <TouchableOpacity style={[styles.button, style]}
        onPress={() => {
          navigation.navigate('Profile');
          dispatch({type: SET_CURRENT_TITLE, payload: "Profile"});
        }
      }>
        <Feather name="user" size={24} color="black" />
      </TouchableOpacity>
    )
  }
}


const ChatListButton = ({isWhite, style, navigation,title }) => {
  const dispatch = useDispatch();
  if(title === 'Messages' || title ==="Chat"){
    return(
      <TouchableOpacity style={[styles.button, style, styles.highlight]}        
      onPress={() => {
        navigation.navigate('Messages');
        dispatch({type: SET_CURRENT_TITLE, payload: "Messages"});
      }
      }>
        <AntDesign name="message1" size={24} color="black" />
      </TouchableOpacity>
    )
  } else {
    return(
      <TouchableOpacity style={[styles.button, style]}     
       onPress={() => {
        navigation.navigate('Messages');
        dispatch({type: SET_CURRENT_TITLE, payload: "Messages"});
      }}>
        <AntDesign name="message1" size={24} color="black" />
      </TouchableOpacity>
    )
  }
}

const MatchButton = ({isWhite, style, navigation,title }) => {
  if(title === 'Matching'){
    return(
      <TouchableOpacity style={[styles.button, style, styles.highlight]}        
      onPress={() => {
      }
      }>
        <EvilIcons name="heart" size={30} color="black" style = {styles.matchButton}/>
      </TouchableOpacity>
    )
  } else {
    return(
      <TouchableOpacity style={[styles.button]}     
       onPress={() => {
      }}>
        <EvilIcons name="heart" size={30} color="black" style = {styles.matchButton} />
      </TouchableOpacity>
    )
  }
}

class Header extends React.Component {

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }
  renderRight = () => {
    const { white, title, navigation } = this.props;
    return ([
      <MatchButton title={title} key='profile-button' navigation={navigation} isWhite={white}></MatchButton>,
      <ChatListButton title={title} key='message-list-button' navigation={navigation} isWhite={white}></ChatListButton>,
      <ProfileButton title={title} key='match-button' navigation={navigation} isWhite={white}></ProfileButton>,
    ]);
  }
  renderSearch = () => {
    const { navigation } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder="What are you looking for?"
        placeholderTextColor={'#8898AA'}
        onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="search-zoom-in" family="ArgonExtra" />}
      />
    );
  }
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={[styles.tab, styles.divider]} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon name="diamond" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON} />
            <Text size={16} style={styles.tabTitle}>{optionLeft || 'Beautys'}</Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON}/>
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Fashion'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;
    
    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    )
  }
  
  render() {
    const { back, title, white, transparent, bgColor, iconColor, titleColor, navigation, ...props } = this.props;

    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <Block style={headerStyles}>
        
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          currentRoute={this.props.scene.route}
          right={this.renderRight()}
          navigation={navigation}
          rightStyle={styles.rightStyle}
          left={
            <Icon 
              name={back ? 'chevron-left' : "menu"} family="entypo" 
              size={20} onPress={this.handleLeftPress} 
              color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
              style={{ marginTop: 2 }}
            />
              
          }
          // hideLeft
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    position: 'relative',
    height: 45,
    width: 45,
  },
  highlight: {
    backgroundColor: '#C0C0C0',
    borderRadius: 24,
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: 10,
    paddingTop: 10,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 2,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 2,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER
  },
  rightStyle:{
    alignItems: 'center',
  },
  matchButton:{
    position: 'absolute',
    // right: 0,
    left: 7,
    top: 10,
    height: 45, 
    width: 45,
    // backgroundColor: "black",
  },
});

export default withNavigation(Header);
