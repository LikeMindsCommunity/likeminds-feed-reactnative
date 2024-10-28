import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  GetCommentLikesRequest,
  GetPostLikesRequest,
} from "@likeminds.community/feed-rn";
import { commentLikes, postLikes } from "../store/actions/postLikes";
import { COMMENT_LIKES, POST_LIKES } from "../constants/Strings";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../models/RootStackParamsList";
import { LMFeedAnalytics } from "../analytics/LMFeedAnalytics";
import { Events } from "../enums/Events";
import { Keys } from "../enums/Keys";

interface PostLikesListContextProps {
  children?: ReactNode;
  navigation: NativeStackNavigationProp<RootStackParamList, "PostLikesList">;
  route: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
}

export interface PostLikesListContextValues {
  navigation: NativeStackNavigationProp<RootStackParamList, "PostLikesList">;
  postLike: [];
  totalLikes: number;
  postLikesList: (id: string) => void;
  commentLikesList: (id: string, postId: string) => void;
  handleScreenBackPress: () => void;
}

const PostLikesListContext = createContext<
  PostLikesListContextValues | undefined
>(undefined);

export const usePostLikesListContext = () => {
  const context = useContext(PostLikesListContext);
  if (!context) {
    throw new Error(
      "usePostLikesListContext must be used within an PostLikesListContextProvider"
    );
  }
  return context;
};

export const PostLikesListContextProvider = ({
  children,
  navigation,
  route,
}: PostLikesListContextProps) => {
  const dispatch = useAppDispatch();
  const { postLike, totalLikes } = useAppSelector((state) => state.postLikes);

  // Analytics event
  useEffect(() => {
    if (route.params[0] === POST_LIKES) {
      LMFeedAnalytics.track(
        Events.LIKE_LIST_OPEN,
        new Map<string, string>([[Keys.POST_ID, route.params[1]]])
      );
    }
  }, []);

  // this function calls the post likes api
  const postLikesList = async (id: string) => {
    const payload = {
      postId: id,
    };
    // calling post likes api
    const postLikesResponse = await dispatch(
      postLikes(
        GetPostLikesRequest.builder()
          .setPostId(payload.postId)
          .setPage(1)
          .setPageSize(10)
          .build(),
        false
      )
    );
    return postLikesResponse;
  };

  // this function calls the comment likes api
  const commentLikesList = async (id: string, postId: string) => {
    const payload = {
      commentId: id,
      postId: postId,
    };
    // calling post likes api
    const commentLikesResponse = await dispatch(
      commentLikes(
        GetCommentLikesRequest.builder()
          .setCommentId(payload.commentId)
          .setPage(1)
          .setPageSize(10)
          .setPostId(payload.postId)
          .build(),
        false
      )
    );
    return commentLikesResponse;
  };

  // this calls the post likes list function to render the data
  useEffect(() => {
    if (route.params[0] === COMMENT_LIKES) {
      commentLikesList(route.params[1], route.params[2]);
    }
    if (route.params[0] === POST_LIKES) {
      postLikesList(route.params[1]);
    }
  }, [route.params]);

  // this handles the functionality on back press
  const handleScreenBackPress = () => {
    navigation.goBack();
  };

  const contextValues: PostLikesListContextValues = {
    navigation,
    postLike,
    totalLikes,
    postLikesList,
    commentLikesList,
    handleScreenBackPress,
  };

  return (
    <PostLikesListContext.Provider value={contextValues}>
      {children}
    </PostLikesListContext.Provider>
  );
};
