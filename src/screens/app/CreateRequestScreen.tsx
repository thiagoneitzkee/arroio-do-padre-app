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
import { useRequestStore } from '../../store/requestStore';
import { useAuthStore } from '../../store/authStore';
import { useForm, Controller } from 'react-hook-form';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';

interface CreateRequestFormData {
  title: string;
  description: string;
  category: string;
}

const CATEGORIES = [
  { id: 'water', name: 'Água e Saneamento', icon: 'water' },
  { id: 'roads', name: 'Vias e Ruas', icon: 'road' },
  { id: 'health', name: 'Saúde', icon: 'hospital-box' },
  { id: 'education', name: 'Educação', icon: 'school' },
  { id: 'security', name: 'Segurança', icon: 'shield-alert' },
  { id: 'other', name: 'Outros', icon: 'dots-horizontal' },
];

export default function CreateRequestScreen({ navigation, route }: any) {
  const { createRequest } = useRequestStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(route.params?.selectedCategory || 'other');
  
  const { control, handleSubmit, formState: { errors } } = useForm<CreateRequestFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: selectedCategory,
    },
  });

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão de localização negada');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address[0]?.name || 'Localização obtida',
      });

      Alert.alert('Sucesso', 'Localização obtida com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter a localização');
    }
  };

  const onSubmit = async (data: CreateRequestFormData) => {
    if (!location) {
      Alert.alert('Erro', 'Você deve fornecer a localização');
      return;
    }

    setLoading(true);
    try {
      await createRequest({
        title: data.title,
        description: data.description,
        category: selectedCategory,
        status: 'pending',
        location,
        attachments: [],
        userId: user?.id || '',
      });

      Alert.alert('Sucesso', 'Solicitação criada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategoryData = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Solicitação</Text>
            <Text style={styles.subtitle}>Descreva o problema ou serviço solicitado</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category.id && styles.categoryOptionSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={20}
                    color={selectedCategory === category.id ? '#2E7D32' : '#999'}
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedCategory === category.id && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Título da Solicitação</Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: 'Título é obrigatório' }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="Ex: Buraco na rua"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                  />
                  {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição Detalhada</Text>
            <Controller
              control={control}
              name="description"
              rules={{ required: 'Descrição é obrigatória' }}
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    style={[styles.inputLarge, errors.description && styles.inputError]}
                    placeholder="Descreva em detalhes o problema ou serviço solicitado"
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    editable={!loading}
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description.message}</Text>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <TouchableOpacity
              style={[styles.locationButton, location && styles.locationButtonActive]}
              onPress={getLocation}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name={location ? 'map-marker-check' : 'map-marker-plus'}
                size={20}
                color={location ? '#2E7D32' : '#666'}
              />
              <Text style={[styles.locationButtonText, location && styles.locationButtonTextActive]}>
                {location ? location.address : 'Obter localização'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="send" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
              </>
            )}
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 25,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  categoryScroll: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  categoryOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  categoryOptionSelected: {
    backgroundColor: '#C8E6C9',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  categoryOptionTextSelected: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  inputLarge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 120,
  },
  inputError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 5,
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  locationButtonActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  locationButtonText: {
    color: '#666',
    fontSize: 14,
  },
  locationButtonTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
