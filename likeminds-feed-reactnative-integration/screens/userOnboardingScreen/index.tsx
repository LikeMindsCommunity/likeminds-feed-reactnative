import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { LMHeader, LMImage, LMLoader } from "../../components";
import { useLMFeed } from "../../lmFeedProvider";
import { LMButton, LMIcon, LMInputText, LMText } from "../../uiComponents";
import {
  UserOnboardingCallbacksContextProvider,
  useUniversalFeedContext,
} from "../../context";
import { useAppDispatch } from "../../store/store";
import { useUserOnboardingContext } from "../../context/userOnboardingContext";
import { useUserOnboardingCallbacksContext } from "../../context/userOnboardingCallbacksContext";
import { Client } from "../../client";
import { UNIVERSAL_FEED } from "../../constants/screenNames";
import { navigationRef } from "../../navigation/RootNavigation";

interface userOnboardingCallbacksContextProps {
  onCTAButtonClickedProp?: () => void;
  onPickProfileImageClickedProp?: () => void;
  userNameMaxCharacterLimit?: number;
  createScreenTitle?: string;
  createScreenSubtitle?: string;
  createScreenCtaButtonText?: string;
  createScreenHeaderTitle?: string;
  editScreenTitle?: string;
  editScreenSubtitle?: string;
  editScreenCtaButtonText?: string;
  editScreenHeaderTitle?: string;
  addPicturePrompt?: string;
  maxPictureSizePrompt?: string;
  userNameInputBoxLabel?: string;
}

export default function UserOnboardingComponent({
  onCTAButtonClickedProp,
  onPickProfileImageClickedProp,
  userNameMaxCharacterLimit,
  createScreenTitle,
  createScreenSubtitle,
  createScreenCtaButtonText,
  createScreenHeaderTitle,
  editScreenCtaButtonText,
  editScreenSubtitle,
  editScreenTitle,
  editScreenHeaderTitle,
  addPicturePrompt,
  maxPictureSizePrompt,
  userNameInputBoxLabel,
}: userOnboardingCallbacksContextProps) {
  return (
    <UserOnboardingCallbacksContextProvider
      onCTAButtonClickedProp={onCTAButtonClickedProp}
      onPickProfileImageClickedProp={onPickProfileImageClickedProp}
      userNameMaxCharacterLimit={userNameMaxCharacterLimit}
      createScreenCtaButtonText={createScreenCtaButtonText}
      createScreenHeaderTitle={createScreenHeaderTitle}
      createScreenSubtitle={createScreenSubtitle}
      createScreenTitle={createScreenTitle}
      editScreenSubtitle={editScreenSubtitle}
      editScreenTitle={editScreenTitle}
      editScreenHeaderTitle={editScreenHeaderTitle}
      editScreenCtaButtonText={editScreenCtaButtonText}
      addPicturePrompt={addPicturePrompt}
      maxPictureSizePrompt={maxPictureSizePrompt}
      userNameInputBoxLabel={userNameInputBoxLabel}
    >
      <UserOnboardingScreen />
    </UserOnboardingCallbacksContextProvider>
  );
}

function UserOnboardingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const {
    onBoardUser,
    withAPIKeySecurity,
    isInitiated,
    isUserOnboardingRequired,
    callIsUserOnboardingDone,
    callInitiateAPI,
  } = useLMFeed();
  const {
    onCTAButtonClicked,
    onPickProfileImageClicked,
    name,
    setName,
    imageUrl,
    setImageUrl,
    profileImage,
    disableSubmitButton,
    setDisableSubmitButton,
    loading,
    memberData,
    isUserOnboardingDone,
    setIsUserOnboardingDone,
    setMemberData,
  } = useUserOnboardingContext();
  const {
    userNameMaxCharacterLimit,
    createScreenCtaButtonText,
    createScreenTitle,
    createScreenHeaderTitle,
    createScreenSubtitle,
    onCTAButtonClickedProp,
    onPickProfileImageClickedProp,
    editScreenCtaButtonText,
    editScreenSubtitle,
    editScreenTitle,
    editScreenHeaderTitle,
    addPicturePrompt,
    maxPictureSizePrompt,
    userNameInputBoxLabel,
  } = useUserOnboardingCallbacksContext();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useLayoutEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const ref = useRef<any>();

  useEffect(() => {
    if (isKeyboardVisible) {
      ref?.current?.scrollToEnd();
    }
  }, [isKeyboardVisible]);

  const onBoardingScreenStyles = STYLES.$USER_ONBOARDING_SCREEN_STYLES;
  const isEditing = useMemo(() => {
    if ((route.params as any)?.action == "EDIT_PROFILE") {
      return true;
    }
    return false;
  }, [withAPIKeySecurity, isInitiated]);

  useLayoutEffect(() => {
    (async () => {
      const response = await callIsUserOnboardingDone();
      setIsUserOnboardingDone(response);
    })();
  }, []);

  useLayoutEffect(() => {
    (async () => {
      if (isEditing) {
        const response = await Client.myClient?.getMemberState();
        setMemberData(response?.data);
        setName(response?.data?.member?.name);
        setImageUrl(response?.data?.member?.imageUrl);
      }
    })();
  }, [withAPIKeySecurity, isEditing]);

  useLayoutEffect(() => {
    (async () => {
      if (isUserOnboardingDone && !isInitiated) {
        const { accessToken, refreshToken } = await Client.myClient.getTokens();
        const isOnboarded = await callIsUserOnboardingDone();
        if (accessToken && refreshToken && isOnboarded) {
          // validate API will be call internally regardless
          callInitiateAPI(undefined, undefined, true);
        } else {
          setIsUserOnboardingDone(false);
        }
      }
    })();
  }, [isUserOnboardingDone, withAPIKeySecurity]);

  useEffect(() => {
    (async () => {
      if (isInitiated && !isEditing) {
        await Client.myClient?.setIsUserOnboardingDone(true);
        setTimeout(
          () => navigation.dispatch(StackActions.replace(UNIVERSAL_FEED)),
          0
        );
      }
    })()
  }, [isInitiated]);

  useEffect(() => {
    if (name.length < 3 || name.length > userNameMaxCharacterLimit) {
      setDisableSubmitButton(true);
    } else {
      setDisableSubmitButton(false);
    }
    if (!isEditing) {
    } else {
    }
  }, [name]);

  useLayoutEffect(() => {
    if (profileImage !== null || profileImage !== undefined) {
      setImageUrl(profileImage?.uri as string);
    }
  }, [profileImage]);

  useLayoutEffect(() => {
    if (
      isUserOnboardingRequired == false ||
      isUserOnboardingRequired == undefined
    ) {
      return;
    }
    navigation.setOptions({
      headerShown: isEditing ? true : !isUserOnboardingDone,
      animationEnabled: isEditing ? true : !isUserOnboardingDone,
      header: () => (
        <SafeAreaView
          style={{
            backgroundColor: STYLES.$IS_DARK_THEME
              ? STYLES.$BACKGROUND_COLORS.DARK
              : STYLES.$BACKGROUND_COLORS.LIGHT,
          }}
        >
          <LMHeader
            heading={
              isEditing
                ? editScreenHeaderTitle
                  ? editScreenHeaderTitle
                  : "Profile"
                : createScreenHeaderTitle
                  ? createScreenHeaderTitle
                  : "Community"
            }
            showBackArrow={isEditing}
            rightComponent={
              <TouchableOpacity
                disabled={disableSubmitButton || loading}
                style={{ opacity: loading || disableSubmitButton ? 0.5 : 1 }}
                onPress={
                  !disableSubmitButton && !loading
                    ? onCTAButtonClickedProp
                      ? onCTAButtonClickedProp
                      : onCTAButtonClicked
                    : () => { }
                }
              >
                <>
                  {loading ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <LMLoader
                        color={STYLES.$COLORS.FONT_PRIMARY}
                        size={
                          Platform.OS == "ios"
                            ? STYLES.$LMLoaderSizeiOS
                            : STYLES.$LMLoaderSizeAndroid
                        }
                        style={{
                          top: Platform.OS == "ios" ? 2 : 0,
                        }}
                      />
                    </View>
                  ) : (
                    <LMText
                      textStyle={StyleSheet.flatten([
                        {
                          fontSize: 16,
                          color: STYLES.$COLORS.FONT_PRIMARY,
                          fontWeight: "bold",
                        },
                        disableSubmitButton
                          ? onBoardingScreenStyles.disableCtaButtonTextStyle
                          : onBoardingScreenStyles.ctaButtonTextStyle,
                      ])}
                    >
                      {isEditing
                        ? editScreenCtaButtonText
                          ? editScreenCtaButtonText
                          : "DONE"
                        : createScreenCtaButtonText
                          ? createScreenCtaButtonText
                          : "CONTINUE"}
                    </LMText>
                  )}
                </>
              </TouchableOpacity>
            }
            headingTextStyle={StyleSheet.flatten([
              {
                fontSize: 18,
                fontWeight: "300",
              },
              onBoardingScreenStyles.headerTitleTextStyle,
            ])}
            onBackPress={() => {
              navigation.goBack();
            }}
          />
        </SafeAreaView>
      ),
    });
  }, [
    isUserOnboardingDone,
    isInitiated,
    disableSubmitButton,
    loading,
    name,
    setName,
    profileImage,
    setImageUrl,
  ]);

  if (
    (isUserOnboardingRequired == false ||
      isUserOnboardingRequired == undefined ||
      isUserOnboardingRequired == null ||
      isUserOnboardingDone) &&
    !isEditing
  ) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: STYLES.$IS_DARK_THEME
            ? STYLES.$COLORS.BLACK
            : STYLES.$COLORS.WHITE,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LMLoader />
      </View>
    );
  }

  return (
    <ScrollView
      ref={ref}
      keyboardShouldPersistTaps={"always"}
      contentContainerStyle={{ flexGrow: 1 }}
      style={{
        flex: 1,
        backgroundColor: STYLES.$IS_DARK_THEME
          ? STYLES.$BACKGROUND_COLORS.DARK
          : STYLES.$BACKGROUND_COLORS.LIGHT,
      }}
    >
      <View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            gap: 8,
          }}
        >
          <LMText
            textStyle={StyleSheet.flatten([
              {
                fontSize: 20,
                fontWeight: "500",
                color: STYLES.$IS_DARK_THEME
                  ? STYLES.$COLORS.WHITE_TEXT_COLOR
                  : "#333333",
              },
              onBoardingScreenStyles.titleTextStyle,
            ])}
          >
            {isEditing
              ? editScreenTitle
                ? editScreenTitle
                : "Edit Profile"
              : createScreenTitle
                ? createScreenTitle
                : "Create Your Community Profile"}
          </LMText>
          <LMText
            textStyle={StyleSheet.flatten([
              {
                fontSize: 14,
                color: STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                textAlign: "center",
                marginHorizontal: Layout.normalize(10),
              },
              onBoardingScreenStyles.subtitleTextStyle,
            ])}
          >
            {isEditing
              ? editScreenSubtitle
                ? editScreenSubtitle
                : "Edit profile picture"
              : createScreenSubtitle
                ? createScreenSubtitle
                : "Set up your profile to join the community. Please provide your name and profile picture."}
          </LMText>
        </View>
        <View
          style={{
            height: 120,
            width: 120,
            marginTop: 14,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1.5,
            borderRadius: 100,
            borderColor: "#9b9b9b",
            alignSelf: "center",
            backgroundColor: imageUrl
              ? "black"
              : STYLES.$IS_DARK_THEME
                ? STYLES.$COLORS.BLACK
                : STYLES.$COLORS.WHITE,
          }}
        >
          {imageUrl?.length > 0 ? (
            <Image
              source={{ uri: imageUrl }}
              style={StyleSheet.flatten([
                {
                  width: Layout.normalize(120),
                  height: Layout.normalize(120),
                  borderRadius: 100,
                  resizeMode: "cover",
                },
                onBoardingScreenStyles?.userProfilePictureImageStyles,
              ])}
            />
          ) : (
            <LMIcon
              assetPath={require("../../assets/images/user_3x.png")}
              height={50}
              width={50}
            />
          )}
          <TouchableOpacity
            onPress={
              onPickProfileImageClickedProp
                ? onPickProfileImageClickedProp
                : onPickProfileImageClicked
            }
            style={StyleSheet.flatten([
              {
                position: "absolute",
                top: Layout.normalize(75),
                left: Layout.normalize(90),
                backgroundColor: STYLES.$COLORS.PRIMARY,
                padding: 6,
                borderRadius: 20,
                elevation: 3,
              },
              onBoardingScreenStyles?.pickImageButtonStyles,
            ])}
          >
            <LMIcon
              assetPath={
                onBoardingScreenStyles?.pickImageIconStyles?.assetPath
                  ? onBoardingScreenStyles?.pickImageIconStyles?.assetPath
                  : isEditing
                    ? require("../../assets/images/edit_profile3x.png")
                    : require("../../assets/images/camera_3x.png")
              }
              height={
                onBoardingScreenStyles?.pickImageIconStyles?.height
                  ? onBoardingScreenStyles?.pickImageIconStyles?.height
                  : Layout.normalize(15)
              }
              width={
                onBoardingScreenStyles?.pickImageIconStyles?.width
                  ? onBoardingScreenStyles?.pickImageIconStyles?.width
                  : Layout.normalize(15)
              }
              color={
                onBoardingScreenStyles.pickImageIconStyles?.color ?? "white"
              }
              iconStyle={
                onBoardingScreenStyles.pickImageIconStyles?.iconStyle ?? {}
              }
              boxFit={onBoardingScreenStyles.pickImageIconStyles?.boxFit}
              boxStyle={
                onBoardingScreenStyles.pickImageIconStyles?.boxStyle ?? {}
              }
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <LMText
            textStyle={StyleSheet.flatten([
              {
                fontSize: 14,
                fontWeight: "800",
              },
              onBoardingScreenStyles.addPicturePromptTextStyle,
            ])}
          >
            {addPicturePrompt ? addPicturePrompt : "Add profile picture"}
          </LMText>
          <LMText
            textStyle={StyleSheet.flatten([
              {
                fontSize: 14,
                fontWeight: "800",
              },
              onBoardingScreenStyles.maxPictureSizePromptTextStyle,
            ])}
          >
            {maxPictureSizePrompt
              ? maxPictureSizePrompt
              : "Allowed maximum file size 5 MB"}
          </LMText>
        </View>
      </View>
      <View>
        <View style={{ marginHorizontal: Layout.normalize(12), gap: 6 }}>
          <LMText
            textStyle={StyleSheet.flatten([
              { fontWeight: "700", left: 3 },
              onBoardingScreenStyles.userNameTextBoxLabelStyle,
            ])}
          >
            {userNameInputBoxLabel ? userNameInputBoxLabel : "Enter your name"}
            <LMText
              textStyle={StyleSheet.flatten([
                { fontWeight: "800", color: "red" },
                onBoardingScreenStyles.userNameTextBoxLabelStyle,
              ])}
            >
              {" "}
              *
            </LMText>
          </LMText>
          <LMInputText
            onType={setName}
            textValueStyle={StyleSheet.flatten([
              { fontSize: 18 },
              onBoardingScreenStyles?.userNameInputBoxStyle?.textValueStyle,
            ])}
            inputTextStyle={StyleSheet.flatten([
              {
                elevation: 0,
                borderColor: "#9b9b9b",
                height: Layout.normalize(45),
                borderWidth: 1,
                margin: 0,
                paddingVertical: 0,
                paddingHorizontal: 8,
              },
              onBoardingScreenStyles?.userNameInputBoxStyle?.inputTextStyle,
            ])}
            multilineField={
              onBoardingScreenStyles?.userNameInputBoxStyle?.multilineField ??
              false
            }
            placeholderTextColor={
              onBoardingScreenStyles?.userNameInputBoxStyle
                ?.placeholderTextColor ?? "black"
            }
            rightIcon={onBoardingScreenStyles?.userNameInputBoxStyle?.rightIcon}
            maxLength={userNameMaxCharacterLimit}
            placeholderText={
              onBoardingScreenStyles?.userNameInputBoxStyle?.placeholderText ??
              ""
            }
            inputText={name}
          />
          <View>
            <Text
              style={{
                textAlign: "right",
                color: STYLES.$IS_DARK_THEME
                  ? STYLES.$COLORS.WHITE
                  : STYLES.$COLORS.BLACK,
              }}
            >
              {name.length}/{userNameMaxCharacterLimit}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}