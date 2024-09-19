import { View, Text } from "react-native";
import React from "react";
import { LMPostContextValues, useLMPostContext } from "../../../context";
import { LMProfilePicture } from "../../../uiComponents";
import { nameInitials, timeStamp } from "../../../utils";
import STYLES from "../../../constants/Styles";

const LMPostTopResponse = () => {
  const { post }: LMPostContextValues = useLMPostContext();
  return (
    <>
      {Object.keys(post?.filteredComments).length > 0 ? (
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontWeight: "600",
              paddingVertical: 10,
            }}
          >
            {"Top Response"}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <LMProfilePicture
              fallbackText={{
                children: nameInitials(post?.user?.name)
              }}
              imageUrl={post?.user?.imageUrl}
              size={40}
            />
            <View
              style={{
                padding: 10,
                backgroundColor: STYLES.$IS_DARK_THEME ? "#121212" : "#D0D8E2",
                borderRadius: 10,
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                  fontWeight: "600",
                }}
              >
                {post?.user?.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "grey",
                  fontWeight: "400",
                  marginBottom: 5,
                }}
              >
                {timeStamp(Number(post?.createdAt)) === undefined
                  ? "now"
                  : `${timeStamp(Number(post?.createdAt))}`}
              </Text>
              <View>
                <Text>{post?.filteredComments?.text}</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default LMPostTopResponse;
