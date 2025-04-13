let RNnotifee

try {
  RNnotifee = require('@notifee/react-native');
} catch (error) {
  // Module not found, keep undefined
}

export default RNnotifee;