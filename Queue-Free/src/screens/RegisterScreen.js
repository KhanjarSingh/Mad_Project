import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Missing Info', 'Please fill all required fields');
            return;
        }
        try {
            setSubmitting(true);
            await register({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
        } catch (err) {
            Alert.alert('Registration Failed', err.message || 'Please try again');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join Queue-Free today</Text>

            <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

            <TouchableOpacity style={[styles.button, submitting && { opacity: 0.6 }]} onPress={handleRegister} disabled={submitting}>
                <Text style={styles.buttonText}>{submitting ? 'Creating…' : 'Create account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Have an account? Sign in</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'gray', marginBottom: 24 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
    button: { backgroundColor: '#4a90e2', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 4 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#4a90e2', textAlign: 'center', marginTop: 16 },
});



