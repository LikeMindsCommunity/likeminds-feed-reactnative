import React from 'react'
import { NotificationFeedContextProvider } from '@likeminds.community/feed-rn-core'
import NotificationScreen from './notificationScreen'

const NotificationWrapper = ({navigation, route}) => {
  return (
    <NotificationFeedContextProvider navigation={navigation} route={route}>
      <NotificationScreen />
    </NotificationFeedContextProvider>
  )
}

export default NotificationWrapper