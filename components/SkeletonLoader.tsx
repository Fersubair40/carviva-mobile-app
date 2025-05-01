import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SkeletonLoader = () => {
  // Animation value for the shimmer effect
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start shimmer animation on mount
    startShimmerAnimation();

    return () => {
      // Clean up animation when component unmounts
      shimmerAnimation.stopAnimation();
    };
  }, []);

  const startShimmerAnimation = () => {
    Animated.loop(
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  };

  // Interpolate the animation value to create the shimmer effect
  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  // Shimmer effect component
  const Shimmer = () => (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header skeleton */}
      <View style={styles.header}>
        <View>
          <View style={[styles.textLine, { width: 120, height: 14 }]} />
          <Shimmer />
          <View
            style={[styles.textLine, { width: 150, height: 20, marginTop: 8 }]}
          />
          <Shimmer />
        </View>
        <View style={styles.headerIcons}>
          <View style={styles.iconButton} />
          <Shimmer />
          <View style={styles.iconButton} />
          <Shimmer />
        </View>
      </View>

      <View style={styles.content}>
        {/* Fuel Status Card skeleton */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceBackground}>
            <View style={[styles.textLine, { width: 100, height: 14 }]} />
            <Shimmer />
            <View
              style={[
                styles.textLine,
                { width: 200, height: 32, marginTop: 8 },
              ]}
            />
            <Shimmer />
            <View
              style={[
                styles.textLine,
                { width: 150, height: 12, marginTop: 4 },
              ]}
            />
            <Shimmer />
          </View>
        </View>

        {/* Main Actions skeleton */}
        <View style={styles.actionsContainer}>
          <View style={[styles.textLine, { width: 80, height: 16 }]} />
          <Shimmer />

          <View style={styles.buttonRow}>
            <View style={[styles.actionButton, styles.dispenseButtonBg]} />
            <Shimmer />
            <View style={[styles.actionButton, styles.buyButtonBg]} />
            <Shimmer />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#F9FAFB',
  },
  textLine: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    width: 38,
    height: 38,
    borderRadius: 8,
    marginLeft: 12,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  balanceBackground: {
    padding: 20,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    borderRadius: 12,
    width: '48%',
    height: 100,
    backgroundColor: '#E5E7EB',
  },
  dispenseButtonBg: {
    backgroundColor: '#E5E7EB',
  },
  buyButtonBg: {
    backgroundColor: '#E5E7EB',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
