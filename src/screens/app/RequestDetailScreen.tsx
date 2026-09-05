import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
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
    description: 'Sua solicitação foi recebida e está aguardando análise',
  },
  in_progress: {
    label: 'Em Andamento',
    color: '#1976D2',
    icon: 'sync',
    description: 'Sua solicitação está sendo processada',
  },
  resolved: {
    label: 'Resolvida',
    color: '#00897B',
    icon: 'check-circle',
    description: 'Sua solicitação foi resolvida com sucesso',
  },
  cancelled: {
    label: 'Cancelada',
    color: '#E53935',
    icon: 'close-circle',
    description: 'Sua solicitação foi cancelada',
  },
};

export default function RequestDetailScreen({ navigation, route }: any) {
  const { requestId } = route.params;
  const { getRequestById, deleteRequest, updateRequest } = useRequestStore();
  const [loading, setLoading] = React.useState(false);

  const request = getRequestById(requestId);

  if (!request) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#E53935" />
          <Text style={styles.notFoundText}>Solicitação não encontrada</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const status = STATUS_CONFIG[request.status as keyof typeof STATUS_CONFIG];
  const timeAgo = formatDistanceToNow(new Date(request.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta solicitação?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Excluir',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteRequest(requestId);
              Alert.alert('Sucesso', 'Solicitação excluída com sucesso');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao excluir solicitação');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleOpenLocation = () => {
    const { latitude, longitude } = request.location;
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa');
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.statusHeader, { backgroundColor: status.color }]}>
          <MaterialCommunityIcons name={status.icon} size={32} color="#FFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>{status.label}</Text>
            <Text style={styles.statusDescription}>{status.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Solicitação</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>{request.id}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Título</Text>
              <Text style={styles.infoValue}>{request.title}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{request.category}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Data de Criação</Text>
              <Text style={styles.infoValue}>{timeAgo}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última Atualização</Text>
              <Text style={styles.infoValue}>
                {formatDistanceToNow(new Date(request.updatedAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{request.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <TouchableOpacity
            style={styles.locationBox}
            onPress={handleOpenLocation}
          >
            <MaterialCommunityIcons name="map-marker" size={24} color="#2E7D32" />
            <View style={{ flex: 1 }}>
              <Text style={styles.locationAddress}>{request.location.address}</Text>
              <Text style={styles.locationCoords}>
                {request.location.latitude.toFixed(4)}, {request.location.longitude.toFixed(4)}
              </Text>
            </View>
            <MaterialCommunityIcons name="open-in-new" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações</Text>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Editar Solicitação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Excluir Solicitação</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerInfo}>
          <MaterialCommunityIcons name="information-outline" size={16} color="#2E7D32" />
          <Text style={styles.footerInfoText}>
            Para mais informações, entre em contato com a Prefeitura
          </Text>
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
    paddingVertical: 15,
  },
  statusHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusDescription: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoRow: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  locationBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  locationAddress: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  locationCoords: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#2E7D32',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E53935',
    marginTop: 12,
  },
  backButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  footerInfo: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerInfoText: {
    fontSize: 12,
    color: '#2E7D32',
    flex: 1,
  },
});
