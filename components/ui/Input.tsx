import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
  disabled?: boolean;
  icon?: React.ReactNode;
  renderInput?: (props: {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: KeyboardTypeOptions;
    onFocus?: () => void;
    onBlur?: () => void;
    maxLength?: number;
    editable?: boolean;
    placeholderTextColor?: string;
    style?: TextStyle | TextStyle[];
    [key: string]: any;
  }) => React.ReactNode; // New prop for custom input rendering
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error,
  helperText,
  containerStyle,
  style,
  inputStyle,
  maxLength,
  disabled = false,
  icon,
  renderInput, // New prop
}) => {
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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

  // Common props for the input
  const inputProps = {
    placeholder,
    value,
    onChangeText,
    secureTextEntry: secureTextEntry && !isPasswordVisible,
    autoCapitalize,
    keyboardType,
    onFocus: handleFocus,
    onBlur: handleBlur,
    maxLength,
    editable: !disabled,
    placeholderTextColor: '#9CA3AF',
    style: [
      styles.input,
      icon ? styles.inputWithIcon : {},
      inputStyle,
    ] as TextStyle[],
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[getContainerStyle(), style]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        {renderInput ? renderInput(inputProps) : <TextInput {...inputProps} />}

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
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
    padding: 16,
    color: '#1F2937',
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  eyeIcon: {
    padding: 12,
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

export default Input;
