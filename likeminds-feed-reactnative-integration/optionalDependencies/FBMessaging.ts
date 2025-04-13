let FBMessaging;

try {
    FBMessaging = require("@react-native-firebase/messaging")?.default
} catch (error) {
    // do nothing
}

export default FBMessaging