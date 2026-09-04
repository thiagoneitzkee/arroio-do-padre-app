import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useForm, Controller } from 'react-hook-form';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  passwordConfirm: string;
}

export default function RegisterScreen({ navigation }: any) {
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.passwordConfirm) {
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
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Nome é obrigatório' }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Nome completo"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  editable={!loading}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email inválido',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  editable={!loading}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="cpf"
            rules={{
              required: 'CPF é obrigatório',
              pattern: {
                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                message: 'CPF deve estar no formato XXX.XXX.XXX-XX',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.cpf && styles.inputError]}
                  placeholder="CPF (xxx.xxx.xxx-xx)"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  editable={!loading}
                />
                {errors.cpf && (
                  <Text style={styles.errorText}>{errors.cpf.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="Telefone ((xx) xxxxx-xxxx)"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Senha deve ter no mínimo 6 caracteres',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  placeholder="Senha"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  editable={!loading}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            rules={{
              required: 'Confirmação de senha é obrigatória',
              validate: (value) =>
                value === password || 'As senhas não coincidem',
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  style={[styles.input, errors.passwordConfirm && styles.inputError]}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#999"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  editable={!loading}
                />
                {errors.passwordConfirm && (
                  <Text style={styles.errorText}>{errors.passwordConfirm.message}</Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>Já tem conta? <Text style={styles.linkTextBold}>Faça login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 14,
    color: '#333',
  },
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkTextBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
