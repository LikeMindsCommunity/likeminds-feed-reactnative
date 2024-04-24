import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import LMIcon from "../LMIcon";
import { LMButtonProps } from "./types";
import LMText from "../LMText";
import { defaultStyles } from "./styles";

const LMButton = React.memo(
  ({
    text,
    icon,
    onTap,
    placement,
    isActive,
    activeIcon,
    activeText,
    buttonStyle,
    isClickable = true,
  }: LMButtonProps) => {
    const [active, setActive] = useState(isActive);

    // this function handles the active state of the button
    const activeStateHandler = () => {
      if (isActive !== undefined) {
        setActive(!active);
      }
    };
    return (
      <TouchableOpacity
        disabled={!isClickable}
        hitSlop={{ top: 10, bottom: 10 }}
        style={StyleSheet.flatten([defaultStyles.buttonViewStyle, buttonStyle])}
        activeOpacity={0.8}
        onPress={(event) => {
          onTap(event);
          activeStateHandler();
        }}
      >
        {/* button view */}
        <View
          style={StyleSheet.flatten([
            {
              flexDirection: placement === "end" ? "row-reverse" : "row",
              alignItems: "center",
            },
          ])}
        >
          {/* icon view */}
          {icon ? (
            active ? (
              activeIcon ? (
                // this renders the icon in active state
                <LMIcon
                  width={activeIcon.width}
                  height={activeIcon.height}
                  iconUrl={activeIcon.iconUrl}
                  assetPath={activeIcon.assetPath}
                  color={activeIcon.color}
                  iconStyle={activeIcon.iconStyle}
                  boxFit={activeIcon.boxFit}
                  boxStyle={activeIcon.boxStyle}
                />
              ) : null
            ) : (
              // this renders the icon in inactive state
              <LMIcon
                width={icon.width}
                height={icon.height}
                iconUrl={icon.iconUrl}
                assetPath={icon.assetPath}
                color={icon.color}
                iconStyle={icon.iconStyle}
                boxFit={icon.boxFit}
                boxStyle={icon.boxStyle}
              />
            )
          ) : null}
          {/* text view */}
          {text ? (
            active ? (
              activeText ? (
                // this renders the text for active state
                <LMText
                  textStyle={StyleSheet.flatten([
                    defaultStyles.buttonTextStyle,
                    activeText.textStyle,
                  ])}
                  maxLines={activeText.maxLines}
                  selectable={activeText.selectable}
                >
                  {activeText.children}
                </LMText>
              ) : null
            ) : (
              // this renders the text in inactive state
              <LMText
                textStyle={StyleSheet.flatten([
                  defaultStyles.buttonTextStyle,
                  text.textStyle,
                ])}
                maxLines={text.maxLines}
                selectable={text.selectable}
              >
                {text.children}
              </LMText>
            )
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
);

export default LMButton;
