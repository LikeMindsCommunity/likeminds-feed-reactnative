let ImagePicker;
let expo = false;

try {
    let module;
    module = require('expo-image-picker');
    if (module) {
        ImagePicker = module;
        expo = true;
    }
} catch (e) {
    // do nothing
}

try {
    let module;
    module = require('react-native-image-picker');
    if (module) {
        ImagePicker = module;
        expo = false;
    }
} catch (e) {
    // do nothing
    expo = false;
}


if (!ImagePicker) {
    console.log(
        'react-native-image-picker is not installed. Installing this package will enable selecting photos through the native image picker, and thereby send it.',
    );
}

export { expo }
export default ImagePicker