import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {Credentials} from './credentials';
import STYLES from '@likeminds.community/feed-rn-core/constants/Styles';
import {useRealm} from '@realm/react';
import {UpdateMode} from 'realm';
import { LoginSchemaRO } from './loginSchemaRO';

interface ChildProps {
  isTrue: boolean;
  setIsTrue: (isTrue: boolean) => void;
  isUserOnboardingRequired?: boolean;
}

const FetchKeyInputScreen: React.FC<ChildProps> = ({isTrue, setIsTrue, isUserOnboardingRequired = false}) => {
  const [userUniqueID, setUserUniqueID] = useState('');
  const [userName, setUserName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const realm = useRealm();

  const handleAddNotes = (
    userUniqueID: string,
    userName: string,
    apiKey: string,
  ) => {
    Credentials.setCredentials(userName, userUniqueID, apiKey);
  };

  useEffect(() => {
    if (userUniqueID && apiKey && isButtonClicked && (isUserOnboardingRequired ? true : userName?.length > 0 )) {
      return setIsTrue(!isTrue);
    }
  }, [isButtonClicked]);

  const saveLoginData = () => {
    realm.write(() => {
      realm.create(
        LoginSchemaRO,
        {
          id: 'LoginSchema',
          userUniqueID: userUniqueID,
          userName: userName,
          apiKey: apiKey,
        },
        UpdateMode.All,
      );
    });
  };

  const handleButtonPress = () => {
    // Perform some action when the button is pressed
    // You can access the input values from input1 and input2 variables
    handleAddNotes(userUniqueID, userName, apiKey);

    saveLoginData();

    userUniqueID && apiKey && (isUserOnboardingRequired ? true : userName?.length > 0 )
      ? setIsButtonClicked(true)
      : setIsButtonClicked(false);

    if (userUniqueID && apiKey && (isUserOnboardingRequired ? true : userName?.length > 0 )) {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Api Key"
        placeholderTextColor={'grey'}
        value={apiKey}
        onChangeText={text => setApiKey(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User unique ID"
        placeholderTextColor={'grey'}
        value={userUniqueID}
        onChangeText={text => setUserUniqueID(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={text => setUserName(text)}
        placeholderTextColor={'grey'}
      />
      <TouchableOpacity
        style={{
          backgroundColor:
            userUniqueID && apiKey && ((isUserOnboardingRequired ? true : userName?.length > 0 ))
              ? STYLES.$COLORS.SECONDARY
              : 'grey',
          padding: 10,
          borderRadius: 10,
        }}
        onPress={userUniqueID && apiKey && (isUserOnboardingRequired ? true : userName?.length > 0 ) ? handleButtonPress : null}>
        <Text
          style={{
            color: STYLES.$COLORS.TERTIARY,
            fontSize: STYLES.$FONT_SIZES.XL,
            fontFamily: STYLES.$FONT_TYPES.LIGHT,
          }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default FetchKeyInputScreen;
