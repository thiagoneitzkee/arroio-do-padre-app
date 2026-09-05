import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Desconectar',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Desconectar',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erro', 'Falha ao desconectar');
            } finally {
              setLoading(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const ProfileSection = ({ title, icon, value }: any) => (
    <View style={styles.profileItem}>
      <View style={styles.profileItemIcon}>
        <MaterialCommunityIcons name={icon} size={20} color="#2E7D32" />
      </View>
      <View style={styles.profileItemContent}>
        <Text style={styles.profileItemLabel}>{title}</Text>
        <Text style={styles.profileItemValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <Text>Usuário não encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#2E7D32" />
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.profileCard}>
          <ProfileSection title="Nome" icon="account" value={user.name} />
          <View style={styles.divider} />
          <ProfileSection title="Email" icon="email" value={user.email} />
          <View style={styles.divider} />
          <ProfileSection title="Telefone" icon="phone" value={user.phone} />
          <View style={styles.divider} />
          <ProfileSection title="CPF" icon="card-account-details" value={user.cpf} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.configCard}>
          <TouchableOpacity style={styles.configItem}>
            <MaterialCommunityIcons name="bell" size={20} color="#2E7D32" />
            <Text style={styles.configItemText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.configItem}>
            <MaterialCommunityIcons name="lock" size={20} color="#2E7D32" />
            <Text style={styles.configItemText}>Alterar Senha</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.configItem}>
            <MaterialCommunityIcons name="file-document" size={20} color="#2E7D32" />
            <Text style={styles.configItemText}>Termos e Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <View style={styles.aboutCard}>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Versão do App</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>Desenvolvido por</Text>
            <Text style={styles.aboutValue}>Prefeitura de Arroio do Padre</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, loading && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <>
            <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
            <Text style={styles.logoutButtonText}>Desconectar</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <MaterialCommunityIcons name="heart" size={16} color="#2E7D32" />
        <Text style={styles.footerText}>
          Feito com dedicação para a comunidade
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
    paddingVertical: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#E8F5E9',
  },
  section: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 3,
  },
  profileItemValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  configItemText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  aboutItem: {
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 3,
  },
  aboutValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 0,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    marginHorizontal: 15,
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
