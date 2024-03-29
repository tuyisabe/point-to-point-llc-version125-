import React, { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppContainer from './src/navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LogBox
} from "react-native";
import { Provider } from "react-redux";
import {
  FirebaseProvider,
  store
} from 'common';
import AppCommon from './AppCommon';
import { FirebaseConfig } from './config/FirebaseConfig';
import { colors } from './src/common/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs([
      'Setting a timer',
      'SplashScreen.show'
    ])

    const ReactNative = require('react-native');
    try {
        ReactNative.I18nManager.allowRTL(false);
    } catch (e) {
        console.log(e);
    }

    onLoad();
  }, []);

  const _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/lodingDriver.gif')
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };

  const onLoad = async () => {
    if (__DEV__) {
      _loadResourcesAsync().then(() => setAssetsLoaded(true));
    } else {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
         _loadResourcesAsync().then(() => setAssetsLoaded(true));
      } catch (error) {
        _loadResourcesAsync().then(() => setAssetsLoaded(true));
      }
    }
  }

  if (!assetsLoaded) {
    return <View style={styles.container}>
      <ImageBackground
        source={require('./assets/images/intro.gif')}
        resizeMode="cover"
        style={styles.imagebg}
      >
        <ActivityIndicator style={{ paddingBottom: 100 }} color={colors.INDICATOR_BLUE} size='large' />
      </ImageBackground>
    </View>
  }

  return (
    <Provider store={store}>
      <FirebaseProvider config={FirebaseConfig} AsyncStorage={AsyncStorage}>
        <AppCommon>
          <AppContainer />
        </AppCommon>
      </FirebaseProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imagebg: {
    flex:1,
    justifyContent: "flex-end",
    alignItems: 'center'
  }
});