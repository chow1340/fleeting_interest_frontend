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
  TouchableWithoutFeedback
  
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';

import { v4 as uuidv4 } from 'uuid';
import SortableGrid from '../components/SortableGrid'
import { Ionicons } from '@expo/vector-icons';

import { DraggableGrid } from 'react-native-draggable-grid';
import { TouchableHighlight } from "react-native-gesture-handler";


const { width, height } = Dimensions.get("screen");


const EditProfile = ({navigation}) => {
    const sortableGrid = useRef();
    const currentProfile = useSelector(state=>state.profile.currentProfile)
    const dispatch = useDispatch();

    const [dragging, setIsDragging] = useState()

    const [image, setImage] = useState(currentProfile.picture ? global.s3Endpoint + currentProfile.picture[0] : null);
    const [isSaving, setIsSaving] = useState();
    
    const [inactive, setInactive] = useState([]);
    // console.log(pictureArray, "HERRERE")
    const onChangeFirstName = (value) => {
      currentProfile.first_name = value
    };
    const onChangeLastName = (value) => {
      currentProfile.last_name = value
    };

    const [pictureArrayChanged, setPictureArrayChanged] = useState();

    const [pictureArray, setPictureArray] = useState([]);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      })
      
      if (!result.cancelled) {
        let tempInactive = inactive;
        let removedInactive = tempInactive.shift();
        let newArray = pictureArray;
        newArray[removedInactive] = {
          picIndex: removedInactive,
          uri: result.uri
        };

        
      }
    };
    useEffect(() => {
      async function getCurrentProfile() {
        axios.get(global.server + '/api/user/getCurrentUser')
        .then(res => {
          console.log(res.data)
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
        let tempInactive = []
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
      }
    },[currentProfile?.picture])

    
    const saveEditProfile = async () => {
      console.log(pictureArray, "HERES")
      let profileInfoSaved = false
      let profilePictureSaved = false
      setIsSaving(true);

      let formdata = new FormData();
      formdata.append('file',{
        uri: Platform.OS === 'android' ? image : 'file://' + image,
        name: currentProfile?._id.$oid + uuidv4(),
        type: 'image/jpeg'
      });
      
      // axios.all([
      //   axios.post(global.server + '/api/user/editProfile', 
      //   {
      //     params: {
      //       currentProfile : currentProfile
      //     }
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   })
      //   ,
      //   axios({
      //     url: global.server + '/api/image/uploadProfilePicture',
      //     method: "POST",
      //     data: formdata,
      //     headers: {
      //         'content-type' : 'multipart/form-data'
      //     }
      //   })
      // ])
      // .then(axios.spread((newProfileInfo, res2) => {
      //   dispatch({type: SET_CURRENT_PROFILE, payload: newProfileInfo.data});

      //   console.log(res2.data, "RES2")
      // }))
      



      // if(imageChanged){
      //   axios({
      //     url: global.server + '/api/image/uploadProfilePicture',
      //     method: "POST",
      //     data: formdata,
      //     headers: {
      //         'content-type' : 'multipart/form-data'
      //     }
      //   })
      //   .then(res => {
      //     currentProfile.picture[0] = res.data
      //     dispatch({type: SET_CURRENT_PROFILE, payload: currentProfile});
      //     profilePictureSaved = true
      //   })
      //   .catch(err => {
      //       console.log(err.response.data);
      //   })
      // } else {
      //   profilePictureSaved = true
      // }

      console.log(profileInfoSaved, profilePictureSaved)
      // while(true) {
      //   console.log("ran");
      //   if(profileInfoSaved || profilePictureSaved) {
      //     setIsSaving(false);
      //     navigation.goBack();
      //     break;
      //   }
      // }
      
    }

    const render_item = (item) => {
      if(item.uri === "No picture available") {
        return(
          <TouchableWithoutFeedback onPress={()=>console.log("pressed")} >
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
              <Image
                source={{ uri: global.s3Endpoint+item.uri }}
                style={styles.gridProfile}
              />
          </View>
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
                  <View style={styles.wrapper}>
                    <DraggableGrid
                      numColumns={3}
                      renderItem={render_item}
                      data={pictureArray}
                      onDragStart = { () => {
                        setIsDragging(true);
                      }}
                      onDragRelease={(data) => {
                        setPictureArray(data);// need reset the props data sort after drag release
                        setIsDragging(false);
                      }}
                    />
                  </View>
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
    paddingTop:100,
    width:'100%',
    height:'100%',
    justifyContent:'center',
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
    position: 'relative'
    // flexDirection: 'row'
  },
  plusIcon:{
    fontSize:40,
  },
  gridProfile:{
    width: '100%',
    height: '100%',
    borderRadius: 8
  },
  // item:{
  //   width:100,
  //   height:100,
  //   borderRadius:8,
  //   backgroundColor:'black',
  //   justifyContent:'center',
  //   alignItems:'center',
  // },
  // item_text:{
  //   fontSize:40,
  //   color:'#FFFFFF',
  // },
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
    // overflow: "hidden",
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
    // borderRadius: 62,
    borderWidth: 0
  },
});

