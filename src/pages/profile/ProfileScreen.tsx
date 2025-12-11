import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import AppStrings from '../../constants/appStrings';
import { ToastMessage } from '../../constants/TostMessages';
import EditProfileModal from '../../components/profile/EditProfileModal';
import { setResetUser } from '../../store/slice/authSlice';

interface Props {
  navigation: any;
}

const ProfileScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.auth.userData);
  const isOffline = useSelector((state: any) => state.product.isOffline);

  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');

  const saveProfile = (newName: string, newEmail: string) => {
    setName(newName);
    setEmail(newEmail);
  };

  const handleLogout = () => {
  dispatch(setResetUser())
  };

  const handleDeleteAccount = () => {
 
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {isOffline && (
          <View style={styles.offlineBadge}>
            <Feather name="wifi-off" size={12} color="#fff" />
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(name)}</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name || 'Guest User'}</Text>
            <Text style={styles.profileEmail}>{email || 'No email provided'}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setShowEditModal(true)}
            >
              <Feather name="edit-2" size={16} color={AppStrings.appColor} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconContainer}>
                <Feather name="heart" size={20} color={AppStrings.appColor} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Favorites</Text>
                <Text style={styles.menuSubtitle}>View your favorite products</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconContainer}>
                <Feather name="shopping-bag" size={20} color={AppStrings.appColor} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>Orders</Text>
                <Text style={styles.menuSubtitle}>Track your orders</Text>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Feather name="trash-2" size={20} color="#ff3b30" />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={showEditModal}
        currentName={name}
        currentEmail={email}
        onClose={() => setShowEditModal(false)}
        onSave={saveProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff9500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppStrings.appColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppStrings.appColor,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppStrings.appColor,
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  actionSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStrings.appColor,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    marginLeft: 8,
  },
});

export default ProfileScreen;