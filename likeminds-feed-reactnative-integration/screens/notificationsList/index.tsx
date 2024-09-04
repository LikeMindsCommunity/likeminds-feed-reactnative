import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import React, { useEffect, useState } from "react";
import LMNotificationFeedItem from "../../components/LMNotificationFeedItem";
import LMLoader from "../../components/LMLoader";
import {
  useNotificationFeedContext,
  useNotificationFeedCustomisableMethodsContext,
} from "../../context";
import { styles } from "./styles";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";

const LMFeedNotificationFeedListView = () => {
  const [showLoader, setShowLoader] = useState(true);
  const {
    notifications,
    handleActivityOnTap,
    refreshing,
    onRefresh,
    notificationFeedPageNumber,
    setNotificationFeedPageNumber,
    handleLoadMore,
    isLoading,
  } = useNotificationFeedContext();
  const { onNotificationItemClickedProp } =
    useNotificationFeedCustomisableMethodsContext();
  const loaderStyle = STYLES.$LOADER_STYLE;
  const notificationFeedStyle = STYLES.$NOTIFICATION_FEED_STYLE;

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  }, []);

  return (
    <>
      {showLoader ? (
        <View style={styles.loaderView}>
          {/* @ts-ignore */}
          <LMLoader {...loaderStyle} />
        </View>
      ) : null}
      {notifications?.length > 0 && !showLoader ? (
        <FlatList
          refreshing={refreshing}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={notifications}
          renderItem={({ item }) => {
            return (
              <LMNotificationFeedItem
                activity={item}
                onTap={() => {
                  onNotificationItemClickedProp
                    ? onNotificationItemClickedProp(item)
                    : handleActivityOnTap(item);
                }}
              />
            );
          }}
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            handleLoadMore();
          }}
          ListFooterComponent={
            /* @ts-ignore */
            <>{isLoading && <LMLoader {...loaderStyle} />}</>
          }
          style={{
            backgroundColor: STYLES.$IS_DARK_THEME
              ? STYLES.$BACKGROUND_COLORS.DARK
              : STYLES.$BACKGROUND_COLORS.LIGHT,
          }}
        />
      ) : !showLoader ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            backgroundColor: STYLES.$IS_DARK_THEME
              ? STYLES.$BACKGROUND_COLORS.DARK
              : STYLES.$BACKGROUND_COLORS.LIGHT,
          }}
        >
          {notificationFeedStyle?.noActivityViewImage ? (
            notificationFeedStyle?.noActivityViewImage
          ) : (
            <Image
              source={require("../../assets/images/empty_nothing3x.png")}
              style={{
                height: Layout.normalize(150),
                width: Layout.normalize(150),
                ...notificationFeedStyle?.noActivityViewImageStyle,
              }}
            />
          )}
          <Text
            style={{
              color: STYLES.$IS_DARK_THEME
                ? STYLES.$TEXT_COLOR.PRIMARY_TEXT_DARK
                : STYLES.$TEXT_COLOR.PRIMARY_TEXT_LIGHT,
              fontFamily: STYLES.$FONT_TYPES.LIGHT,
              ...notificationFeedStyle?.noActivityViewTextStyle,
            }}
          >
            {notificationFeedStyle?.noActivityViewText
              ? notificationFeedStyle?.noActivityViewText
              : `Oops! You don't have any notifications yet.`}
          </Text>
        </View>
      ) : null}
    </>
  );
};

export { LMFeedNotificationFeedListView };
