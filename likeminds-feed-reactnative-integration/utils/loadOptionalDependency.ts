const availableLibraries: any = {};
try {
  availableLibraries['expo-image-picker'] = require('expo-image-picker')
  availableLibraries['expo-document-picker'] = require('expo-document-picker')
  availableLibraries['expo-device'] = require('expo-device')
  availableLibraries['expo-video-thumbnails'] = require('expo-video-thumbnails')

  availableLibraries['react-native-device-info'] = require('react-native-device-info')
  availableLibraries['react-native-create-thumbnail'] = require('react-native-create-thumbnail')
  availableLibraries['react-native-document-picker'] = require('expo-document-picker')
  availableLibraries['react-native-image-picker'] = require('react-native-image-picker')
} catch (error) {
  console.warn(`${error} occured while accessing library, make sure to install appropriate library based on CLI or Expo enviroment`)
}

export function loadOptionalModule<T = any>(moduleName: string, fallback?: T): T | undefined {
    try {
      const mod = availableLibraries[moduleName]
      return mod?.default || mod;
    } catch (err) {
      return fallback;
    }
  }
  