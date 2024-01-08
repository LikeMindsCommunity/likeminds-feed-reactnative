import React from 'react';
import {AppProvider, LMFeedProvider} from 'likeminds-feed-reactnative-integration';
import { myClient } from '.';
import { Text } from 'react-native';
const App = () => {
  return (
    <AppProvider>
    <LMFeedProvider myClient={myClient} userName='user123' userUniqueId='fed69eac-2857-4fe6-af05-830c0950e032'>
      <Text>Example app</Text>
    </LMFeedProvider>
    </AppProvider>
  );
};

export default App;
