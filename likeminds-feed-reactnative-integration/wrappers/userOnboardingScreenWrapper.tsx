import React from "react";
import {
  FeedContextProvider,
  UserOnboardingContextProvider,
} from "../context";
import UserOnboardingScreen from "../screens/userOnboardingScreen";

export default function UserOnboardingScreenWrapper ({navigation, route}: any) {
    return (
            <UserOnboardingContextProvider navigation={navigation} route={route}>
                <UserOnboardingScreen />
            </UserOnboardingContextProvider>
    )
}