import { View, Text } from "react-native";
import React from "react";
import { LMPostContextValues, useLMPostContext } from "../../../context";

const LMPostHeading = () => {
  const { post }: LMPostContextValues = useLMPostContext();
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 15 }}>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{post?.heading}</Text>
    </View>
  );
};

export default LMPostHeading;
