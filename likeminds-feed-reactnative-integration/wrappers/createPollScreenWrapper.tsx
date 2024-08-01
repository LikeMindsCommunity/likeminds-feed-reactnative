import { CreatePollContextProvider } from "../context";
import React from "react";
import LMFeedCreatePollScreen from "../screens/LMFeedCreatePollScreen";

const CreatePollScreenWrapper = ({ navigation, route }) => {
  return (
    <CreatePollContextProvider navigation={navigation} route={route}>
      <LMFeedCreatePollScreen />
    </CreatePollContextProvider>
  );
};

export default CreatePollScreenWrapper;
