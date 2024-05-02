import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { LMLoader, LMNotificationFeedItem } from "../../components";
import {
  useNotificationFeedContext,
  useNotificationFeedCustomisableMethodsContext,
} from "../../context";
import { styles } from "./styles";
import { useLMFeedStyles } from "../../lmFeedProvider";
import Layout from "../../constants/Layout";

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
  const LMFeedContextStyles = useLMFeedStyles();
  const { loaderStyle, notificationFeedStyle } = LMFeedContextStyles;

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
        />
      ) : !showLoader ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
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
              color: "black",
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
