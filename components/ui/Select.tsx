// components/ui/Select.tsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { ChevronDown, CheckCircle2Icon } from 'lucide-react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';

import * as Haptics from 'expo-haptics';

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number | null;
  onChange: (value: string | number) => void;
  error?: string;
};

const Select = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  error,
}: SelectProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  const openSelect = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    bottomSheetRef.current?.present();
  }, []);

  const handleSelect = useCallback(
    (option: SelectOption) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onChange(option.value);
      bottomSheetRef.current?.close();
    },
    [onChange]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        <TouchableOpacity
          style={[styles.selectButton, error ? styles.selectButtonError : null]}
          onPress={openSelect}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.selectText, !selectedOption && styles.placeholder]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleStyle={styles.bottomSheetHandle}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>
            {label || 'Select an option'}
          </Text>
          <View style={styles.optionsList}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  option.value === value && styles.optionItemSelected,
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>

                {option.value === value && (
                  <CheckCircle2Icon size={20} color={'#1a1a1a'} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginBottom: 4,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  selectButtonError: {
    borderColor: '#EF4444',
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  bottomSheetHandle: {
    backgroundColor: '#F9FAFB',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomSheetIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  optionsList: {
    width: '100%',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionItemSelected: {
    backgroundColor: '#E1E4EB',
    borderColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  optionTextSelected: {
    fontFamily: 'Inter-Medium',
    color: '#1a1a1a',
  },

  checkIconContainer: {
    // marginLeft: 8,
  },
  checkIcon: {
    color: '#1a1a1a', // Use the same color as your selected text or a custom one
    fontWeight: 'bold',
  },
});

export default Select;
