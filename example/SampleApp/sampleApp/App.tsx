import React from 'react';
import {
  AppProvider,
  LMFeedProvider,
} from 'likeminds-feed-reactnative-integration';
import {myClient} from '.';
import {Text, ViewStyle} from 'react-native';
const App = () => {
  // custom style of new post button
  const newPostButtonStyle: ViewStyle = {
    backgroundColor: 'red',
    width: '40%',
    padding: '10%',
    borderRadius: 35,
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
    shadowColor: '#000',
  };
  return (
    <AppProvider>
      <LMFeedProvider
        myClient={myClient}
        userName="user123"
        userUniqueId="0e53748a-969b-44c6-b8fa-a4c8e1eb1208"
        universalFeedStyle={{
          newPostButtonStyle: newPostButtonStyle,
          screenHeader: {headingViewStyle: {display: 'none'}},
        }}
        postListStyle={{
          footer: {
            likeIconButton: {
              onTap: () => {
                console.log('likeee');
              },
            },
          },
          header: {
            onTap: () => {
              console.log('outside header tap');
            },
            profilePicture: {
              fallbackTextBoxStyle: {backgroundColor: 'pink'},
              fallbackText: {children: <Text>dd</Text>},
            },
          },
        }}
        loaderStyle={{loader: {color:'green'}}}>
        <Text>Sample app</Text>
      </LMFeedProvider>
    </AppProvider>
  );
};

export default App;
