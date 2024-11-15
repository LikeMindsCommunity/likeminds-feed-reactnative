import React, {
    createContext,
    ReactNode,
    useContext,
} from "react";

interface userOnboardingCallbacksContextProps {
    children?: ReactNode;
    onCTAButtonClickedProp?: () => void;
    onPickProfileImageClickedProp?: () => void;
    userNameMaxCharacterLimit?: number;
    createScreenTitle?: string;
    createScreenSubtitle?: string;
    createScreenHeaderTitle?: string;
    createScreenCtaButtonText?: string;
    editScreenTitle?: string;
    editScreenSubtitle?: string;
    editScreenCtaButtonText?: string;
    editScreenHeaderTitle?: string;
    addPicturePrompt?: string;
    maxPictureSizePrompt?: string;
    userNameInputBoxLabel?: string;
}

export interface userOnboardingCallbacksContextValues {
    onCTAButtonClickedProp?: () => void;
    onPickProfileImageClickedProp?: () => void;
    userNameMaxCharacterLimit: number;
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

const UserOnboardingCallbacksContext = createContext<userOnboardingCallbacksContextValues | undefined>(
    undefined
);

export const useUserOnboardingCallbacksContext = () => {
    const context = useContext(UserOnboardingCallbacksContext);
    if (!context) {
        throw new Error(
            "useUserOnboarding must be used within an UserOnboardingContextProvider"
        );
    }
    return context;
};

export default function UserOnboardingCallbacksContextProvider({
    children,
    onCTAButtonClickedProp,
    onPickProfileImageClickedProp,
    userNameMaxCharacterLimit = 50,
    createScreenTitle,
    createScreenHeaderTitle,
    createScreenSubtitle,
    createScreenCtaButtonText = "Continue",
    editScreenTitle,
    editScreenSubtitle,
    editScreenCtaButtonText = "Edit",
    editScreenHeaderTitle = "Profile",
    addPicturePrompt,
    maxPictureSizePrompt,
    userNameInputBoxLabel
    
}: userOnboardingCallbacksContextProps) {
    const value: userOnboardingCallbacksContextValues = {
        onCTAButtonClickedProp,
        onPickProfileImageClickedProp,
        userNameMaxCharacterLimit,
        createScreenTitle,
        createScreenSubtitle,
        createScreenCtaButtonText,
        editScreenTitle,
        editScreenSubtitle,
        editScreenHeaderTitle,
        editScreenCtaButtonText,
        addPicturePrompt,
        maxPictureSizePrompt,
        createScreenHeaderTitle,
        userNameInputBoxLabel
    }
    return (
        <UserOnboardingCallbacksContext.Provider value={value}>
            {children}
        </UserOnboardingCallbacksContext.Provider>
    )
}