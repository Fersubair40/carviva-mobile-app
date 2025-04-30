import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, Animated } from 'react-native';

interface TokenInputProps {
  title: string;
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (code: string) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
  title,
  length = 6,
  onComplete,
  error,
  disabled,
  onChange,
  value,
}) => {
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(false);

  const shakeAnimation = new Animated.Value(0);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  useEffect(() => {
    if (error) {
      startShakeAnimation();
    }
  }, [error]);

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (code.length === length) {
      onComplete(code);
    }
  }, [code, length, onComplete]);

  useEffect(() => {
    if (value) {
      setCode(value);
    }
  }, [value]);

  const handleCodeChange = (text: string) => {
    const newCode = text.replace(/[^0-9]/g, '').slice(0, length);
    setCode(newCode);
    if (onChange) onChange(newCode);
    if (newCode.length === length) onComplete(newCode);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          focused && styles.containerFocused,
        ]}
        value={code}
        onChangeText={handleCodeChange}
        keyboardType="number-pad"
        maxLength={length}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        placeholder={`Enter ${length}-digit code`}
        placeholderTextColor="#9CA3AF"
        selectionColor="#1E40AF"
        textAlign="center"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'left',
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 8,
    textAlign: 'left',
  },
  inputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    marginTop: 8,
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Inter-Regular',
  },

  containerFocused: {
    borderColor: '#1a1a1a',
    borderWidth: 1,
  },
});

export default TokenInput;
