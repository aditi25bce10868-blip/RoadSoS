import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Radius, FontSize, Spacing, FontWeight } from '../../constants/theme';

interface InputProps extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  icon,
  error,
  containerStyle,
  rightElement,
  isPassword = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View
        style={[
          styles.container,
          focused && styles.containerFocused,
          !!error && styles.containerError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.primary : Colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={isPassword && !secureVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setSecureVisible((v) => !v)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={secureVisible ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        )}
        {rightElement && !isPassword && (
          <View style={styles.rightEl}>{rightElement}</View>
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
    paddingHorizontal: Spacing.md,
  },
  containerFocused: {
    borderColor: Colors.primary,
  },
  containerError: {
    borderColor: Colors.error,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.regular,
  },
  eyeBtn: {
    padding: Spacing.xs,
  },
  rightEl: {
    marginLeft: Spacing.xs,
  },
  error: {
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.error,
  },
});

export default Input;
