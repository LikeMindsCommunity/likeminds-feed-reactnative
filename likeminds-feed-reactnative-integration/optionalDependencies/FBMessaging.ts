let FBMessaging;

try {
    FBMessaging = require("@react-native-firebase/messaging")
} catch (error) {
    // do nothing
}

export default FBMessaging