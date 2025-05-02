import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { LMImageProps } from "./types";
import { MEDIA_FETCH_ERROR } from "../../../constants/Strings";
import LMLoader from "../../LMLoader";
import { LMButton } from "../../../uiComponents";
import { defaultStyles } from "./styles";
import FastImage from "@d11/react-native-fast-image";

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
    const [heightCalculated, setHeightCalculated] = useState(400);
    const [desiredAspectRatio, setDesiredAspectRatio] = useState(0);

    useLayoutEffect(() => {
      if (!height && !width) {
        console.log("NO DIMENSIONS");
        Image.getSize(
          imageUrl,
          (width, height) => {
            console.log(`Image dimensions: ${width}x${height}`);
            const ScreenWidth = Dimensions.get("window").width;
            const desiredAspectRatio = width > height ? 1.91 : 0.8;
            const heightCalculated = ScreenWidth * (1 / desiredAspectRatio);
            console.log({
              heightCalculated,
              desiredAspectRatio
            })
            setHeightCalculated(heightCalculated);
            setDesiredAspectRatio(desiredAspectRatio);
          },
          (error) => {
            console.error('Failed to get image size:', error);
          }
        );
        return;
      } else {
        console.log({
          height,
          width
        })
  
        const ScreenWidth = Dimensions.get("window").width;
        const desiredAspectRatio = width > height ? 1.91 : 0.8;
        const heightCalculated = ScreenWidth * (1 / desiredAspectRatio);
        console.log({
          heightCalculated,
          desiredAspectRatio
        })
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
        <FastImage
          source={{ uri: imageUrl }}
          onLoad={() => setLoading(false)}
          onError={() => setError(true)}
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={require("../../../assets/images/black_background.png")}
          style={StyleSheet.flatten([
            imageStyle,
            {
              height: heightCalculated,
              aspectRatio: desiredAspectRatio,
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
