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
} from "react-native";
import React, { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";
import { StackActions, useNavigation, useRoute } from "@react-navigation/native";
import { LMHeader, LMImage, LMLoader } from "../../components";
import { useLMFeed } from "../../lmFeedProvider";
import { LMButton, LMIcon, LMInputText, LMText } from "../../uiComponents";
import { UserOnboardingCallbacksContextProvider, useUniversalFeedContext } from "../../context";
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
    screenTitle?: string;
    screenSubtitle?: string;
    ctaButtonText?: string;
    editScreenTitle?: string;
    editScreenSubtitle?: string;
    editScreenButtonText?: string;
}

export default function UserOnboardingComponent({
    onCTAButtonClickedProp,
    onPickProfileImageClickedProp,
    userNameMaxCharacterLimit,
    screenTitle,
    screenSubtitle,
    ctaButtonText,
    editScreenButtonText,
    editScreenSubtitle,
    editScreenTitle
}: userOnboardingCallbacksContextProps) {
    return (
        <UserOnboardingCallbacksContextProvider
            onCTAButtonClickedProp={onCTAButtonClickedProp}
            onPickProfileImageClickedProp={onPickProfileImageClickedProp}
            userNameMaxCharacterLimit={userNameMaxCharacterLimit}
            screenTitle={screenTitle}
            screenSubtitle={screenSubtitle}
            ctaButtonText={ctaButtonText}

        >
            <UserOnboardingScreen />
        </UserOnboardingCallbacksContextProvider>
    )
}

function UserOnboardingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();
    const { onBoardUser, withAPIKeySecurity, isInitiated, isUserOnboardingRequired, callIsUserOnboardingDone
    } = useLMFeed();
    const { onCTAButtonClicked, onPickProfileImageClicked, name, setName,
        imageUrl, setImageUrl, profileImage, disableSubmitButton, setDisableSubmitButton,
        loading, memberData, isUserOnboardingDone, setIsUserOnboardingDone
    } = useUserOnboardingContext();
    const {
        userNameMaxCharacterLimit,
        screenSubtitle,
        screenTitle,
        ctaButtonText,
        onCTAButtonClickedProp,
        onPickProfileImageClickedProp
    } = useUserOnboardingCallbacksContext();

    const isEditing = useMemo(() => {
        if (((route.params as any)?.action) == "EDIT_PROFILE") {
            return true;
        }
    },
        [withAPIKeySecurity]);

    
    useLayoutEffect(() => {
        (async () => {
            const response = await callIsUserOnboardingDone();
            setIsUserOnboardingDone(response)
        })()
    }, [])

    useLayoutEffect(() => {
        (async () => {
            if (isEditing) {
                const response = await Client.myClient?.getMemberState();
                console.log(response);
            }
        })()
    }, [withAPIKeySecurity])

    useEffect(() => {
        console.log("running efect", isInitiated)
        if (isInitiated) {
            console.log("inside here")
            setTimeout(() => navigation.dispatch(
                StackActions.replace(UNIVERSAL_FEED)
            ), 0);
        }
    }, [isInitiated])

    useEffect(() => {
        if (name.length < 3 || name.length > userNameMaxCharacterLimit) {
            setDisableSubmitButton(true);
        } else {
            setDisableSubmitButton(false);
        }
        if (!isEditing) {
        } else {

        }
    }, [name])

    useLayoutEffect(() => {
        if (profileImage !== null || profileImage !== undefined) {
            setImageUrl(profileImage?.uri as string);
        }
    }, [profileImage])



    useEffect(() => {
        const unsubscribe = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!onBoardUser) {
                navigation.goBack();
                return false;
            } else {
                return true;
            }
        })
        return () => unsubscribe.remove()
    }, [onBoardUser])

    useLayoutEffect(() => {
        if (isEditing && Object.keys(memberData as any)?.length > 0) {
            setImageUrl((memberData as any)?.imageUrl);
            setName((memberData as any)?.name)
        }
    }, [memberData])


    useLayoutEffect(() => {
        if ((isUserOnboardingRequired == false || isUserOnboardingRequired == undefined)) {
            return;
        }
        navigation.setOptions({
            headerShown: isUserOnboardingDone ? false : true,
            header: () => <LMHeader
                heading={isEditing ? "Profile" : "Community"}
                showBackArrow={isEditing}
                headingTextStyle={{
                    fontSize: 18,
                    fontWeight: '300'
                }}
                onBackPress={() => {
                    navigation.goBack()
                }}
            />
        })
    }, [])

    const onBoardingScreenStyles = STYLES.$USER_ONBOARDING_SCREEN_STYLES;

    console.log(isInitiated)
    if ((isUserOnboardingRequired == false || isUserOnboardingRequired == undefined) || isUserOnboardingDone ) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.BLACK : STYLES.$COLORS.WHITE,
                justifyContent: 'center', alignItems: 'center'
            }}>
                <LMLoader />
            </View>
        )
    }

    return (
        <View style={{
            flex: 1, backgroundColor:
                STYLES.$IS_DARK_THEME ? STYLES.$BACKGROUND_COLORS.DARK :
                    STYLES.$BACKGROUND_COLORS.LIGHT
        }}>
            <View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <LMText textStyle={{
                        fontSize: 20,
                        fontWeight: '500',
                        color: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.WHITE_TEXT_COLOR : '#333333'
                    }}>
                        {screenTitle ? screenTitle : "Create Your Community Profile"}
                    </LMText>
                    <LMText textStyle={{
                        fontSize: 16,
                        color: STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT,
                        textAlign: "center",
                    }}>
                        {screenSubtitle ? screenSubtitle :
                            "Set up your profile to join the community. Please provide your name and profile picture."}
                    </LMText>
                </View>
                <View style={{
                    height: 120, width: 120, marginTop: 10, alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1.5, borderRadius: 100, borderColor: '#9b9b9b', alignSelf: 'center',
                    backgroundColor: imageUrl ? "black" : STYLES.$COLORS.WHITE
                }}>
                    {imageUrl?.length > 0 ?
                        <Image
                            source={{ uri: imageUrl }}
                            style={
                                onBoardingScreenStyles?.userProfilePictureImageStyles ? onBoardingScreenStyles?.userProfilePictureImageStyles :
                                    { width: 120, height: 120, borderRadius: 100, resizeMode: 'cover' }
                            } /> :
                        <LMIcon
                            assetPath={require("../../assets/images/user_3x.png")}
                            height={50} width={50}
                        />}
                    <TouchableOpacity
                        onPress={onPickProfileImageClickedProp ? onPickProfileImageClickedProp : onPickProfileImageClicked}
                        style={
                            {
                                position: 'absolute', top: Layout.normalize(70),
                                left: Layout.normalize(90),
                                backgroundColor: STYLES.$COLORS.PRIMARY,
                                padding: 6,
                                borderRadius: 20,
                                elevation: 3,
                                ...(onBoardingScreenStyles?.pickImageButtonStyles)
                            }
                        }>
                        <LMIcon
                            assetPath={onBoardingScreenStyles?.pickImageIconStyles?.assetPath ? onBoardingScreenStyles?.pickImageIconStyles?.assetPath :
                                require("../../assets/images/camera_3x.png")
                            }
                            height={onBoardingScreenStyles?.pickImageIconStyles?.height ? onBoardingScreenStyles?.pickImageIconStyles?.height : 18}
                            width={onBoardingScreenStyles?.pickImageIconStyles?.width ? onBoardingScreenStyles?.pickImageIconStyles?.width : 18}
                            {...(onBoardingScreenStyles.pickImageIconStyles)}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LMText textStyle={{
                        fontSize: 14,
                        fontWeight: '800'
                    }}>
                        Add profile picture
                    </LMText>
                    <LMText textStyle={{
                        fontSize: 14,
                        color: STYLES.$TEXT_COLOR.SECONDARY_TEXT_LIGHT
                    }}>
                        Allowed maximum file size 5 Mb
                    </LMText>
                </View>
            </View>
            <View>
                <View style={{ marginHorizontal: Layout.normalize(12), gap: 6 }}>
                    <LMText textStyle={{ fontWeight: '700', left: 3 }}>Enter your name<LMText textStyle={{ fontWeight: '800', color: 'red' }}> *</LMText></LMText>
                    <LMInputText
                        onType={setName}
                        textValueStyle={{ fontSize: 18 }}
                        inputTextStyle={{
                            height: Layout.normalize(50),
                            elevation: 0,
                            borderColor: '#9b9b9b',
                            borderWidth: 1,
                            margin: 0,
                            paddingVertical: 0
                        }}
                        inputText={name}
                    />
                    <View>
                        <Text style={{
                            textAlign: 'right',
                            color: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.WHITE : STYLES.$COLORS.BLACK
                        }}>{name.length}/{userNameMaxCharacterLimit}</Text>
                    </View>
                </View>
            </View>
            <View style={{ width: '100%', position: "absolute", bottom: 50, alignItems: 'center', justifyContent: 'center' }}>
                <LMButton
                    isClickable={!disableSubmitButton || !loading}
                    buttonStyle={{
                        borderColor: STYLES.$IS_DARK_THEME ? "black" : 'white', width: Layout.normalize(130), height: Layout.normalize(40),
                        backgroundColor: !disableSubmitButton ? STYLES.$COLORS.PRIMARY : STYLES.$COLORS.LIGHT_GREY, borderRadius: 20,
                        ...(onBoardingScreenStyles?.ctaButtonStyle)
                    }}
                    onTap={!disableSubmitButton && !loading ? (onCTAButtonClicked) : () => { }} text={{
                        children: loading ? <LMLoader color="white" size={"small"} /> :
                            <LMText textStyle={{ fontSize: 20, color: STYLES.$IS_DARK_THEME ? STYLES.$COLORS.WHITE : STYLES.$COLORS.WHITE, fontWeight: '600', }}>{ctaButtonText ? ctaButtonText : "Continue"}</LMText>
                    }} />
            </View>
        </View>
    )
}
