import { loadOptionalModule } from "../utils/loadOptionalDependency";

const RNCreateThumbnail = loadOptionalModule('react-native-create-thumbnail');
const ExpoCreateThumbnail = loadOptionalModule('expo-video-thumbnails');

export function CreateThumbnail(videoUri: string, timestamp: number) {
    try {
        if (RNCreateThumbnail) {
            return RNCreateThumbnail.createThumbnail({ url: videoUri, timeStamp: 10000 });
        } else if (ExpoCreateThumbnail) {
            return ExpoCreateThumbnail.getThumbnailAsync(videoUri, { time: 10000 });
        } else {
            throw new Error("Video Thumbnail library not found.")
        }
    } catch (error) {

    }
}