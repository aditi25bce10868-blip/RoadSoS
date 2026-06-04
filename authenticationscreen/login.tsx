import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthInput } from '../../components/ui/Input';
import { AuthButton } from '../../components/ui/Button';
import { SocialButton } from '../../components/ui/Button';
import { SOSLogo } from '../../components/sos/SOSLogo';
import { LoginBackground } from '../../components/layout/LoginBackground';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // TODO: Connect to authApi.login(email, password)
      await new Promise((res) => setTimeout(res, 1500)); // placeholder
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Connect to Google OAuth
    Alert.alert('Google Login', 'Coming soon');
  };

  const handleAppleLogin = async () => {
    // TODO: Connect to Apple OAuth
    Alert.alert('Apple Login', 'Coming soon');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginBackground />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Branding */}
          <View style={styles.brandSection}>
            <SOSLogo />
            <Text style={styles.appName}>{STRINGS.APP_NAME}</Text>
            <Text style={styles.tagline}>{STRINGS.TAGLINE}</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{STRINGS.LOGIN_TITLE}</Text>
            <Text style={styles.cardSubtitle}>{STRINGS.LOGIN_SUBTITLE}</Text>

            <AuthInput
              placeholder={STRINGS.EMAIL_PLACEHOLDER}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                setErrors((e) => ({ ...e, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail-outline"
              error={errors.email}
            />

            <AuthInput
              placeholder={STRINGS.PASSWORD_PLACEHOLDER}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                setErrors((e) => ({ ...e, password: undefined }));
              }}
              secureTextEntry
              iconName="lock-closed-outline"
              error={errors.password}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password' as any)}
            >
              <Text style={styles.forgotPasswordText}>{STRINGS.FORGOT_PASSWORD}</Text>
            </TouchableOpacity>

            <AuthButton
              title={loading ? '' : STRINGS.LOGIN_BUTTON}
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            >
              {loading && <ActivityIndicator color="#fff" />}
            </AuthButton>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>{STRINGS.NO_ACCOUNT} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signupLink}>{STRINGS.SIGN_UP}</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{STRINGS.OR_CONTINUE_WITH}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <SocialButton
                provider="google"
                label={STRINGS.GOOGLE}
                onPress={handleGoogleLogin}
                style={styles.socialButton}
              />
              <SocialButton
                provider="apple"
                label={STRINGS.APPLE}
                onPress={handleAppleLogin}
                style={[styles.socialButton, styles.appleButton]}
              />
            </View>
          </View>

          {/* Privacy Notice */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyIcon}>📍</Text>
            <Text style={styles.privacyText}>{STRINGS.LOCATION_NOTICE}</Text>
          </View>

          <Text style={styles.termsText}>
            {STRINGS.TERMS_PREFIX}{' '}
            <Text style={styles.termsLink}>{STRINGS.TERMS_OF_SERVICE}</Text>
            {' '}{STRINGS.AND}{' '}
            <Text style={styles.termsLink}>{STRINGS.PRIVACY_POLICY}</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 16,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  appleButton: {
    backgroundColor: COLORS.textPrimary,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  privacyIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  privacyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  termsLink: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
