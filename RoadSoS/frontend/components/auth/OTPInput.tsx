import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/color';
import Strings from '../../constants/strings';
import { Radius, FontSize, FontWeight, Spacing } from '../../constants/theme';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

interface OTPInputProps {
  onComplete?: (otp: string) => void;
  onResend?: () => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onComplete, onResend }) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (val: string, index: number) => {
    // Paste support
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, '').slice(0, OTP_LENGTH);
      const newOtp = Array(OTP_LENGTH).fill('');
      pasted.split('').forEach((ch, i) => { newOtp[i] = ch; });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, OTP_LENGTH - 1);
      inputs.current[nextFocus]?.focus();
      if (pasted.length === OTP_LENGTH) onComplete?.(pasted);
      return;
    }

    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }

      const filled = newOtp.join('');
      if (filled.length === OTP_LENGTH && !newOtp.includes('')) {
        onComplete?.(filled);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
    inputs.current[0]?.focus();
    onResend?.();
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{Strings.otp.title}</Text>
      <Text style={styles.subtitle}>{Strings.otp.subtitle}</Text>

      <View style={styles.boxes}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            style={[
              styles.box,
              digit ? styles.boxFilled : styles.boxEmpty,
              i === 0 && !digit ? styles.boxActive : null,
            ]}
            maxLength={6}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(v) => handleChange(v, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            textAlign="center"
            selectionColor={Colors.primary}
          />
        ))}
      </View>

      <View style={styles.resendRow}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendActive}>{Strings.otp.resendNow}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.resendTimer}>
            {Strings.otp.resendPrefix}
            <Text style={styles.resendCountdown}>{countdown}{Strings.otp.resendSuffix}</Text>
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  boxes: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  box: {
    width: 46,
    height: 54,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  boxEmpty: {
    borderColor: Colors.border,
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGlow,
  },
  boxActive: {
    borderColor: Colors.primary,
  },
  resendRow: {
    marginTop: Spacing.xs,
  },
  resendTimer: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  resendCountdown: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
  resendActive: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
});

export default OTPInput;
