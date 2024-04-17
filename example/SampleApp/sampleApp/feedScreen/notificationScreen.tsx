import React from 'react'
import { LMFeedNotificationFeedScreen, useNotificationFeedContext } from '@likeminds.community/feed-rn-core'

const NotificationScreen = () => {
    const {handleActivityOnTap, handleScreenBackPress} = useNotificationFeedContext()
    const customNotificationOnTap = (activity) => {
        console.log('before notification tap', activity);
        handleActivityOnTap(activity)
        console.log('after notification tap');
      };
      const customBackHandler = () => {
        console.log('before back click');
        handleScreenBackPress()
        console.log('after back click');
      };
  return (
    <LMFeedNotificationFeedScreen onNotificationItemClickedProp={(activity) => customNotificationOnTap(activity)}
    handleScreenBackPressProp={customBackHandler} />
  )
}

export default NotificationScreen