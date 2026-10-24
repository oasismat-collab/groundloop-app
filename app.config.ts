import type { ExpoConfig } from 'expo/config';

const env = process.env;

const config: ExpoConfig = {
  name: 'GroundLoop',
  slug: 'groundloop',
  scheme: 'groundloop',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: env.IOS_BUNDLE_ID ?? 'com.example.groundloop',
    usesAppleSignIn: true,
    googleServicesFile: './GoogleService-Info.plist',
    infoPlist: {
      NSCameraUsageDescription: 'Take a photo of your food scraps going in, as proof of your drop-off.',
      NSLocationWhenInUseUsageDescription: 'Check you are at the drop-off site when you log a drop-off. GroundLoop never tracks you in the background.',
    },
  },
  android: {
    package: env.ANDROID_PACKAGE ?? 'com.example.groundloop',
    googleServicesFile: './google-services.json',
    permissions: ['CAMERA', 'ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
    config: { googleMaps: { apiKey: env.GOOGLE_MAPS_ANDROID_KEY ?? '' } },
  },
  plugins: [
    'expo-router',
    'expo-apple-authentication',
    ['@react-native-google-signin/google-signin', { iosUrlScheme: env.GOOGLE_IOS_URL_SCHEME ?? 'com.googleusercontent.apps.CHANGE_ME' }],
    ['expo-image-picker', { cameraPermission: 'Take a photo of your food scraps going in, as proof of your drop-off.' }],
    ['expo-location', { locationWhenInUsePermission: 'Check you are at the drop-off site when you log a drop-off.' }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    firebase: {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      appId: env.FIREBASE_APP_ID,
    },
    googleWebClientId: env.GOOGLE_WEB_CLIENT_ID,
    googleIosClientId: env.GOOGLE_IOS_CLIENT_ID,
    eas: { projectId: env.EAS_PROJECT_ID },
  },
};

export default config;
