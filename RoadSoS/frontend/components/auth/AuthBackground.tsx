import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/color';
import Strings from '../../constants/strings';
import { FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface AuthBackgroundProps {
  children: React.ReactNode;
  showLogo?: boolean;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({
  children,
  showLogo = true,
}) => {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Decorative gradient blobs */}
      <View style={styles.blobTopLeft} pointerEvents="none" />
      <View style={styles.blobBottomRight} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {showLogo && (
            <View style={styles.logoSection}>
              {/* Pulse rings behind icon */}
              <View style={styles.ringOuter} pointerEvents="none" />
              <View style={styles.ringInner} pointerEvents="none" />

              {/* SOS icon button */}
              <View style={styles.sosIconWrap}>
                <LinearGradient
                  colors={[Colors.primaryLight, Colors.primary]}
                  style={styles.sosIconGradient}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="radio-outline" size={30} color={Colors.white} />
                </LinearGradient>
              </View>

              <Text style={styles.appName}>{Strings.app.name}</Text>
              <Text style={styles.tagline}>{Strings.app.tagline}</Text>
            </View>
          )}

          {/* Card */}
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F3EFF8',
  },
  kav: {
    flex: 1,
  },
  scroll: {
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },

  // Blob decorations
  blobTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(232, 23, 58, 0.09)',
    transform: [{ scaleX: 1.4 }],
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(100, 80, 200, 0.06)',
    transform: [{ scaleY: 1.3 }],
  },

  // Logo section
  logoSection: {
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: Spacing.lg,
    position: 'relative',
  },
  ringOuter: {
    position: 'absolute',
    top: 58,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(232, 23, 58, 0.12)',
    backgroundColor: 'rgba(232, 23, 58, 0.04)',
  },
  ringInner: {
    position: 'absolute',
    top: 76,
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1,
    borderColor: 'rgba(232, 23, 58, 0.18)',
    backgroundColor: 'rgba(232, 23, 58, 0.07)',
  },
  sosIconWrap: {
    marginBottom: Spacing.md,
    zIndex: 10,
    ...Shadow.button,
  },
  sosIconGradient: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: FontSize.hero - 4,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginTop: Spacing.xs,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // Card
  card: {
    width: width - Spacing.xl * 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.card,
  },
});

export default AuthBackground;
