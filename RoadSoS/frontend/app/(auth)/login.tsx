import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

import AuthBackground from '../../components/auth/AuthBackground';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Colors from '../../constants/color';
import Strings from '../../constants/strings';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';
import { validateLoginForm } from '../../utils/validators';
import { storage } from '../../utils/storage';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Please check your credentials and try again.');
        return;
      }
      // Mark user as logged in for session routing
      await storage.setItem('isLoggedIn', 'true');
      const onboardingDone = await storage.getItem('onboardingDone');
      if (onboardingDone === 'true') {
        router.replace('/(tabs)/sos');
      } else {
        router.replace('/onboarding');
      }
    } catch {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground showLogo>
      {/* Header */}
      <Text style={styles.title}>{Strings.login.title}</Text>
      <Text style={styles.subtitle}>{Strings.login.subtitle}</Text>

      <View style={styles.form}>
        {/* Email */}
        <Input
          icon="mail-outline"
          placeholder={Strings.login.emailPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        {/* Password */}
        <Input
          icon="lock-closed-outline"
          placeholder={Strings.login.passwordPlaceholder}
          value={password}
          onChangeText={setPassword}
          isPassword
          error={errors.password}
        />

        {/* Forgot password */}
        <TouchableOpacity
          style={styles.forgotRow}
          onPress={() => router.push('/(auth)/forgot-password' as any)}
        >
          <Text style={styles.forgotText}>{Strings.login.forgotPassword}</Text>
        </TouchableOpacity>

        {/* Login button */}
        <Button
          label={Strings.login.loginButton}
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.noAccountText}>{Strings.login.noAccount} </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>{Strings.login.signUp}</Text>
          </TouchableOpacity>
        </View>
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
  forgotRow: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.lg,
    marginTop: -Spacing.xs,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  loginBtn: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAccountText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});
