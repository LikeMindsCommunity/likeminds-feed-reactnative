let ImagePicker;
let expo = false;
let cli = false;

try {
    let module;
    module = require('expo-image-picker');
    if (module) {
        ImagePicker = module;
        expo = true;
        cli = false;
    }
} catch (e) {
    cli = true;
}

try {
    let module;
    module = require('react-native-image-picker');
    if (module) {
        ImagePicker = module;
        expo = false;
        cli = true;
    }
} catch (e) {
    cli = false;
    expo = true;
}


if (!ImagePicker) {
    console.log(
        'react-native-image-picker is not installed. Installing this package will enable selecting photos through the native image picker, and thereby send it.',
    );
}

export { expo, cli }
export default ImagePicker