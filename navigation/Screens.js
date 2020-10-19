import React from "react";
import { Easing, Animated, Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Login from "../screens/Login";
import Elements from "../screens/Elements";
import Articles from "../screens/Articles";
import EditProfile from "../screens/EditProfile";
import ChatList from "../screens/Chat/ChatList";
import ChatScreen from "../screens/Chat/ChatScreen";
import ViewProfile from "../screens/ViewProfile";
import Matching from "../screens/Matching";
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Icon, Header } from "../components";
import { argonTheme, tabs } from "../constants";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function ElementsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Elements"
        component={Elements}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Elements" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      
    </Stack.Navigator>
  );
}



function ArticlesStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Articles" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
        <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}


function ProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Profile"
        component={Profile}
        
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Profile" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfile} 
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Edit Profile"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />

    </Stack.Navigator>
  );
}


function ViewProfileStack(props) {
  return (
    <Stack.Navigator initialRouteName="View Profile" mode="card" headerMode="none">
      <Stack.Screen
        name="View Profile"
        component={ViewProfile}
        
        options={{
          header: ({ navigation, scene }) => (
            <Header title="View Profile" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  );
}
function ChatListStack(props) {
  return(
    <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
      <Stack.Screen
        name="Messages"
        component={ChatList}
        
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Messages" navigation={navigation} scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Chat" navigation={navigation} back scene={scene} />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
    </Stack.Navigator>
  )
}

function LoginStack(props) {
  return(
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="LogIn"
        component={Login}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
        ></Stack.Screen>
    </Stack.Navigator>
  )
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Home"
              search
              options
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" }
        }}
      />
      <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true,
          topBar: {
            backButton: {}
          },
        }}
      />
      <Stack.Screen name="AppStack" component={AppStack} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Login" component={LoginStack} />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
    style={{ flex: 1 }}
    drawerContent={props => <CustomDrawerContent {...props} />}
    drawerStyle={{
      backgroundColor: "white",
      width: width * 0.8
    }}
    drawerContentOptions={{
      activeTintcolor: "white",
      inactiveTintColor: "#000",
      activeBackgroundColor: "transparent",
      itemStyle: {
        width: width * 0.75,
        backgroundColor: "transparent",
        paddingVertical: 16,
        paddingHorizonal: 12,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        overflow: "hidden"
      },
      labelStyle: {
        fontSize: 18,
        marginLeft: 12,
        fontWeight: "normal"
      }
    }}
    initialRouteName="Home"
  >
    <Drawer.Screen name="Home" component={HomeStack} />
    <Drawer.Screen name="Profile" component={ProfileStack} />
    <Drawer.Screen name="Account" component={Register} />
    <Drawer.Screen name="Elements" component={ElementsStack} />
    <Drawer.Screen name="Articles" component={ArticlesStack} />
    <Stack.Screen name="Messages" component={ChatListStack} />
    <Drawer.Screen name="Onboarding" component={OnboardingStack} />
    <Drawer.Screen name="View Profile" component={ViewProfileStack} />
    <Drawer.Screen name="Matching" component={Matching} />
  </Drawer.Navigator>
  );
}

