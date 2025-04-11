let videoThumbnail;
let expo = false;

try {
    let module;
    module = require("expo-video-thumbnails");
    if (module) {
        videoThumbnail = module;
        expo = true;
    }
} catch (e) {
    console.log("error ahaya 14", e)
    // do nothing
}

try {
    let module;
    module = require("react-native-create-thumbnail");
    if (module) {
        videoThumbnail = module;
        expo = false;
    }
} catch (e) {
    expo = false;
    // do nothing
}

export default function CreateThumbnail(videoUri: string, timestamp: number) {
    try {
        if (!expo) {
            return videoThumbnail.createThumbnail({ url: videoUri, timeStamp: 10000 });
        } else if (expo) {
            return videoThumbnail.getThumbnailAsync(videoUri, { time: 10000 });
        } else {
            throw new Error("Video Thumbnail library not found.")
        }
    } catch (error) {

    }
}

export {expo}