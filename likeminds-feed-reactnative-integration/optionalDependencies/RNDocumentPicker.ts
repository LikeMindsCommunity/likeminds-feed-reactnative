let DocumentPicker;
let expo = false
let cli = false

try {
    let module;

    module = require("expo-document-picker");
    if (module) {
        DocumentPicker = module;
        expo = true;
        cli = false;
    }
} catch (e) {
    cli = true;
}

try {
    let module;

    module = require("react-native-document-picker");
    if (module) {
        DocumentPicker = module;
        expo = false;
        cli = true;
    }
} catch (e) {
    expo = true;
    cli = false;
}

if (!DocumentPicker) {
    console.log(
        'react-native-document-picker is not installed. Install this library if you want to enable file picker support.',
    );
}

export {expo, cli}
export default DocumentPicker;