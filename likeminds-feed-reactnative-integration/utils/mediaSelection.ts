import ImagePicker, {expo, cli} from "../optionalDependencies/RNImagePicker"
import RNDocumentPicker, {expo as expoDocument, cli as cliDocument} from "../optionalDependencies/RNDocumentPicker" 

//select Images and videoes From Gallery
export const selectImageVideo = async (type: string, limit: number = 0) => {
  const options = {
    mediaType: type,
    selectionLimit: limit ?? 0,
  };
  if (cli) {
    return await ImagePicker?.launchImageLibrary(options as any, async (response: any) => {
      if (response?.didCancel) {
        // process cancel
      }
      const selectedImages = response?.assets; // selectedImages can be anything images or videos or both

      if (selectedImages) {
        return;
      }
    });

  } else if (expo) {
    const result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: type === 'photo'
        ? ["images"]
        : type === 'video'
          ? ["videos"]
          : ["images", "videos"],
      allowsMultipleSelection: limit !== 1,
      quality: 1,
    });

    if (!result.canceled) {
      return result;
    }
    return null;
  } else {
    throw new Error('No image picker library found. Please install one.');
  }
};

//select Documents From Gallery
export const selectDocument = async () => {
  try {
    if (cliDocument) {
      const response = await RNDocumentPicker.pick({
        type: [RNDocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      const selectedDocs: any = response; // selectedImages can be anything images or videos or both
      const docsArrlength = selectedDocs?.length;
      if (docsArrlength > 0) {
        if (selectedDocs) {
          return selectedDocs;
        }
      }
    } else if (expoDocument) {
      const result = await RNDocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result?.assets && result.assets.length > 0) {
        return result.assets;
      }

      return null;
    } else {
      throw new Error('No document picker library found. Please install one.');
    }
  } catch (error) {
    // process error
  }
};
