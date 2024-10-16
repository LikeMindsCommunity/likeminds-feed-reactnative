import React from "react";
import {
  CreatePostContextProvider,
  UniversalFeedContextProvider,
  useCreatePostContext,
} from "../context";
import { CreatePost } from "../screens/createPost";


const FeedCreatePost = () => {
  const {handleOnAnonymousPostClicked} = useCreatePostContext()

  const customMethod = () => {
    console.log("before pressing anonymous post")
    handleOnAnonymousPostClicked();
    console.log("after clicking anonymous post")
  }
  return(
    /* @ts-ignore */
    <CreatePost
     isHeadingEnabled={true}
     isAnonymousPostAllowed={true}
     hintTextForAnonymous="post"
     handleOnAnonymousPostClickedProp={customMethod}
    />
  )
}


const QnAFeedCreateWrapper = ({ navigation, route }) => {
  return (
    <UniversalFeedContextProvider navigation={navigation} route={route}>
      <CreatePostContextProvider navigation={navigation} route={route}>
        {/* @ts-ignore */}
        <FeedCreatePost/>
      </CreatePostContextProvider>
    </UniversalFeedContextProvider>
  );
};

export default QnAFeedCreateWrapper;
