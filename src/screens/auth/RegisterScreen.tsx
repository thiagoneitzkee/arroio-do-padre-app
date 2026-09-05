import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        password: data.password,
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const FormField = ({
    label,
    name,
    icon,
    placeholder,
    keyboardType = 'default',
  }: any) => (
    <Controller
      control={control}
      name={name}
      rules={{
        required: `${label} é obrigatório`,
        ...(name === 'email' && {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email inválido',
          },
        }),
        ...(name === 'cpf' && {
          minLength: { value: 11, message: 'CPF deve ter 11 dígitos' },
        }),
        ...(name === 'phone' && {
          minLength: { value: 10, message: 'Telefone inválido' },
        }),
      }}
      render={({ field: { onChange, value } }) => (
        <View style={styles.formGroup}>
          <Text style={styles.label}>{label}</Text>
          <View style={[styles.inputContainer, errors[name] && styles.inputContainerError]}>
            <MaterialCommunityIcons name={icon} size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#CCC"
              value={value}
              onChangeText={onChange}
              keyboardType={keyboardType}
              autoCapitalize={name === 'email' ? 'none' : 'sentences'}
              editable={!loading}
            />
          </View>
          {errors[name] && <Text style={styles.errorText}>{(errors[name] as any).message}</Text>}
        </View>
      )}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para se registrar</Text>
        </View>

        <View style={styles.form}>
          <FormField
            label="Nome Completo"
            name="name"
            icon="account"
            placeholder="Seu nome"
          />

          <FormField
            label="Email"
            name="email"
            icon="email"
            placeholder="seu@email.com"
            keyboardType="email-address"
          />

          <FormField
            label="Telefone"
            name="phone"
            icon="phone"
            placeholder="(XX) XXXXX-XXXX"
            keyboardType="phone-pad"
          />

          <FormField
            label="CPF"
            name="cpf"
            icon="card-account-details"
            placeholder="XXX.XXX.XXX-XX"
            keyboardType="numeric"
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Senha é obrigatória',
              minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' },
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
                  <MaterialCommunityIcons name="lock" size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="Crie uma senha"
                    placeholderTextColor="#CCC"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{(errors.password as any).message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Confirmação de senha é obrigatória',
              validate: (value) => value === password || 'As senhas não coincidem',
            }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
                  <MaterialCommunityIcons name="lock-check" size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirme a senha"
                    placeholderTextColor="#CCC"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showConfirmPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{(errors.confirmPassword as any).message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="account-plus" size={20} color="#FFF" />
                <Text style={styles.registerButtonText}>Criar Conta</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 10,
  },
  inputContainerError: {
    borderColor: '#E53935',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#2E7D32',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});