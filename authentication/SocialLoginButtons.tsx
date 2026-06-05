import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import Strings from '../../constants/strings';
import { FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';

interface SocialLoginButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onApplePress,
  onTermsPress,
  onPrivacyPress,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{Strings.social.orContinueWith}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {/* Google */}
        <TouchableOpacity
          style={[styles.socialBtn, styles.googleBtn]}
          onPress={onGooglePress}
          activeOpacity={0.8}
        >
          {/* Google G icon via SVG-style colored letters */}
          <View style={styles.googleIconWrap}>
            <Text style={styles.googleG}>G</Text>
          </View>
          <Text style={styles.googleLabel}>{Strings.social.google}</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          style={[styles.socialBtn, styles.appleBtn]}
          onPress={onApplePress}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-apple" size={18} color={Colors.white} style={styles.appleIcon} />
          <Text style={styles.appleLabel}>{Strings.social.apple}</Text>
        </TouchableOpacity>
      </View>

      {/* Location privacy note */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.locationText}>{Strings.legal.locationPrivacy}</Text>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        {Strings.legal.termsPrefix}
        <Text style={styles.termsLink} onPress={onTermsPress}>
          {Strings.legal.termsLink}
        </Text>
        {Strings.legal.andText}
        <Text style={styles.termsLink} onPress={onPrivacyPress}>
          {Strings.legal.privacyLink}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  socialBtn: {
    flex: 1,
    height: 50,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Google
  googleBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  googleIconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    // Multi-color G approximation
    color: '#4285F4',
  },
  googleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },

  // Apple
  appleBtn: {
    backgroundColor: Colors.appleBg,
  },
  appleIcon: {
    marginRight: 2,
  },
  appleLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  locationText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },

  // Terms
  terms: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
  },
});

export default SocialLoginButtons;
