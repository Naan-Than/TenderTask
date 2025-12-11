import React, { use, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { setIsloggedIn, setUserProfileData } from '../../store/slice/authSlice';
import AppStrings from '../../constants/appStrings';
import { ToastMessage } from '../../constants/TostMessages';
import App from '../../../App';
import { wait } from '../../util/utils';


interface ValidationErrors {
  email?: string;
  password?: string;
}

const LoginScreen = (props: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const registeredUsers = useSelector((state: any) => state.register.registeredUsers);

  const dispatch = useDispatch();
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }

    return null;
  };


  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!email.trim()) {
      newErrors.email = AppStrings.emailIsRequired;
    } else if (!validateEmail(email)) {
      newErrors.email = AppStrings.pleaseEnterValidEmail;
    }

    if (!password) {
      newErrors.password = AppStrings.passwordIsRequired;
    } else {
      const passwordError = validatePassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await wait(1500);
      if (!registeredUsers || registeredUsers.length === 0) {
        ToastMessage.Custom("error", "No registered users found. Please register first.");
        setIsLoading(false);
        return;
      }
      const existingUser = registeredUsers.find(
        user => user?.email === email && user?.password === password
      );

      if (!existingUser) {
        ToastMessage.Custom("error", "Invalid email or password");
        setIsLoading(false);
        return;
      }

      dispatch(setUserProfileData(existingUser));
      dispatch(setIsloggedIn(true));
      ToastMessage.Custom('success', 'Login Successful');
      setEmail('');
      setPassword('');
      setErrors({});
    } catch (error) {
      ToastMessage.Custom('error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="task-alt" size={40} color="#fff" />
          </View>
          <Text style={styles.title}>{AppStrings.welcomeBack}</Text>
          <Text style={styles.subtitle}>{AppStrings.signInToYourAccount}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{AppStrings.emailAddress}</Text>
            <View style={[
              styles.inputWrapper,
              emailFocused && styles.inputWrapperFocused,
              errors.email && styles.inputWrapperError
            ]}>
              <Feather name="mail" size={20} color={AppStrings.graySix} />
              <TextInput
                style={styles.input}
                placeholder={AppStrings.enterEmail}
                placeholderTextColor={AppStrings.grayNine}
                value={email}
                onChangeText={(text) => {
                  setEmail(text.toLowerCase().trim());
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color={AppStrings.red}
                  style={styles.errorIcon}
                />
                <Text style={styles.errorText}>{errors.email}</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{AppStrings.password}</Text>
            <View style={[
              styles.inputWrapper,
              passwordFocused && styles.inputWrapperFocused,
              errors.password && styles.inputWrapperError
            ]}>
              <Feather name="lock" size={20}
                color={passwordFocused ? AppStrings.appColor : AppStrings.graySix} />
              <TextInput
                style={styles.input}
                placeholder={AppStrings.enterPassword}
                placeholderTextColor={AppStrings.grayNine}
                value={password}

                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color={AppStrings.graySix}
                />

              </TouchableOpacity>
            </View>

            {errors.password && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color={AppStrings.red}
                  style={styles.errorIcon}
                />

                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            )}
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>{AppStrings.forgotPassword}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{AppStrings.signIn}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>{AppStrings.dontHaveAccount} </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUpLink}>{AppStrings.signUp}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStrings.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AppStrings.appColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: AppStrings.appColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: AppStrings.white,
    borderRadius: 16,
    padding: 24,
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 14,
    backgroundColor: '#ffffff61',
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: AppStrings.appColor,
    backgroundColor: AppStrings.white,
  },
  inputWrapperError: {
    borderColor: AppStrings.red,
    backgroundColor: '#fff5f5',
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    marginLeft: 10,
    color: '#1a1a1a',
  },
  eyeIcon: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  errorText: {
    color: AppStrings.red,
    fontSize: 13,
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: AppStrings.appColor,
    fontWeight: '600',
  },
  button: {
    backgroundColor: AppStrings.appColor,
    borderRadius: 40,
    padding: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: AppStrings.appColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 6,

  },
  buttonDisabled: {
    backgroundColor: '#b3d9ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: AppStrings.grayNine,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: AppStrings.graySix,
  },
  signUpLink: {
    fontSize: 14,
    color: AppStrings.appColor,
    fontWeight: '700',
  },
});

export default LoginScreen;