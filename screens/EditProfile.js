import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import {
  StyleSheet,
  Dimensions,
  ScrollView, 
  Image,
  Platform,
  ActivityIndicator,
  View,
  TouchableWithoutFeedback,
  Animated,
  Alert,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { DraggableGrid } from 'react-native-draggable-grid';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const EditProfile = ({navigation}) => {
    const currentProfile = useSelector(state=>state.profile.currentProfile)
    const dispatch = useDispatch();

    const [dragging, setIsDragging] = useState();
    const [gridIsEditable, setGridIsEditable] = useState(false);
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
    const [image, setImage] = useState(currentProfile.picture ? global.s3Endpoint + currentProfile.picture[0] : null);
    const [isSaving, setIsSaving] = useState();
    const [nextIndex, setNextIndex] = useState(-1);

  
    const onChangeFirstName = (value) => {
      currentProfile.first_name = value
    };
    const onChangeLastName = (value) => {
      currentProfile.last_name = value
    };

    const [pictureArray, setPictureArray] = useState([]);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      })
      
      if (!result.cancelled) { 
        let curIndex = 0; 
        //Update picture array
        if(nextIndex != -1){
          curIndex = nextIndex
        } else {
          curIndex = currentProfile.picture.length;
        }
  
        let tempArray = [...pictureArray];
        tempArray[curIndex] = {
          uri: result.uri,
          key: curIndex.toString(),
          tempPic: true,
        }
        setPictureArray(tempArray);
        setNextIndex(curIndex + 1)
      }
    };



    useEffect(() => {
      async function getCurrentProfile() {
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => {
          // console.log(res.data)
          dispatch({type: SET_CURRENT_PROFILE, payload: res.data})
        })
        .catch(err => {
          console.log(err)
        })
      } 
      getCurrentProfile();
    }, [])
    

    useEffect(()=>{
      if(currentProfile?.picture){
        let picture = currentProfile.picture
        let temp = []
        for(let i = 0; i < picture.length; i++) {
          temp.push({
            uri: picture[i],
            key: i.toString()
          })
        }

        for(let i = temp.length; i<6; i++){
          temp.push({
            uri: "No picture available",
            key: i.toString(),
            disabledDrag: true,
            disabledReSorted: true
          })
        }
        setPictureArray(temp);
        setNextIndex(currentProfile.picture.length)
      }
    },[currentProfile?.picture])

    
    const saveEditProfile = async () => {
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
    }

    const editGridButton = () => {
      if(gridIsEditable == false) {
        return (
          <Button 
            color="primary"  
            style={styles.saveButton}
            onPress = {()=>setGridIsEditable(true)}
            >
              <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                EDIT ORDER
              </Text>
          </Button>
        )
      } else {
        return (
          <Button 
            color="primary"  
            style={styles.saveButton}
            onPress = {()=>
              handleSavePictureArray()
            }
          >
            <Text bold size={14} color={argonTheme.COLORS.WHITE}>
              SAVE
            </Text>
        </Button>
        )
      }

    }

    const onDragStart = () => {
      setIsDragging(true);
      
      animatedValue.setValue(1);
      Animated.timing(animatedValue, {
        toValue:3,
        duration:400,
        useNativeDriver: false, 
      }).start();
    }

    const renderItem = (item) => {
      if(item.uri === "No picture available") {
        return(
          <TouchableWithoutFeedback onPress={()=>pickImage()} >
            <View 
              style={styles.item}
              key={item.key}
            >
                <Ionicons style={styles.plusIcon} name="md-add-circle-outline"></Ionicons>
            </View>
          </TouchableWithoutFeedback>
        )
      } else {
        return (
          <View
            style={styles.item}
            key={item.key}
          >
             <TouchableWithoutFeedback
               onPress={()=>deleteAlert(item)}
              >
                <View style={styles.deleteContainer}>
                  <FontAwesome style={styles.deleteButton} name="minus-circle" size={24} color="black" />
                </View>
             </TouchableWithoutFeedback>
            {item.tempPic &&
              <Image
                source={{ uri: item.uri }}
                style={styles.gridProfile}
              />
            }
            {!item.tempPic &&
              <Image
                source={{ uri: global.s3Endpoint+item.uri }}
                style={styles.gridProfile}
              />
            }

          </View>
        )
      }
    }

    const deleteAlert = (item) => {
      Alert.alert(
        "Delete this picture",
        "Are you sure you want to delete this picture?",
        [

          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Delete", onPress: () => handleDelete(item) }
        ],
        { cancelable: true }
      );
    }
    
    const handleDelete = (item) => {
      let tempPictureArray = [...pictureArray];
      tempPictureArray.splice(item.key, 1);

      axios.post(global.server + '/api/image/deleteImage', 
      {
        params: {
          fileKey: item.uri
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res);
        setPictureArray(tempPictureArray)
      })
      .catch(err => {
        console.log(err)
      })
    }

  
      

    const handleSavePictureArray = () => {
      console.log(pictureArray)
      for(let i = 0; i < pictureArray.length; i++){
        
        var picture = pictureArray[i];
        
        //Update original pictures without file upload
        if(!picture.tempPic && picture.uri != "No picture available"){
          
          axios.post(global.server + '/api/image/updatePictureArrayOrder', 
            {
              params: {
                index : i,
                uri : picture.uri
              }
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          .then(
            res => {
            // console.log(res.data)
            }
          )
          .catch(
            err => console.log(err)
          )
        } else if (picture.tempPic === true) {
			let formdata = new FormData();
			formdata.append('file',{
				uri: Platform.OS === 'android' ? picture.uri : 'file://' + picture.uri,
				name: currentProfile?._id.$oid + uuidv4(),
				type: 'image/jpeg',
			});
			
			formdata.append('index', i)

			axios({
				url: global.server + '/api/image/uploadFileAndUpdatePictureArrayOrder',
				method: "POST",
				data: formdata,
				headers: {
					'content-type' : 'multipart/form-data'
				}
      })}}
      
      let tempArray = [];
      //update current profile redux
      for(let i = 0; i < pictureArray.length; i++) {
        tempArray.push(pictureArray[i].uri);
      }
      currentProfile.picture = tempArray
      dispatch({type: SET_CURRENT_PROFILE, payload: currentProfile})

      setNextIndex(-1);
      setGridIsEditable(false);
      setImage(global.s3Endpoint+pictureArray[0].uri);
    }

    const _renderItem = (item) => {
      if(!item.tempPic) {
        return(
          <Image
            source={{ uri: global.s3Endpoint+item.uri }}
            key={`viewed-${item.key}`}
            resizeMode="cover"
            style={styles.thumb}
          />
        )
      } else {
        return(
          <Image
          source={{ uri: item.uri }}
          key={`viewed-${item.key}`}
          resizeMode="cover"
          style={styles.thumb}
        />
        )
      }

    }
      
 
    return (
        <ScrollView contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={!dragging}
              >
                 <Image
                    source={{ uri: image }}
                    style={styles.avatar}
                  />

                 <Block flex middle center>
                    <Button 
                      color="primary"  
                      style={styles.saveButton}
                      onPress = {pickImage}
                      >
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          PICK IMAGE
                        </Text>
                    </Button>

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

                 </Block>
                  {editGridButton()}
                    {!gridIsEditable &&

                    <Block >
                      <Block row  style={{ flexWrap: "wrap" , justifyContent:"space-around"}}>
                        {pictureArray.map((item) => (
                          _renderItem(item)
                        ))}
                      </Block>
                    </Block>
                    }
                  {
                    gridIsEditable && 
               
                    <View style={styles.wrapper}>

                      <DraggableGrid
                      numColumns={3}
                      renderItem={renderItem}
                      data={pictureArray}
                      onDragStart = {onDragStart}
                      onDragRelease={(data) => {
                        setPictureArray(data);// need reset the props data sort after drag release
                        setIsDragging(false);
                      }}
                      dragStartAnimation={{
                        transform:[
                          {scale:1}
                        ],
                      }}
                      />
                    </View>
                  }

                   <Block>
                    <Block middle>
                      {
                        isSaving &&
                        <ActivityIndicator size="small" color="#0000ff" />
                      }
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

              </ScrollView>


    );
  
}



const styles = StyleSheet.create({
  
  wrapper:{
    width:'100%',
    height:'100%',
    justifyContent:'center',
  },

  deleteContainer:{
    position: 'absolute',
    top: -10,
    right: -10,
    position: 'absolute',
    zIndex: 99,
    // backgroundColor: 'black',
    height: 30,
    width: 30,
    justifyContent: 'center'
  },
  deleteButton:{

    fontSize: 25,
    zIndex: 99,
    color: "red",
    left: 4
  },
  item: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#C0C0C0",
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'row'
  },
  plusIcon:{
    fontSize:40,
  },
  gridProfile:{
    width: '100%',
    height: '100%',
    borderRadius: 8,
    // position: "relative",
  },
  thumb: {
    borderRadius: 8,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  inputStyle :{
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    width: 0.8*width,
    height: 50,
    marginTop: 50
  },

  registerContainer: {
    width: width ,
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
    padding: 30,
    paddingTop: 0,
    marginTop:-20
  },

  saveButton: {
    width: width * 0.3,
    marginTop: 25
  },
  avatar: {
    width: width,
    height: 350,
    borderWidth: 0
  },
});

export default EditProfile;
