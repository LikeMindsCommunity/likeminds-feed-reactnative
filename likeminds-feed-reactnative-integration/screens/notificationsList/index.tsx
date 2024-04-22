import { View, Text, FlatList, RefreshControl, Image } from "react-native";
import React from "react";
import { LMLoader, LMNotificationFeedItem } from "../../components";
import {
  useNotificationFeedContext,
  useNotificationFeedCustomisableMethodsContext,
} from "../../context";
import { styles } from "./styles";
import { useLMFeedStyles } from "../../lmFeedProvider";
import Layout from "../../constants/Layout";

const LMFeedNotificationFeedListView = () => {
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
  const { loaderStyle } = LMFeedContextStyles;

  return (
    <>
      {!notifications ? (
        <View style={styles.loaderView}>
          <LMLoader {...loaderStyle} />
        </View>
      ) : null}
      {notifications?.length > 0 ? (
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
            <>{isLoading && <LMLoader {...loaderStyle} />}</>
          }
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            source={require("../../assets/images/empty_nothing3x.png")}
            style={{
              height: Layout.normalize(150),
              width: Layout.normalize(150),
            }}
          />
          <Text>Oops! You don't have any notifications yet.</Text>
        </View>
      )}
    </>
  );
};

export { LMFeedNotificationFeedListView };
