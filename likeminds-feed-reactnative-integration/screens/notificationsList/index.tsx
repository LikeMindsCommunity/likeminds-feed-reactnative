import { View, Text, FlatList, RefreshControl } from "react-native";
import React from "react";
import { LMLoader, LMNotificationFeedItem } from "../../components";
import {
  useNotificationFeedContext,
  useNotificationFeedCustomisableMethodsContext,
} from "../../context";
import { styles } from "./styles";
import { useLMFeedStyles } from "../../lmFeedProvider";

const LMFeedNotificationFeedListView = () => {
  const { notifications, handleActivityOnTap, refreshing, onRefresh, notificationFeedPageNumber,
    setNotificationFeedPageNumber,handleLoadMore, isLoading } =
    useNotificationFeedContext();
  const { onNotificationItemClickedProp } =
    useNotificationFeedCustomisableMethodsContext();
  const LMFeedContextStyles = useLMFeedStyles();
  const { loaderStyle } = LMFeedContextStyles;

  return (
    <>
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
          ListFooterComponent={<>{isLoading && <LMLoader {...loaderStyle} />}</>}
        />
      ) : (
        <View style={styles.loaderView}>
          <LMLoader {...loaderStyle} />
        </View>
      )}
    </>
  );
};

export { LMFeedNotificationFeedListView };
