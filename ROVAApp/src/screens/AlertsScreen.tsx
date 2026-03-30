import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme';

const AlertsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Alerts Screen - Phase 4</Text>
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

export default AlertsScreen;
