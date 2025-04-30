import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderColor: '#D92D20',
    backgroundColor: '#FEF3F2',
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 12,
    fontWeight: '600',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    height: 52,
    borderWidth: 1,
    borderColor: '#ABEFC6',
    backgroundColor: '#ECFDF3',
    padding: 12,
    borderRadius: 8,
  },
  successText: {
    color: '#067647',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryText: {
    color: 'white',
  },
});

const toastConfig = {

  
};

export default toastConfig;
