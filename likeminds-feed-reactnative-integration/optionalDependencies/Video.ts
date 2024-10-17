let RNVideo;

try {
  RNVideo = require("react-native-video");
} catch (err) {
  console.log("react-native-video is not installed");
}

export default RNVideo.default;
