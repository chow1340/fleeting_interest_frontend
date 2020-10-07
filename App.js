import React, {useState} from "react";
import './config.js'
import { Image } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";

import { Provider } from "react-redux";
import store from './redux/store';

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

//export default props => {
//  const [isLoadingComplete, setLoading] = useState(false);
//  let [fontsLoaded] = useFonts({
//    'ArgonExtra': require('./assets/font/argon.ttf'),
//  });
//
//  function _loadResourcesAsync() {
//    return Promise.all([...cacheImages(assetImages)]);
//  }
//
//  function _handleLoadingError(error) {
//    // In this case, you might want to report the error to your error
//    // reporting service, for example Sentry
//    console.warn(error);
//  };
//
// function _handleFinishLoading() {
//    setLoading(true);
//  };
//
//  if(!fontsLoaded && !isLoadingComplete) {
//    return (
//      <AppLoading
//        startAsync={_loadResourcesAsync}
//        onError={_handleLoadingError}
//        onFinish={_handleFinishLoading}
//      />
//    );
//  } else if(fontsLoaded) {
//    return (
//      <NavigationContainer>
//        <GalioProvider theme={argonTheme}>
//          <Block flex>
//            <Screens />
//          </Block>
//        </GalioProvider>
//      </NavigationContainer>
//    );
//  }
//}

const App = () => {

   const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    _loadResourcesAsync = async () => {
      return Promise.all([...cacheImages(assetImages)]);
    };


    _handleLoadingError = error => {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(error);
    };

    _handleFinishLoading = () => {
      setIsLoadingComplete(true);
    };
     if (!isLoadingComplete) {
       return (
         <AppLoading
           startAsync={_loadResourcesAsync}
           onError={_handleLoadingError}
           onFinish={_handleFinishLoading}
         />
       );
     } else {
       return (
         <Provider store={store}>
          <NavigationContainer>
            <GalioProvider theme={argonTheme}>
              <Block flex>
                <Screens />
              </Block>
            </GalioProvider>
          </NavigationContainer>
         </Provider>
       );
     }
   }



export default App