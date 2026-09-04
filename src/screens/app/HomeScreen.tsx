import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useRequestStore } from '../../store/requestStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CATEGORIES = [
  { id: 'water', name: 'Água e Saneamento', icon: 'water' },
  { id: 'roads', name: 'Vias e Ruas', icon: 'road' },
  { id: 'health', name: 'Saúde', icon: 'hospital-box' },
  { id: 'education', name: 'Educação', icon: 'school' },
  { id: 'security', name: 'Segurança', icon: 'shield-alert' },
  { id: 'other', name: 'Outros', icon: 'dots-horizontal' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { requests } = useRequestStore();

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'pending').length,
      inProgress: requests.filter((r) => r.status === 'in_progress').length,
      resolved: requests.filter((r) => r.status === 'resolved').length,
    };
  }, [requests]);

  const CategoryCard = ({ category }: any) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() =>
        navigation.navigate('CreateRequest', { selectedCategory: category.id })
      }
    >
      <MaterialCommunityIcons
        name={category.icon}
        size={32}
        color="#2E7D32"
        style={styles.categoryIcon}
      />
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ label, value, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}!</Text>
        <Text style={styles.subtitle}>Bem-vindo ao Arroio do Padre</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Total" value={stats.total} color="#2E7D32" />
        <StatCard label="Pendentes" value={stats.pending} color="#F57C00" />
      </View>

      <View style={styles.statsContainer}>
        <StatCard label="Em Andamento" value={stats.inProgress} color="#1976D2" />
        <StatCard label="Resolvidas" value={stats.resolved} color="#00897B" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorias de Serviços</Text>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.categoryRow}
          renderItem={({ item }) => <CategoryCard category={item} />}
        />
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateRequest')}
      >
        <MaterialCommunityIcons name="plus-circle" size={20} color="#FFF" />
        <Text style={styles.createButtonText}>Nova Solicitação</Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="information-outline" size={24} color="#2E7D32" />
        <Text style={styles.infoText}>
          Você pode acompanhar todas as suas solicitações na aba "Solicitações"
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryRow: {
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
});
