import React from "react";
import {
  UniversalFeedContextProvider,
  UserOnboardingContextProvider,
} from "../context";
import UserOnboardingScreen from "../screens/userOnboardingScreen";

export default function UserOnboardingScreenWrapper ({navigation, route}: any) {
    return (
        // <UniversalFeedContextProvider navigation={navigation} route={route}>
            <UserOnboardingContextProvider navigation={navigation} route={route}>
                <UserOnboardingScreen />
            </UserOnboardingContextProvider>
        // </UniversalFeedContextProvider>
    )
}