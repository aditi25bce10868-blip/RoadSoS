import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// ─── Auth Button (Primary gradient-style red button) ────────────────────────

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  disabled,
  style,
  children,
}) => (
  <TouchableOpacity
    style={[styles.authButton, disabled && styles.authButtonDisabled, style]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
  >
    {children ?? <Text style={styles.authButtonText}>{title}</Text>}
  </TouchableOpacity>
);

// ─── Social Button (Google / Apple) ─────────────────────────────────────────

type SocialProvider = 'google' | 'apple';

interface SocialButtonProps {
  provider: SocialProvider;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  label,
  onPress,
  style,
}) => {
  const isApple = provider === 'apple';

  return (
    <TouchableOpacity
      style={[styles.socialButton, isApple && styles.socialButtonApple, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {provider === 'google' ? (
        // Google "G" rendered via SVG-like text approach
        <View style={styles.googleIcon}>
          <Text style={styles.googleIconText}>G</Text>
        </View>
      ) : (
        <Ionicons name="logo-apple" size={18} color="#fff" style={styles.socialIcon} />
      )}
      <Text style={[styles.socialButtonText, isApple && styles.socialButtonTextApple]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Auth Button
  authButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Social Button
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  socialButtonApple: {
    backgroundColor: COLORS.textPrimary,
    borderColor: COLORS.textPrimary,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  socialButtonTextApple: {
    color: '#fff',
  },
  socialIcon: {
    marginRight: 2,
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4285F4',
    lineHeight: 14,
  },
});
