import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface AmountInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
  disabled?: boolean;
  prefix?: string;
  precision?: number;
  icon?: React.ReactNode;
}

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  placeholder = '0.00',
  value,
  onChangeText,
  error,
  helperText,
  containerStyle,
  style,
  inputStyle,
  maxLength,
  disabled = false,
  prefix = '',
  precision = 2,
  icon,
}) => {
  const [focused, setFocused] = useState(false);

  // Format the displayed value
  const formatAmount = (amount: string): string => {
    if (!amount) return '';

    // Remove non-numeric characters except decimal point
    const numericValue = amount.replace(/[^0-9.]/g, '');

    // Parse the number
    const number = parseFloat(numericValue);
    if (isNaN(number)) return '';

    // Format with commas and fixed decimal places
    return prefix + number.toLocaleString('en-US');
  };

  // Parse the formatted string to get a raw number
  const parseAmount = (formattedAmount: string): string => {
    if (!formattedAmount) return '';
    // Remove prefix and non-numeric characters except decimal
    return formattedAmount.replace(prefix, '').replace(/,/g, '');
  };

  const handleChangeText = (text: string) => {
    // If the user is deleting the prefix, reset to empty
    if (text === prefix || text === '') {
      onChangeText('');
      return;
    }

    // If text doesn't start with prefix, add it
    if (!text.startsWith(prefix)) {
      text = prefix + text;
    }

    // Extract raw value and pass it to parent
    const rawValue = parseAmount(text);
    onChangeText(rawValue);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    // Format properly on blur
    if (value) {
      const formatted = formatAmount(value);
      onChangeText(parseAmount(formatted));
    }
  };

  const getContainerStyle = () => {
    let containerStyleObj: ViewStyle = { ...styles.container };

    if (focused) {
      containerStyleObj = { ...containerStyleObj, ...styles.containerFocused };
    }

    if (error) {
      containerStyleObj = { ...containerStyleObj, ...styles.containerError };
    }

    if (disabled) {
      containerStyleObj = { ...containerStyleObj, ...styles.containerDisabled };
    }

    return containerStyleObj;
  };

  // Display the formatted value
  const displayValue = value ? formatAmount(value) : '';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[getContainerStyle(), style]}>
        {icon ? (
          <View style={styles.iconContainer}>{icon}</View>
        ) : (
          <View style={styles.iconContainer}>
            <FontAwesome6 name="naira-sign" size={15} color="black" />
          </View>
        )}
        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : {}, inputStyle]}
          placeholder={placeholder}
          value={displayValue}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          editable={!disabled}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  containerFocused: {
    borderColor: '#1a1a1a',
    borderWidth: 1,
  },
  containerError: {
    borderColor: '#DC2626',
  },
  containerDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  iconContainer: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    // paddingHorizontal: 13,
    // paddingVertical: 16,
    padding: 13,
    color: '#1F2937',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AmountInput;
