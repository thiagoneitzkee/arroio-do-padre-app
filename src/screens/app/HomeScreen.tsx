import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRequestStore, Request } from '../../store/requestStore';

export default function HomeScreen({ navigation }: any) {
  const { getAllRequests } = useRequestStore();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const allRequests = getAllRequests();
      setRequests(allRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F57C00';
      case 'in_progress':
        return '#1976D2';
      case 'resolved':
        return '#00897B';
      case 'cancelled':
        return '#E53935';
      default:
        return '#666';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Bem-vindo!</Text>
            <Text style={styles.headerSubtitle}>Suas solicitações de serviços públicos</Text>
          </View>
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={() => navigation.navigate('New')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{requests.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {requests.filter((r) => r.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {requests.filter((r) => r.status === 'in_progress').length}
            </Text>
            <Text style={styles.statLabel}>Em Andamento</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {requests.filter((r) => r.status === 'resolved').length}
            </Text>
            <Text style={styles.statLabel}>Resolvidos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Solicitações Recentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Requests')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {requests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="file-document-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>Nenhuma solicitação ainda</Text>
              <Text style={styles.emptySubtext}>
                Crie uma nova solicitação para começar
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('New')}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
                <Text style={styles.createButtonText}>Criar Solicitação</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.requestsList}>
              {requests.slice(0, 5).map((request) => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.requestCard}
                  onPress={() => navigation.navigate('RequestDetails', { requestId: request.id })}
                >
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestTitle}>{request.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(request.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>{getStatusLabel(request.status)}</Text>
                    </View>
                  </View>
                  <Text style={styles.requestDescription} numberOfLines={2}>
                    {request.description}
                  </Text>
                  <View style={styles.requestFooter}>
                    <Text style={styles.requestCategory}>{request.category}</Text>
                    <Text style={styles.requestDate}>{formatDate(request.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias Populares</Text>
          <View style={styles.categoriesGrid}>
            {['Saúde', 'Infra', 'Limpeza', 'Segurança'].map((category) => (
              <TouchableOpacity key={category} style={styles.categoryCard}>
                <MaterialCommunityIcons
                  name="folder"
                  size={32}
                  color="#2E7D32"
                />
                <Text style={styles.categoryName}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E8F5E9',
  },
  newRequestButton: {
    backgroundColor: '#1B5E20',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  requestsList: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestCategory: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  requestDate: {
    fontSize: 11,
    color: '#999',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
});
