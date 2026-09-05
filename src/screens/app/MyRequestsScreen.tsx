import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRequestStore } from '../../store/requestStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_CONFIG = {
  pending: {
    label: 'Pendente',
    color: '#F57C00',
    icon: 'clock-outline',
  },
  in_progress: {
    label: 'Em Andamento',
    color: '#1976D2',
    icon: 'sync',
  },
  resolved: {
    label: 'Resolvida',
    color: '#00897B',
    icon: 'check-circle',
  },
  cancelled: {
    label: 'Cancelada',
    color: '#E53935',
    icon: 'close-circle',
  },
};

export default function MyRequestsScreen({ navigation }: any) {
  const { requests, loading, fetchRequests } = useRequestStore();

  React.useEffect(() => {
    fetchRequests();
  }, []);

  const groupedRequests = useMemo(() => {
    const groups = {
      pending: [] as any[],
      in_progress: [] as any[],
      resolved: [] as any[],
      cancelled: [] as any[],
    };

    requests.forEach((request) => {
      groups[request.status as keyof typeof groups].push(request);
    });

    return groups;
  }, [requests]);

  const RequestCard = ({ request }: any) => {
    const status = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
    const timeAgo = formatDistanceToNow(new Date(request.createdAt), {
      addSuffix: true,
      locale: ptBR,
    });

    return (
      <TouchableOpacity
        style={styles.requestCard}
        onPress={() => navigation.navigate('RequestDetail', { requestId: request.id })}
      >
        <View style={styles.requestCardContent}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestTitle} numberOfLines={2}>
              {request.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
              <MaterialCommunityIcons name={status.icon} size={12} color="#FFF" />
              <Text style={styles.statusBadgeText}>{status.label}</Text>
            </View>
          </View>

          <Text style={styles.requestCategory}>{request.category}</Text>
          <Text style={styles.requestDescription} numberOfLines={2}>
            {request.description}
          </Text>

          <View style={styles.requestFooter}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#999" />
            <Text style={styles.requestLocation} numberOfLines={1}>
              {request.location.address}
            </Text>
          </View>

          <Text style={styles.requestDate}>{timeAgo}</Text>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="inbox-outline" size={48} color="#DDD" />
      <Text style={styles.emptyStateText}>Nenhuma solicitação encontrada</Text>
      <Text style={styles.emptyStateSubtext}>
        Crie uma nova solicitação para começar
      </Text>
      <TouchableOpacity
        style={styles.createButtonEmpty}
        onPress={() => navigation.navigate('CreateRequest')}
      >
        <MaterialCommunityIcons name="plus" size={20} color="#2E7D32" />
        <Text style={styles.createButtonEmptyText}>Criar Solicitação</Text>
      </TouchableOpacity>
    </View>
  );

  if (requests.length === 0 && !loading) {
    return (
      <View style={styles.container}>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RequestCard request={item} />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchRequests} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color="#2E7D32"
              style={styles.loader}
            />
          ) : (
            <EmptyState />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestCardContent: {
    flex: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  requestCategory: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  requestFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requestLocation: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
    flex: 1,
  },
  requestDate: {
    fontSize: 11,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
  createButtonEmpty: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  createButtonEmptyText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
});
