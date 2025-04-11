let DocumentPicker;
let expo = false

try {
    let module;

    module = require("expo-document-picker");
    if (module) {
        DocumentPicker = module;
        expo = true;
    }
} catch (e) {
    // do nothing
}

try {
    let module;

    module = require("react-native-document-picker");
    if (module) {
        DocumentPicker = module;
        expo = false;
    }
} catch (e) {
    // do nothing
    expo = false;
}

if (!DocumentPicker) {
    console.log(
        'react-native-document-picker is not installed. Install this library if you want to enable file picker support.',
    );
}

export {expo}
export default DocumentPicker;