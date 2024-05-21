import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { styles } from "../../components/LMPoll/styles";
import CreatePollUI from "../../components/LMPoll/CreatePollUI";
import { CreatePoll, CreatePollProps } from "../../components/LMPoll/models";
import {
  CreatePollContextProvider,
  useCreatePollContext,
} from "../../context/createPollContextProvider";
import { LMHeader } from "../../components";
import { LMProfilePicture, LMText } from "../../uiComponents";
import { nameInitials } from "../../utils";
import { CreatePostContextValues, useCreatePostContext } from "../../context";
import { useLMFeedStyles } from "../../lmFeedProvider";
import Layout from "../../constants/Layout";

const CreatePollScreen = ({ navigation, route }: CreatePoll) => {
  return (
    <CreatePollContextProvider navigation={navigation} route={route}>
      <CreatePollScreenComponent navigation={navigation} route={route} />
    </CreatePollContextProvider>
  );
};

const CreatePollScreenComponent = ({ navigation, route }: CreatePoll) => {
  const { postPoll }: CreatePollProps = useCreatePollContext();
  const { memberData }: any = route.params;
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle }: any = LMFeedContextStyles;
  const postHeaderStyle = postListStyle?.header;

  return (
    <SafeAreaView>
      {/* Screen Header */}
      <LMHeader
        showBackArrow={true}
        onBackPress={() => {
          navigation.goBack();
        }}
        heading={"New Poll"}
        rightComponent={
          // post button section
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={postPoll}
          >
            {<Text style={styles.headerRightComponentText}>{"DONE"}</Text>}
          </TouchableOpacity>
        }
      />

      <ScrollView
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ paddingBottom: Layout.normalize(100) }}
        bounces={false}
      >
        {/* user profile section */}
        <View style={styles.profileContainer}>
          {/* profile image */}
          <LMProfilePicture
            {...postHeaderStyle?.profilePicture}
            fallbackText={{
              children: <Text>{nameInitials(memberData.name)}</Text>,
            }}
            imageUrl={memberData.imageUrl}
          />
          {/* user name */}
          <LMText
            children={<Text>{memberData.name}</Text>}
            textStyle={styles.userNameText}
          />
        </View>

        {/* Poll UI */}
        <CreatePollUI />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePollScreen;
