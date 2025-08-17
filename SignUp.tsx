import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, 
  SafeAreaView, ScrollView, Animated, Pressable, TextInput, Alert, Vibration } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './App';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState, useEffect } from "react";
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

// Responsive scaling functions
const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

type SignUpNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function SignUp() {
  const navigation = useNavigation<SignUpNavigationProp>();
  const allyScaleAnim = React.useRef(new Animated.Value(1)).current;
  const [firstName, setFirstName] = React.useState('');
  const [surname, setSurname] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [contact, setContact] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [firstNameError, setFirstNameError] = React.useState('');
  const [surnameError, setSurnameError] = React.useState('');
  const [dobError, setDobError] = React.useState('');
  const [genderError, setGenderError] = React.useState('');
  const [contactError, setContactError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  const [isButtonHovered, setIsButtonHovered] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  // DateTimePicker state
  const [date, setDate] = React.useState(new Date());
  const [showPicker, setShowPicker] = React.useState(false);
  // Verification state
  const [showVerification, setShowVerification] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [verificationError, setVerificationError] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isCheckingVerification, setIsCheckingVerification] = React.useState(false);
  const [signUpUsername, setSignUpUsername] = React.useState('');
  const [signUpPassword, setSignUpPassword] = React.useState(''); // Store password for sign-in after verification

  const validatePassword = (password: string) => {
    const minLength = password.length >= 10;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?!]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const triggerErrorVibration = () => {
    // Stronger vibration pattern: longer vibration, pause, longer vibration (error pattern)
    Vibration.vibrate([200, 300, 200]);
  };

  const handleAllyPressIn = () => {
    Animated.spring(allyScaleAnim, {
      toValue: 1.18,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };
  const handleAllyPressOut = () => {
    Animated.spring(allyScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleSignUp = async () => {
    // Reset all errors
    setFirstNameError('');
    setSurnameError('');
    setDobError('');
    setGenderError('');
    setContactError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate each field
    let hasErrors = false;

    if (!firstName.trim()) {
      setFirstNameError('Enter First name');
      hasErrors = true;
    }

    if (!surname.trim()) {
      setSurnameError('Enter Surname');
      hasErrors = true;
    }

    if (!dob.trim()) {
      setDobError('Enter Date of birth (DD/MM/YYYY)');
      hasErrors = true;
    }

    if (!gender) {
      setGenderError('Select a Gender');
      hasErrors = true;
    }

    if (!contact.trim()) {
      setContactError('Enter your email address');
      hasErrors = true;
    } else if (!contact.includes('@')) {
      setContactError('Please enter a valid email address');
      hasErrors = true;
    }

    // Phone number is optional, but if provided, validate format
    if (phoneNumber.trim() && !phoneNumber.startsWith('+61')) {
      setPhoneError('Please enter a valid Australian phone number (+61 format)');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Enter New password');
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password needs minimum 10 characters, 1 uppercase, 1 lowercase, 1 number and a special character (@#$%^&*()_+-=[]{}|;:,.<>?!)');
      hasErrors = true;
    } else {
      setPasswordError(''); // Clear error if password meets requirements
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Enter Confirm password');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      setPasswordError('Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) {
      // Trigger vibration when there are validation errors
      triggerErrorVibration();
      return;
    }

    setIsLoading(true);

    try {
      // Use email as the primary identifier for Cognito
      const username = contact; // Email will be the username
      
      const signUpResult = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: contact, // Email is required
            phone_number: phoneNumber.trim() || undefined, // Phone is optional
            given_name: firstName,
            family_name: surname,
          },
          autoSignIn: true,
        },
      });

      // Store the username and password for verification and sign-in
      setSignUpUsername(username);
      setSignUpPassword(password);
      setShowVerification(true);
      
      Alert.alert(
        'Verification Required',
        'Your account has been created successfully! Please check your email for a verification code to complete your registration.',
        [
          {
            text: 'OK',
            onPress: () => {}, // Don't navigate, stay on the form
          },
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = 'An error occurred during sign up.';
      
      if (error.name === 'UsernameExistsException') {
        errorMessage = 'An account with this email/phone already exists.';
      } else if (error.name === 'InvalidPasswordException') {
        errorMessage = 'Password does not meet requirements.';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Please check your input and try again.';
      }
      
      Alert.alert('Sign Up Error', errorMessage);
      triggerErrorVibration(); // Vibrate for sign-up API error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // keep open on iOS, close on Android
    if (selectedDate) {
      setDate(selectedDate);
      // Format date as DD/MM/YYYY
      const formatted = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth()+1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setDob(formatted);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Please enter the verification code');
      triggerErrorVibration(); // Vibrate for verification error
      return;
    }

    setIsVerifying(true);
    setVerificationError('');

    try {
      await confirmSignUp({
        username: signUpUsername,
        confirmationCode: verificationCode.trim(),
      });

      // Check verification status silently
      setIsCheckingVerification(true);

      // Account verified successfully - show congratulations and navigate to login
      console.log('✅ User verification successful for:', signUpUsername);
      console.log('✅ User status in Cognito: CONFIRMED');
      
      setShowVerification(false);
      setVerificationCode('');
      setSignUpUsername('');
      setSignUpPassword('');
      setIsCheckingVerification(false);
      
      Alert.alert(
        '🎉 Congratulations!',
        'You have created your Ally account! Click below to log in.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );

    } catch (error: any) {
      console.error('Verification error:', error);
      
      let errorMessage = 'An error occurred during verification.';
      
      if (error.name === 'CodeMismatchException') {
        errorMessage = 'Wrong code. Please check your email and try again.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Account is already confirmed or verification is not required.';
      }
      
      setVerificationError(errorMessage);
      triggerErrorVibration(); // Vibrate for verification API error
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            <Pressable
              onPressIn={handleAllyPressIn}
              onPressOut={handleAllyPressOut}
              onHoverIn={handleAllyPressIn}
              onHoverOut={handleAllyPressOut}
              style={{ alignSelf: 'center' }}
            >
              <Animated.Text style={[styles.allyWordLarge, { transform: [{ scale: allyScaleAnim }] }]}>Ally</Animated.Text>
            </Pressable>
          </Text>
          <Text style={styles.signupSubtitle}>Create a new Account</Text>
          <View style={styles.signupForm}>
            <View style={styles.nameRow}>
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={[styles.input, styles.nameInput]}
                  placeholder="First name"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
              </View>
              <View style={styles.nameInputContainer}>
                <TextInput
                  style={[styles.input, styles.nameInput, { marginRight: 0 }]}
                  placeholder="Surname"
                  placeholderTextColor="#999"
                  value={surname}
                  onChangeText={setSurname}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {surnameError ? <Text style={styles.errorText}>{surnameError}</Text> : null}
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Date of birth (DD/MM/YYYY)"
              placeholderTextColor="#999"
              value={dob}
              onChangeText={setDob}
              autoCapitalize="none"
              autoCorrect={false}
              onPressIn={() => setShowPicker(true)}
            />
            {dobError ? <Text style={styles.errorText}>{dobError}</Text> : null}
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender:</Text>
              <View style={styles.genderOptions}>
                <Pressable
                  style={[
                    styles.genderOption,
                    gender === 'Male' && styles.genderOptionSelected
                  ]}
                  onPress={() => setGender('Male')}
                >
                  <Text style={[
                    styles.genderOptionText,
                    gender === 'Male' && styles.genderOptionTextSelected
                  ]}>Male</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.genderOption,
                    gender === 'Feminine' && styles.genderOptionSelected
                  ]}
                  onPress={() => setGender('Feminine')}
                >
                  <Text style={[
                    styles.genderOptionText,
                    gender === 'Feminine' && styles.genderOptionTextSelected
                  ]}>Feminine</Text>
                </Pressable>
              </View>
            </View>
            {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              value={contact}
              onChangeText={setContact}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            {contactError ? <Text style={styles.errorText}>{contactError}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number (optional)"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
              />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
              />
            </View>
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            <Pressable
              onPress={handleSignUp}
              onHoverIn={() => setIsButtonHovered(true)}
              onHoverOut={() => setIsButtonHovered(false)}
              style={({ pressed }) => [styles.signupButton, pressed && { opacity: 0.9 }]}
              disabled={isLoading}
            >
              <Text style={[
                styles.signupButtonText,
                isButtonHovered && { color: '#cccccc' }
              ]}>
                {isLoading ? 'Signing Up...' : 'Sign up'}
              </Text>
            </Pressable>

            {/* Verification Section */}
            {showVerification && (
              <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Enter Verification Code</Text>
                <Text style={styles.verificationSubtitle}>
                  Please enter the verification code sent to your email address.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter verification code"
                  placeholderTextColor="#999"
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}
                <Pressable
                  onPress={handleVerification}
                  style={({ pressed }) => [styles.signupButton, pressed && { opacity: 0.9 }]}
                  disabled={isVerifying || isCheckingVerification}
                >
                  <Text style={styles.signupButtonText}>
                    {isVerifying ? 'Verifying...' : isCheckingVerification ? 'Checking Status...' : 'Verify Code'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footbar}>
        <Text style={styles.footbarText}>© 2025 Ally</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae7f7',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
    marginTop: isTablet ? 32 : 24,
    marginBottom: isTablet ? 32 : 24,
  },
  allyWordLarge: {
    fontSize: isTablet ? 90 : 56,
    fontWeight: 'bold',
    color: '#6426A9',
    lineHeight: isTablet ? 100 : 64,
    letterSpacing: 2,
    textAlign: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: isTablet ? 60 : 40,
  },
  avatarContainer: {
    width: isTablet ? 120 : 80,
    height: isTablet ? 120 : 80,
    borderRadius: isTablet ? 60 : 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 24 : 16,
  },
  avatarText: {
    fontSize: isTablet ? 48 : 32,
    fontWeight: 'bold' as const,
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: isTablet ? 36 : moderateScale(24),
    fontWeight: 'bold' as const,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: isTablet ? 8 : 4,
  },
  subtitle: {
    fontSize: isTablet ? 20 : moderateScale(16),
    color: '#666666',
    textAlign: 'center',
  },
  infoSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : moderateScale(18),
    fontWeight: 600 as const,
    color: '#1A1A1A',
    marginBottom: isTablet ? 24 : 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 24 : 16,
    marginBottom: isTablet ? 16 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: isTablet ? 16 : moderateScale(14),
    color: '#666666',
    marginBottom: isTablet ? 8 : 4,
  },
  infoValue: {
    fontSize: isTablet ? 18 : moderateScale(16),
    fontWeight: 600 as const,
    color: '#1A1A1A',
  },
  footbar: {
    width: '100%',
    backgroundColor: '#6426A9',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footbarText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 12,
    fontWeight: '500',
    letterSpacing: 1,
  },
  signupSubtitle: {
    color: '#6426A9',
    fontSize: isTablet ? 22 : 15,
    textAlign: 'center',
    marginBottom: isTablet ? 32 : 20,
    fontWeight: '500',
    letterSpacing: 1,
  },
  signupForm: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: isTablet ? 24 : 16,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 18 : 12,
    fontSize: isTablet ? 15 : 13,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    color: '#6426A9',
  },
  signupButton: {
    backgroundColor: '#002a2d',
    borderRadius: 8,
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 40 : 32, // increased horizontal padding
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#002a2d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 13,
    letterSpacing: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nameInputContainer: {
    flex: 1,
  },
  nameInput: {
    flex: 0.48,
    marginRight: 6,
    paddingVertical: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 12 : 8,
    fontSize: isTablet ? 15 : 13,
    width: '100%',
    marginBottom: 12, // match the regular input margin
    marginHorizontal: 3,
  },
  genderContainer: {
    width: '100%',
    marginBottom: 12,
  },
  genderLabel: {
    fontSize: isTablet ? 15 : 13,
    color: '#6426A9',
    fontWeight: '500',
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: isTablet ? 10 : 8,
    paddingHorizontal: isTablet ? 12 : 8,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  genderOptionSelected: {
    backgroundColor: '#6426A9',
    borderColor: '#6426A9',
  },
  genderOptionText: {
    fontSize: isTablet ? 15 : 13,
    color: '#999',
    fontWeight: '500',
  },
  genderOptionTextSelected: {
    color: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    marginBottom: 12,
    height: isTablet ? 56 : 48,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: isTablet ? 18 : 12,
    fontSize: isTablet ? 15 : 13,
    color: '#6426A9',
    height: '100%',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: isTablet ? 12 : 10,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  verificationContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0d6ef',
    width: '100%',
  },
  verificationTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#6426A9',
    textAlign: 'center',
    marginBottom: 8,
  },
  verificationSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: isTablet ? 20 : 16,
  },
}); 