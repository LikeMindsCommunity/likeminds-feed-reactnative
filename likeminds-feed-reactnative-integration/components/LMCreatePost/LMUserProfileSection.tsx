import { View, Text } from "react-native";
import React from "react";
import { nameInitials } from "../../utils";
import { LMProfilePicture, LMText } from "../../uiComponents";
import STYLES from "../../constants/Styles";
import { styles } from "../../screens/createPost/styles";
import { CreatePostContextValues, useCreatePostContext } from "../../context";

const LMUserProfileSection = () => {
  const postListStyle = STYLES.$POST_LIST_STYLE;
  const createPostStyle = STYLES.$CREATE_POST_STYLE;
  const postHeaderStyle = postListStyle?.header;
  let { memberData }: CreatePostContextValues = useCreatePostContext();
  return (
    <View style={styles.profileContainer}>
      {/* profile image */}
      <LMProfilePicture
        {...postHeaderStyle?.profilePicture}
        fallbackText={{
          children: (
            <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
              {nameInitials(memberData.name)}
            </Text>
          ),
        }}
        imageUrl={memberData.imageUrl}
      />
      {/* user name */}
      <LMText
        children={
          <Text style={{ fontFamily: STYLES.$FONT_TYPES.MEDIUM }}>
            {memberData.name}
          </Text>
        }
        textStyle={
          createPostStyle?.userNameTextStyle
            ? createPostStyle?.userNameTextStyle
            : styles.userNameText
        }
      />
    </View>
  );
};

export default LMUserProfileSection;
