import { View, Text, Image, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { LMImageProps } from "./types";
import { MEDIA_FETCH_ERROR } from "../../../constants/Strings";
import LMLoader from "../../LMLoader";
import { LMButton } from "../../../uiComponents";
import { defaultStyles } from "./styles";
import Layout from "../../../constants/Layout"

const LMImage = React.memo(
  ({
    imageUrl,
    width,
    height,
    imageStyle,
    boxFit,
    boxStyle,
    aspectRatio,
    loaderWidget,
    errorWidget,
    showCancel,
    onCancel,
    cancelButton,
  }: LMImageProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [heightCalculated, setHeightCalculated] = useState(height ?? 400);
    const [desiredAspectRatio, setDesiredAspectRatio] = useState(0);

    useLayoutEffect(() => {
      if (!height || !width) {

        Image.getSize(
          imageUrl,
          (width, height) => {
            const screenWidth = Layout.window.width;
            const desiredAspectRatio = width > height ? 1.91 : 0.8;
            const heightCalculated = screenWidth * (1 / desiredAspectRatio);

            setHeightCalculated(heightCalculated);
            setDesiredAspectRatio(desiredAspectRatio);
          },
          (error) => {
            console.error('Failed to get image size:', error);
          }
        );

        return;
      } else {
        const screenWidth = Layout.window.width
        const desiredAspectRatio = width > height ? 1.91 : 0.8;
        const heightCalculated = screenWidth * (1 / desiredAspectRatio);

        setHeightCalculated(heightCalculated);
        setDesiredAspectRatio(desiredAspectRatio);
      }


    }, [imageUrl]);

    return (
      <View
        style={StyleSheet.flatten([defaultStyles.imageContainer, boxStyle, {minHeight: heightCalculated}])}
      >
        {/* this renders the loader until the image renders */}
        <View style={[defaultStyles.loaderView, imageStyle]}>
          {loaderWidget ? loaderWidget : loading && <LMLoader />}
        </View>
        {/* this renders the image */}
        <Image
          source={{ uri: imageUrl }}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          defaultSource={require("../../../assets/images/black_background.png")}
          style={StyleSheet.flatten([
            imageStyle,
            {
              height: heightCalculated,
              aspectRatio: desiredAspectRatio,
              resizeMode: boxFit ? boxFit : "contain"
            }
          ])}
        />
        {/* this renders the cancel button */}
        {showCancel && (
          <View style={defaultStyles.cancelButtonView}>
            {cancelButton ? (
              <LMButton
                {...cancelButton}
                onTap={
                  onCancel
                    ? () => {
                      onCancel(imageUrl);
                      cancelButton?.onTap();
                    }
                    : () => null
                }
              />
            ) : (
              <LMButton
                onTap={onCancel ? () => onCancel(imageUrl) : () => null}
                buttonStyle={defaultStyles.cancelButton}
                icon={{
                  assetPath: require("../../../assets/images/crossCircle_icon3x.png"),
                  height: 22,
                  width: 22,
                }}
              />
            )}
          </View>
        )}
        {/* this renders the error whenever the media is not fetched */}
        {error ? (
          <View
            style={StyleSheet.flatten([
              defaultStyles.imageStyle,
              defaultStyles.errorView,
              imageStyle,
            ])}
          >
            {errorWidget ? (
              errorWidget
            ) : (
              <Text style={defaultStyles.errorText}>{MEDIA_FETCH_ERROR}</Text>
            )}
          </View>
        ) : null}
      </View>
    );
  }
);

export default LMImage;
