let videoThumbnail;
let expo = false;
let cli = false;

try {
    let module;
    module = require("expo-video-thumbnails");
    if (module) {
        videoThumbnail = module;
        expo = true;
        cli = false;
    }
} catch (e) {
    cli = true;
}

try {
    let module;
    module = require("react-native-create-thumbnail");
    if (module) {
        videoThumbnail = module;
        expo = false;
        cli = true;
    }
} catch (e) {
    expo = true;
    cli = false;
}

export default function CreateThumbnail(videoUri: string, timestamp: number) {
    try {
        if (cli) {
            return videoThumbnail.createThumbnail({ url: videoUri, timeStamp: 10000 });
        } else if (expo) {
            return videoThumbnail.getThumbnailAsync(videoUri, { time: 10000 });
        } else {
            throw new Error("Video Thumbnail library not found.")
        }
    } catch (error) {

    }
}

export {expo, cli}