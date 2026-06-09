import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/color';
import { Radius, FontSize, Spacing, FontWeight } from '../../constants/theme';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onVerify: () => void;
  countryCode?: string;
  countryFlag?: string;
  error?: string;
  isVerified?: boolean;
  verifyLoading?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onVerify,
  countryCode = '+1',
  countryFlag = 'US',
  error,
  isVerified = false,
  verifyLoading = false,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          focused && styles.focused,
          !!error && styles.errorBorder,
        ]}
      >
        {/* Country picker */}
        <TouchableOpacity style={styles.countryBtn} activeOpacity={0.7}>
          <Ionicons name="call-outline" size={17} color={Colors.textMuted} />
          <Text style={styles.countryText}>{countryFlag} {countryCode}</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Phone input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Phone Number"
          placeholderTextColor={Colors.textMuted}
          keyboardType="phone-pad"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Verify button */}
        {!isVerified && (
          <TouchableOpacity
            onPress={onVerify}
            activeOpacity={0.85}
            style={styles.verifyBtn}
            disabled={verifyLoading}
          >
            <Text style={styles.verifyText}>
              {verifyLoading ? '...' : 'Verify'}
            </Text>
          </TouchableOpacity>
        )}

        {isVerified && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={Colors.success}
            style={{ marginLeft: Spacing.xs }}
          />
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    height: 56,
    paddingRight: Spacing.xs,
    overflow: 'hidden',
  },
  focused: {
    borderColor: Colors.primary,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  countryText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    marginRight: 4,
  },
  verifyText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  error: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.error,
  },
});

export default PhoneInput;
