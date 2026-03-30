import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme';

const SetupCompleteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setup Complete Screen - Phase 2</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.textPrimary,
    fontSize: 18,
  },
});

export default SetupCompleteScreen;
