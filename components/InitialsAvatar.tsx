import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InitialsAvatar = ({
  firstName = '',
  lastName = '',
  size = 50,
  style,
  textStyle,
}: {
  firstName?: string;
  lastName?: string;
  size?: number;
  style?: object;
  textStyle?: object;
}) => {
  // Get initials from first and last name
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`;
  };

  // Generate a deterministic color based on the name
  const getBackgroundColor = () => {
    const colors = [
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
      '#4CAF50',
      '#8BC34A',
      '#CDDC39',
      '#FFC107',
      '#FF9800',
      '#FF5722',
    ];

    // Create a simple hash from the names to pick a color
    const nameHash = (firstName + lastName)
      .split('')
      .reduce((hash, char) => char.charCodeAt(0) + hash, 0);

    return colors[nameHash % colors.length];
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }, textStyle]}>
        {getInitials()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default InitialsAvatar;

// Usage Example:
// Replace your Image component with:
/*
<InitialsAvatar
  firstName="John"
  lastName="Doe"
  size={50}  // Match your existing image size
  style={styles.profileImage} // You can keep your existing style if needed
/>
*/
