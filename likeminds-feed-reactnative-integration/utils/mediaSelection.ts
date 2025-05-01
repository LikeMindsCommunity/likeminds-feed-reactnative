import RNDocumentPicker from "../optionalDependencies/RNDocumentPicker";
import RNDocumentPickerLegacy from "../optionalDependencies/RNDocumentPickerLegacy";
import expoDocumentPicker from "../optionalDependencies/ExpoDocumentPicker";

import RNImagePicker from "../optionalDependencies/RNImagePicker";
import expoImagePicker from "../optionalDependencies/ExpoImagePicker";

import RNFileViewer from "../optionalDependencies/RNFileViewer";
import RNDocumentViewer from "../optionalDependencies/RNDocumentViewer";

//select Images and videoes From Gallery
export const selectImageVideo = async (type: string, limit: number = 0) => {
  const options = {
    mediaType: type,
    selectionLimit: limit ?? 0,
  };
  if (RNImagePicker) {
    return await RNImagePicker?.launchImageLibrary(options as any, async (response: any) => {
      if (response?.didCancel) {
        // process cancel
      }
      const selectedImages = response?.assets; // selectedImages can be anything images or videos or both

      if (selectedImages) {
        return;
      }
    });

  } else if (expoImagePicker) {
    const result = await expoImagePicker?.launchImageLibraryAsync({
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
    if (RNDocumentPicker) {
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
    } else if (expoDocumentPicker) {
      const result = await expoDocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result?.assets && result.assets.length > 0) {
        return result.assets;
      }

      return null;
    } else if (RNDocumentPickerLegacy) {
      const response = await RNDocumentPickerLegacy.pick({
        type: [RNDocumentPickerLegacy.types.pdf],
        allowMultiSelection: true,
      });
      const selectedDocs: any = response; // selectedImages can be anything images or videos or both
      const docsArrlength = selectedDocs?.length;
      if (docsArrlength > 0) {
        if (selectedDocs) {
          return selectedDocs;
        }
      }
    } else {
      throw new Error('No document picker library found. Please install one.');
    }
  } catch (error) {
    // process error
  }
};

export const viewDocument = async (uri: string) => {
  try {
    if (RNFileViewer) {
      RNFileViewer.open(uri)
    } else if (RNDocumentViewer) {
      RNDocumentViewer.viewDocument({
        uri,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
