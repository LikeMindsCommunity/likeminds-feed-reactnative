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
import LMHeader from "../../components/LMHeader";
import { LMProfilePicture, LMText } from "../../uiComponents";
import { nameInitials } from "../../utils";
import { CreatePostContextValues, useCreatePostContext } from "../../context";
import { useLMFeedStyles } from "../../lmFeedProvider";
import Layout from "../../constants/Layout";
import {
  CreatePollCustomisableMethodsContextProvider,
  useCreatePollCustomisableMethodsContext,
} from "../../context/createPollCallbacksContext";
import { CreatePollContextProps } from "../../components/LMPoll/models/CreatePoll";
import { useRoute, useNavigation } from "@react-navigation/native";
import STYLES from "../../constants/Styles";

const CreatePollScreen = ({
  navigation,
  route,
  onPollExpiryTimeClicked,
  onAddOptionClicked,
  onPollOptionCleared,
  onPollCompleteClicked,
}: CreatePollContextProps) => {
  return (
    <CreatePollCustomisableMethodsContextProvider
      onPollExpiryTimeClicked={onPollExpiryTimeClicked}
      onAddOptionClicked={onAddOptionClicked}
      onPollOptionCleared={onPollOptionCleared}
      onPollCompleteClicked={onPollCompleteClicked}
    >
      <CreatePollScreenComponent />
    </CreatePollCustomisableMethodsContextProvider>
  );
};

const CreatePollScreenComponent = () => {
  const { postPoll }: CreatePollProps = useCreatePollContext();
  const route = useRoute();
  const navigation = useNavigation<any>();

  const { memberData }: any = route?.params;
  const LMFeedContextStyles = useLMFeedStyles();
  const { postListStyle }: any = LMFeedContextStyles;
  const postHeaderStyle = postListStyle?.header;

  const { onPollCompleteClicked } = useCreatePollCustomisableMethodsContext();

  return (
    <SafeAreaView
      style={{
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
        flex: 1,
      }}
    >
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
            onPress={!!onPollCompleteClicked ? onPollCompleteClicked : postPoll}
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
