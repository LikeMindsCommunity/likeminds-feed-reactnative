import { View, SafeAreaView, FlatList } from "react-native";
import React from "react";
import { styles } from "./styles";
import {
  PostLikesCustomisableMethodsContextProvider,
  PostLikesListContextProvider,
  PostLikesListContextValues,
  usePostLikesCustomisableMethodsContext,
  usePostLikesListContext,
} from "../../context";
import { LMMemberListItem } from "../../components";
import LMHeader from "../../components/LMHeader";
import LMLoader from "../../components/LMLoader";
import { LMLikeUI, LMUserUI, RootStackParamList } from "../../models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import STYLES from "../../constants/Styles";

interface PostLikesProps {
  children?: React.ReactNode;
  navigation?: NativeStackNavigationProp<RootStackParamList, "PostLikesList">;
  route?: {
    key: string;
    name: string;
    params: Array<string>;
    path: undefined;
  };
  onTapUserItemProp?: (user: LMUserUI) => void;
  handleScreenBackPressProp?: () => void;
}

const PostLikesList = ({
  navigation,
  route,
  children,
  onTapUserItemProp,
  handleScreenBackPressProp,
}: PostLikesProps) => {
  return (
    <PostLikesCustomisableMethodsContextProvider
      onTapUserItemProp={onTapUserItemProp}
      handleScreenBackPressProp={handleScreenBackPressProp}
    >
      <PostLikesListComponent />
    </PostLikesCustomisableMethodsContextProvider>
  );
};

const PostLikesListComponent = React.memo(() => {
  const {
    totalLikes,
    postLike,
    navigation,
    handleScreenBackPress,
  }: PostLikesListContextValues = usePostLikesListContext();
  const { onTapUserItemProp, handleScreenBackPressProp } =
    usePostLikesCustomisableMethodsContext();
  const postListStyle: any = STYLES.$POST_LIST_STYLE;
  const postLikesListStyle = STYLES.$POST_LIKES_LIST_STYLE;
  const customScreenHeader = postLikesListStyle?.screenHeader;
  return (
    <SafeAreaView style={styles.mainContainer}>
      <LMHeader
        {...customScreenHeader}
        showBackArrow={
          customScreenHeader?.showBackArrow != undefined
            ? customScreenHeader?.showBackArrow
            : true
        }
        heading={
          customScreenHeader?.heading ? customScreenHeader?.heading : "Likes"
        }
        subHeading={
          customScreenHeader?.subHeading
            ? customScreenHeader?.subHeading
            : totalLikes > 1
            ? `${totalLikes} likes`
            : `${totalLikes} like`
        }
        onBackPress={() => {
          handleScreenBackPressProp
            ? handleScreenBackPressProp()
            : handleScreenBackPress();
        }}
      />
      {/* post likes list */}
      {postLike?.length > 0 ? (
        <FlatList
          data={postLike}
          renderItem={({ item }: { item: LMLikeUI }) => {
            return (
              <LMMemberListItem
                likes={item}
                profilePictureProps={postListStyle?.header?.profilePicture}
                boxStyle={postLikesListStyle?.likeListItemStyle}
                nameProps={{ textStyle: postLikesListStyle?.userNameTextStyle }}
                customTitleProps={{
                  textStyle: postLikesListStyle?.userDesignationTextStyle,
                }}
                onTap={(user: any) =>
                  onTapUserItemProp && onTapUserItemProp(user)
                }
              />
            );
          }}
        />
      ) : (
        <View style={styles.loaderView}>
          <LMLoader />
        </View>
      )}
    </SafeAreaView>
  );
});

export { PostLikesList };