export default EditProfile;


// import React, {useState, useEffect, useRef} from "react";
// import axios from 'axios';
// import {
//   StyleSheet,
//   Dimensions,
//   ScrollView, 
//   Image,
//   Platform,
//   ActivityIndicator,
//   View,
  
// } from "react-native";
// import { Block, Checkbox, Text, theme } from "galio-framework";
// import { Button, Icon, Input } from "../components";
// import { Images, argonTheme } from "../constants";
// import { useDispatch, useSelector } from "react-redux";
// import {SET_CURRENT_PROFILE} from '../redux/actionTypes/profileTypes'
// import * as ImagePicker from 'expo-image-picker';
// import SortableGrid from '../components/SortableGrid'
// import { Ionicons } from '@expo/vector-icons';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
// import { set } from "react-native-reanimated";

// const { width, height } = Dimensions.get("screen");


// const EditProfile = ({navigation}) => {

//     const currentProfile = useSelector(state=>state.profile.currentProfile)
//     const dispatch = useDispatch();

//     const [dragging, setIsDragging] = useState()

//     const [image, setImage] = useState(currentProfile.picture ? global.s3Endpoint + currentProfile.picture[0] : null);
//     const [imageChanged, setImageChanged] = useState();
//     const [isSaving, setIsSaving] = useState();
    
//     const [pictureArray, setPictureArray] = useState([]);
//     const [imageOrder, setImageOrder] = useState();
//     const [inactive, setInactive] = useState([]);
  
//     const onChangeFirstName = (value) => {
//       currentProfile.first_name = value
//     };
//     const onChangeLastName = (value) => {
//       currentProfile.last_name = value
//     };

//     const pickImage = async () => {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.All,
//         allowsEditing: true,
//         aspect: [3, 3],
//         quality: 1,
//       });
  
//       console.log(result);
  
//       if (!result.cancelled) {
//         setImage(result.uri);
//         setImageChanged(true)
//       }
//     };
//     useEffect(() => {
//       if(!currentProfile._id){
//         async function getCurrentProfile() {
//           axios.get(global.server + '/api/user/getCurrentUser')
//           .then(res => {
//             dispatch({type: SET_CURRENT_PROFILE, payload: res.data});
//             console.log(res.data)
//           })
//           .catch(err => {
//             console.log(err)
//           })
//         }
//         getCurrentProfile();
//       }
//     }, [])

//     useEffect(()=>{
//       if(currentProfile?.picture){
//         let picture = currentProfile.picture;
//         let temp = [];
//         let tempInactive = [];
  
//         for(let i = 0; i < picture.length ; i++) {
//           temp.push(picture[i]);
//         }
//         for(let i = temp.length; i<6; i++){
//           temp.push("No picture available");
//           tempInactive.push(i);
//         }
//         setPictureArray(temp);
//         setInactive(tempInactive);
//         // console.log(tempInactive)
//         console.log(pictureArray, "picturearry")
//         console.log(inactive, "inactive")
//       }
//     }, [currentProfile?.picture])


