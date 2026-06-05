import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Colors from '../../constants/colors';
import { Radius, FontSize, FontWeight, Shadow, Spacing } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[variant],
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? Colors.white : Colors.primary} />
      ) : (
        <View style={styles.inner}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles], textStyle]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: Spacing.sm,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Shadow.button,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },

  // Labels
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.2,
  },
  label_primary: {
    color: Colors.white,
  },
  label_secondary: {
    color: Colors.textPrimary,
  },
  label_outline: {
    color: Colors.primary,
  },
  label_ghost: {
    color: Colors.textSecondary,
  },

  disabled: {
    opacity: 0.5,
  },
});

export default Button;
