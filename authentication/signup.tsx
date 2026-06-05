import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import AuthBackground from '../../components/auth/AuthBackground';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import OTPInput from '../../components/auth/OTPInput';
import PhoneInput from '../../components/auth/PhoneInput';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/colors';
import Strings from '../../constants/strings';
import { FontSize, FontWeight, Spacing, Radius, Shadow } from '../../constants/theme';
import { validateSignupForm, SignupErrors } from '../../utils/validators';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 7) {
      setErrors((e) => ({ ...e, phone: 'Enter a valid phone number' }));
      return;
    }
    setErrors((e) => ({ ...e, phone: undefined }));
    setVerifyLoading(true);
    try {
      // TODO: call API to send OTP
      await new Promise((r) => setTimeout(r, 800));
      setOtpSent(true);
    } catch {
      Alert.alert('Error', 'Could not send OTP. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleOTPComplete = async (otp: string) => {
    // TODO: verify OTP with API
    await new Promise((r) => setTimeout(r, 500));
    setPhoneVerified(true);
    setOtpSent(false);
  };

  const handleResendOTP = async () => {
    // TODO: resend OTP
  };

  const handleCreateAccount = async () => {
    const validationErrors = validateSignupForm({
      fullName,
      phone,
      email,
      password,
      confirmPassword,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (!phoneVerified) {
      Alert.alert('Phone Not Verified', 'Please verify your phone number first.');
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // TODO: call signup API
      await new Promise((r) => setTimeout(r, 1200));
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Signup Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground showLogo>
      {/* Back to login */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
        <Text style={styles.backText}>{Strings.signup.backToLogin}</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.title}>{Strings.signup.title}</Text>
      <Text style={styles.subtitle}>{Strings.signup.subtitle}</Text>

      {/* Form */}
      <View style={styles.form}>
        {/* Full Name */}
        <Input
          icon="person-outline"
          placeholder={Strings.signup.fullNamePlaceholder}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          error={errors.fullName}
        />

        {/* Phone */}
        <PhoneInput
          value={phone}
          onChangeText={setPhone}
          onVerify={handleSendOTP}
          error={errors.phone}
          isVerified={phoneVerified}
          verifyLoading={verifyLoading}
        />

        {/* OTP panel — shown after Verify tapped */}
        {otpSent && !phoneVerified && (
          <View style={styles.otpCard}>
            <OTPInput
              onComplete={handleOTPComplete}
              onResend={handleResendOTP}
            />
          </View>
        )}

        {/* Email */}
        <Input
          icon="mail-outline"
          placeholder={Strings.signup.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* Password */}
        <Input
          icon="lock-closed-outline"
          placeholder={Strings.signup.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          isPassword
          error={errors.password}
        />

        {/* Confirm Password */}
        <Input
          icon="lock-closed-outline"
          placeholder={Strings.signup.confirmPasswordPlaceholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          error={errors.confirmPassword}
        />

        {/* Create Account button */}
        <Button
          label={Strings.signup.createAccountButton}
          onPress={handleCreateAccount}
          loading={loading}
          style={styles.createBtn}
        />
      </View>

      {/* Social + legal */}
      <SocialLoginButtons
        onGooglePress={() => {/* TODO */}}
        onApplePress={() => {/* TODO */}}
        onTermsPress={() => {/* TODO */}}
        onPrivacyPress={() => {/* TODO */}}
      />
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: 0,
  },
  otpCard: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  createBtn: {
    width: '100%',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
});
