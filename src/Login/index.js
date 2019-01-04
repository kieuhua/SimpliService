import React from 'react';
import { View, TextInput, Button, ActivityIndicator, Text, } from 'react-native';

const Login = ({ onPress, emailValue, passwordValue, onChange, loggingIn, hasError, errorMessage }) => {
    return (
        <View>
            <TextInput style={{width:150}}   autoCapitalize="none" autoCorrect={false} autoFocus value={emailValue}
                onChangeText={ e => onChange(e, 'email')} keyboardType="email-address" placeholder="khua@xfsi.com" />
            <TextInput autoCapitalize="none" autoCorrect={false} secureTextEntry value={passwordValue}
                onChangeText={e => onChange(e, 'password')} placeholder="Password" />
            <Button title="Login" onPress={onPress} />
            {loggingIn && <ActivityIndicator size="large" /> }
            {hasError && <Text>{errorMessage}</Text>}
        </View>
    )
}

export { Login };
export default {};