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
    screenTitle?: string;
    screenSubtitle?: string;
    ctaButtonText?: string;
    editScreenTitle?: string;
    editScreenSubtitle?: string;
    editCtaButtonText?: string;
}

export interface userOnboardingCallbacksContextValues {
    onCTAButtonClickedProp?: () => void;
    onPickProfileImageClickedProp?: () => void;
    userNameMaxCharacterLimit: number;
    screenTitle?: string;
    screenSubtitle?: string;
    ctaButtonText?: string;
    editScreenTitle?: string;
    editScreenSubtitle?: string;
    editCtaButtonText?: string;
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
    screenTitle,
    screenSubtitle,
    ctaButtonText = "continue",
    editScreenTitle,
    editScreenSubtitle,
    editCtaButtonText = "continue"
}: userOnboardingCallbacksContextProps) {
    const value: userOnboardingCallbacksContextValues = {
        onCTAButtonClickedProp,
        onPickProfileImageClickedProp,
        userNameMaxCharacterLimit,
        screenTitle,
        screenSubtitle,
        ctaButtonText,
        editScreenTitle,
        editScreenSubtitle,
        editCtaButtonText,
    }
    return (
        <UserOnboardingCallbacksContext.Provider value={value}>
            {children}
        </UserOnboardingCallbacksContext.Provider>
    )
}