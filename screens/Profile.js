import React, {useEffect, useState} from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  TouchableWithoutFeedback
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import { AntDesign } from '@expo/vector-icons';


const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;


const Profile  = ({navigation}) => {
    const dispatch = useDispatch();

    const currentProfile = useSelector(state=>state.profile.currentProfile);

    //Carousel
    const [activeSlide, setActiveSlide] = useState(0);

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

    const capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const _renderCarouselItem = ({item, index}) => {
      if(item != "No picture aavailable"){
        return (
          <Image
            source={{ uri:  global.s3Endpoint + item }}
            style={styles.avatar}
          /> 
      );
      }
    }
    const pagination = () => {
      return (
          <Pagination
            dotsLength={currentProfile.picture ? currentProfile.picture.length : 0}
            activeDotIndex={activeSlide}
            containerStyle={styles.paginationContainer}
            dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            animatedDuration = {0}
            animatedTension = {0}
            inactiveDotStyle={{
                // Define styles for inactive dots here
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
      );
  }
    return (
      <Block flex style={styles.profile}>
        <Block flex>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '-1%' }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>

                   <Carousel
                      data={currentProfile.picture}
                      renderItem={_renderCarouselItem}
                      sliderWidth={width}
                      itemWidth={width}
                      onSnapToItem={(index)=>setActiveSlide(index)}
                    />
                    {pagination()}
                </Block>
                <Block>
                  <TouchableWithoutFeedback 
                    onPress = {() => navigation.push("EditProfile")}
                  >
                    <AntDesign 
                    name="edit" 
                    size={24} 
                    color="black" 
                    style={styles.editButton}
                    />
                  </TouchableWithoutFeedback>
                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {capitalize(currentProfile?.first_name)} {capitalize(currentProfile?.last_name)}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {currentProfile.geocode ? currentProfile.geocode[0].city : ""}, {currentProfile.geocode ? currentProfile.geocode[0].region : ""}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      An artist of considerable range, Jessica name taken by
                      Melbourne …
                    </Text>
                    <Button
                      color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                      Show more
                    </Button>
                  </Block>
                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Album
                    </Text>
                  </Block>
                  <Block
                    row
                    style={{ paddingBottom: 20, justifyContent: "flex-end" }}
                  >
                    <Button
                      small
                      color="transparent"
                      textStyle={{ color: "#5E72E4", fontSize: 12 }}
                    >
                      View all
                    </Button>
                  </Block>
                  <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                    <Block row space="between" style={{ flexWrap: "wrap" }}>
                      {Images.Viewed.map((img, imgIndex) => (
                        <Image
                          source={{ uri: img }}
                          key={`viewed-${img}`}
                          resizeMode="cover"
                          style={styles.thumb}
                        />
                      ))}
                    </Block>
                  </Block>
                </Block>
              </Block>
            </ScrollView>
        </Block>
      </Block>
    );
  
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  editButton:{
    backgroundColor: global.primaryColor,
    height: 50,
    width: 50,
    paddingTop: 10,
    paddingLeft:11,
    position: "absolute",
    right: -15,
    top: -25,
    borderRadius:25,
  },
  paginationContainer:{
    position: 'absolute',
    bottom: 0,
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },

  avatarContainer: {
    position: "relative",
    marginTop: 0
  },
  avatar: {
    width: width,
    height: 350,
    // borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Profile;
