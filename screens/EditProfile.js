import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import {getCurrentUserApi} from '../api/User';
import {uploadUpdateOrderApi} from '../api/Image'
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
import { HeaderHeight } from "../constants/utils";

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

    const addImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      })
      let tempArray = [...pictureArray];

      if (!result.cancelled) { 
        let curIndex = 0; 
        //Update picture array
        if(nextIndex != -1){
          curIndex = nextIndex
        } else {
          curIndex = currentProfile.picture.length;
        }

        let formdata = new FormData();
        formdata.append('file',{
          uri: Platform.OS === 'android' ? result.uri : 'file://' + result.uri,
          name: currentProfile?._id.$oid + uuidv4(),
          type: 'image/jpeg',
        });
        formdata.append('index', curIndex)

        const upload = await uploadUpdateOrderApi(formdata)
        console.log(upload);

        if(upload.data) {
          tempArray[curIndex] = {
            uri: upload.data,
            key: curIndex.toString(),
          }
          setPictureArray(tempArray);
        }
        // axios({
        //   url: global.server + '/api/image/uploadFileAndUpdatePictureArrayOrder',
        //   method: "POST",
        //   data: formdata,
        //   headers: {
        //     'content-type' : 'multipart/form-data'
        //   }
        // })

        // .then((res)=>{
        //   tempArray[curIndex] = {
        //     uri: res.data,
        //     key: curIndex.toString(),
        //   }
        //   setPictureArray(tempArray);
        // })
        // .catch(err => console.log(err));



        setNextIndex(curIndex + 1)
      }
    };



    useEffect(() => {
      async function getCurrentProfile() {
        const user = await getCurrentUserApi()
        if(user.data) {
          dispatch({type: SET_CURRENT_PROFILE, payload: user.data})
        }
      } 
      if(currentProfile._id?.$oid === undefined) {
        getCurrentProfile();
      }
    }, [])
    

    useEffect(()=>{
      if(currentProfile?.picture){
        let picture = currentProfile?.picture
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
      if(item.uri === "No picture available" ) {
        item.disabledDrag = true;
        return(
          <TouchableWithoutFeedback onPress={()=>addImage()} >
            <View 
              style={styles.item}
              key={item.key}
            >
                <Ionicons style={styles.plusIcon} name="md-add-circle-outline"></Ionicons>
            </View>
          </TouchableWithoutFeedback>
        )
      } else if (item.isLoading === true) {
      return(
        <TouchableWithoutFeedback onPress={()=>addImage()} >
          <View 
            style={styles.item}
            key={item.key}
          >
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        </TouchableWithoutFeedback>
      )}
      else {
        item.disabledDrag = !gridIsEditable;
        return (
          <View
            style={styles.item}
            key={item.key}
          >
            { gridIsEditable &&
              <TouchableWithoutFeedback
              onPress={()=>deleteAlert(item)}
              >
                <View style={styles.deleteContainer}>
                  <FontAwesome style={styles.deleteButton} name="minus-circle" size={24} color="black" />
                </View>
              </TouchableWithoutFeedback>
            }

            {item.tempPic &&
              <Image
                source={{ uri:item.uri }}
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
        setPictureArray(tempPictureArray)
      })
      .catch(err => {
        console.log(err)
      })
    }


    const handleSavePictureArray = () => {
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
          .catch(
            err => console.log(err)
          )
        } 
    }
      
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
 
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ScrollView contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps='handled'
            scrollEnabled={!dragging}
          >
            <Image
              source={{ uri: image }}
              style={styles.avatar}
            />

              <Block flex middle center style={styles.infoContainer}>
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
              {editGridButton()} 
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

          </ScrollView>
        </Block>
      </Block>
    );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    marginTop: 50,
    flex: 1,
    flexGrow: 1
  },
  infoContainer: {
    marginTop: 15,
  },
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
    // backgroundColor: "#C0C0C0",
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
