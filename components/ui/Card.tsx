import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Animated,
  Pressable
} from 'react-native';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;  // Changed from ViewStyle to TextStyle
  subtitleStyle?: TextStyle;  // Added for consistency
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  onPress,
  rightComponent,
  variant = 'default',
  disabled = false
}) => {
  // Animation value for press feedback
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress && !disabled) {
      Animated.spring(animatedScale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress && !disabled) {
      Animated.spring(animatedScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  // Determine styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'outlined':
        return [styles.card, styles.cardOutlined, style];
      case 'elevated':
        return [styles.card, styles.cardElevated, style];
      case 'flat':
        return [styles.card, styles.cardFlat, style];
      default:
        return [styles.card, style];
    }
  };

  // Wrapper component based on whether card is pressable
  const CardWrapper = onPress ? Animated.View : View;
  const wrapperProps = onPress
    ? {
        style: [
          getCardStyles(),
          { transform: [{ scale: animatedScale }] },
          disabled && styles.cardDisabled
        ]
      }
    : { style: [getCardStyles(), disabled && styles.cardDisabled] };

  const content = (
    <CardWrapper {...wrapperProps}>
      {(title || rightComponent) && (
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
            {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
          </View>
          {rightComponent && (
            <View style={styles.rightComponentContainer}>
              {rightComponent}
            </View>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardWrapper>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={styles.pressableContainer}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  pressableContainer: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  cardOutlined: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardElevated: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFlat: {
    backgroundColor: '#F9FAFB',
    shadowOpacity: 0,
    elevation: 0,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  rightComponentContainer: {
    marginLeft: 16,
  },
  content: {
    padding: 16,
  },
});

export default Card;
