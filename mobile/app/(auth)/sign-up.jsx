
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { styles } from '@/assets/styles/auth.styles.js'
import { COLORS } from '@/constants/colors.js'
import { Image } from "expo-image";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        setError('')

        if (!emailAddress.trim() || !password.trim()) {
            setError('Please enter both email and password.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            if (err.errors?.[0]?.code === 'form_identifier_exists') {
                setError('Email address already in use. Please use a different email.')
            } else {
                setError('An unexpected error occurred. Please try again later')
            }
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, surface a clear message
                // to the user describing next steps, but keep a debug
                // log for diagnostics.
                console.debug(JSON.stringify(signUpAttempt, null, 2))

                const status = signUpAttempt.status
                let message = 'Verification incomplete. Please check your email or contact support.'

                switch (status) {
                    case 'needs_verification':
                    case 'needs_email_verification':
                        message = 'Verification required — please check your email for a verification link or code. If you did not receive it, check your spam folder or request a new verification email.'
                        break
                    case 'needs_phone_verification':
                        message = 'Phone verification required — enter the code sent to your phone. If you did not receive a code, request a new one from the app.'
                        break
                    case 'requires_more_info':
                        message = 'Additional information required — please complete any missing fields in the signup form and try again.'
                        break
                    default:
                        break
                }
                setError(message)
            }
        } catch (err) {
            if (err.errors?.[0]?.code === 'form_verification_code_incorrect') {
                setError('Incorrect verification code. Please try again.')
            }
            else {
                setError('An unexpected error occurred. Please try again later')
            }
        }
    }

    if (pendingVerification) {
        return (
            <KeyboardAwareScrollView style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, }}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={100}>
                <View style={styles.verificationContainer}>
                    <Text style={styles.verificationTitle}>Verify your email</Text>

                    {error ? (<View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError('')}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>) : null}

                    <TextInput
                        style={[styles.verificationInput, error && styles.errorInput]}
                        value={code}
                        placeholder="Enter your verification code"
                        onChangeText={(code) => setCode(code)}
                    />
                    <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        )
    }

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}>

            <View style={styles.container}>
                <Image
                    source={require('@/assets/images/revenue-i2.png')}
                    style={styles.illustration}
                />

                <Text style={styles.title}>Create Account</Text>
                {error ? (<View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity onPress={() => setError('')}>
                        <Ionicons name="close" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>) : null}

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    placeholderTextColor='#90c4e8ff'
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor='#90c4e8ff'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/sign-in')}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Back to Sign In"
                    style={{ marginTop: 12 }}
                >

                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}