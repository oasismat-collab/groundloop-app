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
    // App privacy manifest (the config form of the App Store privacy labels):
    // location is read only at check-in, photos are user-initiated, and we do
    // NOT track users across apps (no NSPrivacyTracking). See store/ for the
    // console answers these mirror.
    privacyManifests: {
      NSPrivacyTracking: false,
      NSPrivacyTrackingDomains: [],
      NSPrivacyCollectedDataTypes: [
        {
          // Precise location, used only to verify a drop-off at check-in.
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePreciseLocation',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
        },
        {
          // Proof photos, taken by the user when they log a drop-off.
          NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhotosorVideos',
          NSPrivacyCollectedDataTypeLinked: true,
          NSPrivacyCollectedDataTypeTracking: false,
          NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
        },
      ],
      NSPrivacyAccessedAPITypes: [
        {
          // AsyncStorage (UserDefaults-backed) for session and local settings.
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
        {
          // File timestamps used by React Native / Expo internals.
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
          NSPrivacyAccessedAPITypeReasons: ['C617.1'],
        },
      ],
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
