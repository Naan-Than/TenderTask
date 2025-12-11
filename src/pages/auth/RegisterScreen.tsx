import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { setIsloggedIn, setUserProfileData } from '../../store/slice/authSlice';
import AppStrings from '../../constants/appStrings';
import { ToastMessage } from '../../constants/TostMessages';
import { saveUser } from '../../store/slice/registerSlice';
import { wait } from '../../util/utils';

interface ValidationErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const RegisterScreen = (props: any) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [nameFocused, setNameFocused] = useState<boolean>(false);
    const [emailFocused, setEmailFocused] = useState<boolean>(false);
    const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState<boolean>(false);

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

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordError = validatePassword(password);
            if (passwordError) {
                newErrors.password = passwordError;
            }
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) {
            return;
        }

        setIsLoading(true);

        try {
            const user = { name, email, password };
            await wait(1500);
            dispatch(saveUser(user));
            dispatch(setUserProfileData(user));
            dispatch(setIsloggedIn(true));
            ToastMessage.Custom('success', 'Registration Successful');
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            ToastMessage.Custom("error", "Registration failed!");
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
                        <Icon name="person-add" size={40} color="#fff" />
                    </View>
                    <Text style={styles.title}>{AppStrings.createAccount}</Text>
                    <Text style={styles.subtitle}>{AppStrings.signUpToGetStarted}</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{AppStrings.fullName}</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                nameFocused && styles.inputWrapperFocused,
                                errors.name && styles.inputWrapperError,
                            ]}
                        >
                            <Feather
                                name="user"
                                size={20}
                                color={nameFocused ? AppStrings.appColor : AppStrings.graySix}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder={AppStrings.enterFullName}
                                placeholderTextColor={AppStrings.grayNine}
                                value={name}
                                onChangeText={(text) => {
                                    setName(text);
                                    if (errors.name) {
                                        setErrors({ ...errors, name: undefined });
                                    }
                                }}
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                                autoCapitalize="words"
                                autoComplete="name"
                                autoCorrect={false}
                            />
                        </View>
                        {errors.name && (
                            <View style={styles.errorContainer}>
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={16}
                                    color={AppStrings.red}
                                    style={styles.errorIcon}
                                />
                                <Text style={styles.errorText}>{errors.name}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>{AppStrings.emailAddress}</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                emailFocused && styles.inputWrapperFocused,
                                errors.email && styles.inputWrapperError,
                            ]}
                        >
                            <Feather
                                name="mail"
                                size={20}
                                color={emailFocused ? AppStrings.appColor : AppStrings.graySix}
                            />
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
                        <View
                            style={[
                                styles.inputWrapper,
                                passwordFocused && styles.inputWrapperFocused,
                                errors.password && styles.inputWrapperError,
                            ]}
                        >
                            <Feather
                                name="lock"
                                size={20}
                                color={passwordFocused ? AppStrings.appColor : AppStrings.graySix}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
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
                                    color="#ff3b30"
                                    style={styles.errorIcon}
                                />
                                <Text style={styles.errorText}>{errors.password}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                confirmPasswordFocused && styles.inputWrapperFocused,
                                errors.confirmPassword && styles.inputWrapperError,
                            ]}
                        >
                            <Feather
                                name="lock"
                                size={20}
                                color={confirmPasswordFocused ? AppStrings.appColor : AppStrings.graySix}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor={AppStrings.grayNine}
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (errors.confirmPassword) {
                                        setErrors({ ...errors, confirmPassword: undefined });
                                    }
                                }}
                                onFocus={() => setConfirmPasswordFocused(true)}
                                onBlur={() => setConfirmPasswordFocused(false)}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Feather
                                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                                    size={20}
                                    color={AppStrings.graySix}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.confirmPassword && (
                            <View style={styles.errorContainer}>
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={16}
                                    color="#ff3b30"
                                    style={styles.errorIcon}
                                />
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>{AppStrings.haveAccount} </Text>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Text style={styles.signUpLink}>{AppStrings.signIn}</Text>
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
        backgroundColor: '#fff',
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
        color: AppStrings.graySix,
    },
    formContainer: {
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
    },
    inputWrapperError: {
        borderColor: '#ff3b30',
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
        color: '#ff3b30',
        fontSize: 13,
        flex: 1,
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

export default RegisterScreen;