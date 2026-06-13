import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LoginBackground: React.FC = () => (
  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
    {/* Top-left warm pink blob */}
    <View style={[styles.blob, styles.blobTopLeft]} />
    {/* Top-right blue blob */}
    <View style={[styles.blob, styles.blobTopRight]} />
    {/* Bottom center subtle blob */}
    <View style={[styles.blob, styles.blobBottom]} />
  </View>
);

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  blobTopLeft: {
    width: width * 0.65,
    height: width * 0.65,
    backgroundColor: '#ffb3c1',
    top: -width * 0.2,
    left: -width * 0.25,
  },
  blobTopRight: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#b3c8f5',
    top: height * 0.05,
    right: -width * 0.25,
  },
  blobBottom: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#c7f0e8',
    bottom: -width * 0.15,
    left: width * 0.25,
    opacity: 0.2,
  },
});
