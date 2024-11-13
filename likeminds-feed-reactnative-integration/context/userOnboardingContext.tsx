import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
    JSX,
    useLayoutEffect,
    useMemo,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { RootStackParamList } from "../models/RootStackParamsList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { selectImageVideo, uploadFilesToAWS } from "../utils";
import { useUniversalFeedContext } from "../context";
import { convertImageVideoMetaData } from "../viewDataModels";
import { Asset } from "react-native-image-picker";
import { SHOW_TOAST } from "../store/types/loader";
import { Client } from "../client";
import { getMemberState } from "../store/actions/login";
import { BackHandler } from "react-native";
import { useLMFeed } from "../lmFeedProvider";

interface userOnboardingContextProps {
    children?: ReactNode;
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        "UserOnboardingScreen"
    >;
    route: {
        key: string;
        name: string;
        params: Array<string>;
        path: undefined;
    };
}

export interface userOnboardingContextValues {
    navigation: NativeStackNavigationProp<
        RootStackParamList,
        "UserOnboardingScreen"
    >;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    imageUrl: string;
    setImageUrl: React.Dispatch<React.SetStateAction<string>>;
    profileImage: Asset | undefined | null;
    loading: boolean;
    memberData?: Object,
    isUserOnboardingDone: boolean;
    setIsUserOnboardingDone: React.Dispatch<React.SetStateAction<boolean>>;
    setMemberData: React.Dispatch<React.SetStateAction<any>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setProfileImage: React.Dispatch<React.SetStateAction<Asset | null | undefined>>;
    disableSubmitButton: boolean;
    setDisableSubmitButton: React.Dispatch<React.SetStateAction<boolean>>;
    onCTAButtonClicked: () => void;
    onPickProfileImageClicked: () => void;
    uploadProfileImage: () => void;

}

const UserOnboardingContext = createContext<userOnboardingContextValues | undefined>(
    undefined
);

export const useUserOnboardingContext = () => {
    const context = useContext(UserOnboardingContext);
    if (!context) {
        throw new Error(
            "useUserOnboarding must be used within an UserOnboardingContextProvider"
        );
    }
    return context;
};

export default function UserOnboardingContextProvider({
    children,
    navigation,
    route,
}: userOnboardingContextProps) {
    const dispatch = useAppDispatch();
    const [name, setName] = useState("");
    const { onBoardUser, setOnboardUser, withAPIKeySecurity, isInitiated , callGetCommunityConfigurations, setIsInitiated, userUniqueId, callInitiateAPI } = useLMFeed();
    const [memberData, setMemberData] = useState();
    const [isUserOnboardingDone, setIsUserOnboardingDone] = useState(true);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<Asset | null | undefined>();
    const [imageUrl, setImageUrl] = useState("");

    console.log(withAPIKeySecurity, isInitiated, userUniqueId)

    async function onCTAButtonClicked() {
        setLoading(true);
        let uploadResponse: any = null
        if (profileImage !== null && profileImage !== undefined) {
            uploadResponse = await uploadProfileImage();
        }
        try {
            if(isInitiated) {
                const res = await Client.myClient?.editProfile({
                    imageUrl: uploadResponse?.Location ? uploadResponse?.Location : (memberData as any)?.imageUrl,
                    userUniqueId: (memberData as any)?.userUniqueId,
                    userName: name,
                    name
                });
                console.log(res);
                await Client.myClient?.setIsUserOnboardingDone(true);
                await dispatch(getMemberState());
                setLoading(false);
                setOnboardUser(false);
                navigation.goBack();
            } else {
                if(withAPIKeySecurity) {
                    console.log("WITH API KEY SECURITY")
                    const res = await Client.myClient?.editProfile({
                        imageUrl: uploadResponse?.Location ? uploadResponse?.Location : "",
                        userUniqueId: userUniqueId ? userUniqueId : "",
                        userName: name,
                        name
                    });
                    await Client.myClient?.setIsUserOnboardingDone(true);
                    await dispatch(getMemberState());
                    await callGetCommunityConfigurations();
                    setIsInitiated(true);
                    setLoading(false);
                    setOnboardUser(false);
                } else {
                    console.log("NON API KEY SECURITY")
                    await callInitiateAPI(name, uploadResponse?.Location ? uploadResponse?.Location : "");
                    await Client.myClient?.setIsUserOnboardingDone(true);
                    setLoading(false);
                    setOnboardUser(false);
                }
            }
        } catch (error) {
            setLoading(false);
            dispatch({
                type: SHOW_TOAST,
                body: { isToast: true, message: "Something went wrong, try again later" },
            })
        }
    }

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

    const onPickProfileImageClicked = async () => {
        try {
            const res = await selectImageVideo("photo", 1);
            if (res?.assets) {
                if ((res?.assets[0])?.fileSize && (res?.assets[0])?.fileSize < 5242880) {
                    setProfileImage(res.assets[0] ?? null)
                    setImageUrl((res.assets[0])?.uri as string);
                } else {
                    dispatch({
                        type: SHOW_TOAST,
                        body: { isToast: true, message: "Image should be less then 5 MB" },
                    })
                }
            }
        } catch (error) {
            console.log("inher ")
        }
    }


    const uploadProfileImage = async () => {
        let uuid = (memberData as any)?.userUniqueId;
        let formattedMedia = (convertImageVideoMetaData([profileImage as any])[0])?.attachmentMeta;
        try {
            const url = await uploadFilesToAWS(formattedMedia, uuid, formattedMedia.url,
                `files/profile/${uuid}/${formattedMedia?.name}-${Date.now()}`);
            return url;
        } catch (error) {
            console.log("hereee inside",error);
            setLoading(false);
            return null;
        }
    }

    const contextValues: userOnboardingContextValues = {
        navigation,
        name,
        setName,
        imageUrl,
        setImageUrl,
        profileImage,
        loading,
        memberData,
        isUserOnboardingDone,
        setMemberData,
        setLoading,
        setProfileImage,
        onCTAButtonClicked,
        onPickProfileImageClicked,
        uploadProfileImage,
        disableSubmitButton,
        setDisableSubmitButton,
        setIsUserOnboardingDone
    }
    return (
        <UserOnboardingContext.Provider value={contextValues}>
            {children}
        </UserOnboardingContext.Provider>
    )
}
