import React from "react";
import { PostLikesListContextProvider } from "../context";
import { PostLikesList } from "../screens/likesList";

const LikesWrapper = ({ navigation, route }) => {
  return (
    <PostLikesListContextProvider navigation={navigation} route={route}>
      <PostLikesList />
    </PostLikesListContextProvider>
  );
};

export default LikesWrapper;
