import React from 'react';
import { Text, View} from 'react-native'
import { useAppContext } from '../store/AppContext';

const DemoComponent = () => {
  const { state, dispatch } = useAppContext();

  const handleIncrement = () => {
    dispatch({ type: 'INCREMENT' });
  };

  const handleDecrement = () => {
    dispatch({ type: 'DECREMENT' });
  };

  return (
    <View>
      <Text>State value: {state.counter.count}</Text>
      <Text onPress={handleIncrement}>Increase</Text>
      <Text onPress={handleDecrement}>Decrease</Text>
    </View>
  );
};

export default DemoComponent;