//     const saveEditProfile = async () => {
//       let profileInfoSaved = false
//       let profilePictureSaved = false
//       let imageOrderSaved = false
//       setIsSaving(true);

//       axios.post(global.server + '/api/user/editProfile', 
//       {
//         params: {
//           currentProfile : currentProfile
//         }
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(res=>{
//           dispatch({type: SET_CURRENT_PROFILE, payload: res.data});
//           // navigation.goBack()
//           profileInfoSaved = true
//       })
//       .catch(function (error) {
//         console.log(error);
//       })
//       let formdata = new FormData();
//       formdata.append('file',{
//         uri: Platform.OS === 'android' ? image : 'file://' + image,
//         name: currentProfile?._id.$oid + uuidv4(),
//         type: 'image/jpeg'
//       });

//       if(imageChanged){
//         axios({
//           url: global.server + '/api/image/uploadProfilePicture',
//           method: "POST",
//           data: formdata,
//           headers: {
//               'content-type' : 'multipart/form-data'
//           }
//         })
//         .then(res => {
//           currentProfile.picture[0] = res.data
//           dispatch({type: SET_CURRENT_PROFILE, payload: currentProfile});
//           profilePictureSaved = true
//         })
//         .catch(err => {
//             console.log(err.response.data);
//         })
//       } else {
//         profilePictureSaved == true
//       }

//       const updateImageOrder = () => {
//         let tempPictureArray = [] 
//         for(let i = 0; i < imageOrder.itemOrder.length; i++) {
//           tempPictureArray.push(imageOrder.itemOrder[i].uri);
//           console.log(tempPictureArray, "HEREEE" , i)
//           if(imageOrder.itemOrder[i]=="No picture available"){
//             continue;
//           }
//           if(imageOrder.itemOrder[i].uri != pictureArray[i]){
//             axios.post(global.server + '/api/image/updatePictureArrayOrder',
//             {
//               params:{
//                 uri : imageOrder.itemOrder[i].uri,
//                 index : i,
//               }
//             })
//             .then(res => {
//               console.log(res.data);
//             })
//             .catch(err => {
//               console.log(err);
//             })
//           }
//         }
//         setPictureArray(tempPictureArray);
//         imageOrderSaved = true;
//       }
     
//       updateImageOrder();

//       // while(true) {
//       //   console.log("ran")
//       //   console.log(profileInfoSaved, profilePictureSaved, imageOrderSaved)
//       //   if(profileInfoSaved && profilePictureSaved && imageOrderSaved) {
//       //     setIsSaving(false);
//       //     navigation.goBack();
//       //     break;
//       //   }
//       // }
//       console.log("test")
//     }

//     return (
//         <ScrollView contentContainerStyle={{flexGrow: 1}}
//                     keyboardShouldPersistTaps='handled'
//                     scrollEnabled={!dragging}
//               >
//                  <Image
//                     source={{ uri: image }}
//                     style={styles.avatar}
//                   />
//                  <Block flex middle center>
                   
//                     <Button 
//                       color="primary"  
//                       style={styles.saveButton}
//                       onPress = {pickImage}
//                       >
//                         <Text bold size={14} color={argonTheme.COLORS.WHITE}>
//                           PICK IMAGE
//                         </Text>
//                     </Button>

//                     <Block width={width * 0.7}>
//                       <Text>
//                         First Name
//                       </Text>
//                       <Input
//                         placeholder="First Name"
//                         onChangeText={value =>onChangeFirstName(value)}
//                       >
//                         {currentProfile?.first_name ? currentProfile.first_name : ""}

//                         </Input>
//                     </Block>

//                     <Block width={width * 0.7}>
//                       <Text>
//                         Last Name
//                       </Text>
//                       <Input
//                         placeholder="Last Name"
//                         onChangeText={value=>onChangeLastName(value)}
//                         >
//                         {currentProfile?.last_name ? currentProfile.last_name : ""}

//                         </Input>
//                     </Block>
//                  </Block>
//                     <SortableGrid
//                       style={styles.grid}
//                       blockTransitionDuration      = { 400 }
//                       activeBlockCenteringDuration = { 200 }
//                       itemsPerRow                  = { 3 }
//                       itemWidth = {100}
//                       itemHeight = {100}
//                       inactive ={inactive}
//                       dragActivationTreshold       = { 200 }
//                       onDragRelease                = { (itemOrder) => {
//                         console.log("Drag was released, the blocks are in the following order: ", itemOrder);
//                         setIsDragging(false);
//                         setImageOrder(itemOrder);
//                       }}
//                       onDragStart                  = { () => {
//                         console.log("Some block is being dragged now!")
//                         setIsDragging(true)
//                         }} >

//                       {
//                         pictureArray.map( (picture, index) =>

//                             <View style = {styles.block} 
//                             key={index} 
//                             uri = {picture}
//                             onTap={() => console.log("Item number:", index, "was tapped!") }>
//                               {
//                                 picture == "No picture available" &&
//                                 <Ionicons style={styles.plusIcon} name="md-add-circle-outline"></Ionicons>
//                               }

//                               {
//                                 picture != "No picture available" &&
//                                 <Image
//                                   source={{ uri: global.s3Endpoint+picture }}
//                                   style={styles.gridProfile}
//                                 />
//                               }
//                             </View>
                        
//                         )
//                       }
//                       </SortableGrid>
//                       <Ionicons style={styles.plusIcon} name="md-add-circle-outline"></Ionicons>


//                    <Block>
//                     <Block middle>
//                       {
//                         isSaving &&
//                         <ActivityIndicator size="small" color="#0000ff" />
//                       }
//                       <Button 
//                       color="primary"  
//                       style={styles.saveButton}
//                       onPress = {saveEditProfile}
//                       >
//                         <Text bold size={14} color={argonTheme.COLORS.WHITE}>
//                           SAVE
//                         </Text>
//                       </Button>
//                     </Block>
//               </Block>

//               </ScrollView>


//     );
  
// }



// const styles = StyleSheet.create({
//   wrapper:{
//     paddingTop:100,
//     width:'100%',
//     height:'100%',
//     justifyContent:'center',
//   },
//   block: {
//     flex: 1,
//     marginTop: 8,
//     marginBottom: 8,
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//     backgroundColor: "#C0C0C0",
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative'
//     // flexDirection: 'row'
//   },
//   plusIcon:{
//     fontSize:40,
//   },
//   gridProfile:{
//     width: '100%',
//     height: '100%',
//     borderRadius: 8
//   },
//   // item:{
//   //   width:100,
//   //   height:100,
//   //   borderRadius:8,
//   //   backgroundColor:'black',
//   //   justifyContent:'center',
//   //   alignItems:'center',
//   // },
//   // item_text:{
//   //   fontSize:40,
//   //   color:'#FFFFFF',
//   // },
//   inputStyle :{
//     borderRadius: 4,
//     backgroundColor: '#FFFFFF',
//     width: 0.8*width,
//     height: 50,
//     marginTop: 50
//   },

//   registerContainer: {
//     width: width ,
//     height: height * 0.78,
//     backgroundColor: "#F4F5F7",
//     borderRadius: 4,
//     shadowColor: argonTheme.COLORS.BLACK,
//     shadowOffset: {
//       width: 0,
//       height: 4
//     },
//     shadowRadius: 8,
//     shadowOpacity: 0.1,
//     elevation: 1,
//     // overflow: "hidden",
//     padding: 30,
//     paddingTop: 0,
//     marginTop:-20
//   },

//   saveButton: {
//     width: width * 0.3,
//     marginTop: 25
//   },
//   avatar: {
//     width: width,
//     height: 350,
//     // borderRadius: 62,
//     borderWidth: 0
//   },
// });

// export default EditProfile;

