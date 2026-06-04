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
import { SOSLogo } from '../../components/sos/SOSLogo';
import { LoginBackground } from '../../components/layout/LoginBackground';
import { COLORS } from '../../constants/colors';
import { STRINGS } from '../../constants/strings';
import { validateEmail, validatePassword, validateName } from '../../utils/validators';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSignup = async () => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError ?? undefined,
        email: emailError ?? undefined,
        password: passwordError ?? undefined,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // TODO: Connect to authApi.register(name, email, password)
      await new Promise((res) => setTimeout(res, 1500));
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Sign Up Failed', 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <View style={styles.brandSection}>
            <SOSLogo />
            <Text style={styles.appName}>{STRINGS.APP_NAME}</Text>
            <Text style={styles.tagline}>{STRINGS.TAGLINE}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{STRINGS.SIGNUP_TITLE}</Text>
            <Text style={styles.cardSubtitle}>{STRINGS.SIGNUP_SUBTITLE}</Text>

            <AuthInput
              placeholder={STRINGS.NAME_PLACEHOLDER}
              value={name}
              onChangeText={(val) => {
                setName(val);
                setErrors((e) => ({ ...e, name: undefined }));
              }}
              iconName="person-outline"
              error={errors.name}
            />

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

            <AuthButton
              title={loading ? '' : STRINGS.SIGNUP_BUTTON}
              onPress={handleSignup}
              disabled={loading}
              style={styles.signupButton}
            >
              {loading && <ActivityIndicator color="#fff" />}
            </AuthButton>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>{STRINGS.HAVE_ACCOUNT} </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>{STRINGS.LOGIN_LINK}</Text>
              </TouchableOpacity>
            </View>
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
  signupButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  termsLink: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
