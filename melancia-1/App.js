import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Animated,
  Switch,
  Modal,
} from 'react-native';
import { useState, useRef } from 'react';

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // foto aberta
  const [likedPosts, setLikedPosts] = useState([]); // ids curtidos
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // dados fake
  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
    uri: `https://picsum.photos/400/400?random=${i + 1}`,
  }));

  const stories = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    uri: `https://i.pravatar.cc/100?img=${i + 5}`,
    name: `User ${i + 1}`,
  }));

  const theme = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    secondary: isDark ? "#aaa" : "#555",
    card: isDark ? "#111" : "#f5f5f5",
    button: "#3897f0",
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const toggleLike = (id) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // tela de configs
  if (showSettings) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        
        <View style={[styles.header, { borderColor: theme.secondary }]}>
          <Text style={[styles.username, { color: theme.text }]}>Configurações</Text>
        </View>

        <View style={[styles.settingsItem, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text, fontSize: 16 }}>Modo Escuro</Text>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>

        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.button }]}
          onPress={() => setShowSettings(false)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Cabeçalho */}
      <View style={[styles.header, { borderColor: theme.secondary }]}>
        <Text style={[styles.username, { color: theme.text }]}>meu_usuario</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Text style={{ color: theme.button, fontWeight: "bold" }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Perfil */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.profileImage}
        />
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>9</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>2.3k</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.text }]}>350</Text>
            <Text style={[styles.statLabel, { color: theme.secondary }]}>Seguindo</Text>
          </View>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.bio}>
        <Text style={[styles.name, { color: theme.text }]}>Wes</Text>
        <Text style={[styles.description, { color: theme.secondary }]}>
          💻 Dev | 🎮 Gamer | Nada seu, tudo meu
        </Text>
      </View>

      {/* Botões */}
      <View style={styles.buttons}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.followButton, { backgroundColor: theme.button }]}
            activeOpacity={0.7}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Seguir</Text>
          </TouchableOpacity>
        </Animated.View>
                
        <TouchableOpacity
          style={[styles.messageButton, { backgroundColor: theme.card }]}
          activeOpacity={0.7}
        >
          <Text style={{ fontWeight: "bold", color: theme.text }}>Mensagem</Text>
        </TouchableOpacity>
      </View>

      {/* Stories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stories}>
        {stories.map((story) => (
          <View key={story.id} style={styles.storyItem}>
            <Image source={{ uri: story.uri }} style={styles.storyImage} />
            <Text style={[styles.storyName, { color: theme.secondary }]}>{story.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.postWrapper}
            onPress={() => setSelectedPost(item)}
          >
            <Image source={{ uri: item.uri }} style={styles.postImage} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.postsContainer}
      />

      {/* Modal para abrir foto */}
      <Modal visible={!!selectedPost} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          {selectedPost && (
            <>
              <Image source={{ uri: selectedPost.uri }} style={styles.modalImage} />


             <View style={{flexDirection:'row'}}>
               {/* Botão Curtir */}
               <TouchableOpacity
                onPress={() => toggleLike(selectedPost.id)}
                style={styles.likeButton}
              >
                <Text style={{ fontSize: 50 }}>
                  {likedPosts.includes(selectedPost.id) ? "❤️" : "🤍"}
                </Text>
              </TouchableOpacity>

              {/* Fechar */}
              <TouchableOpacity
                onPress={() => setSelectedPost(null)}
                style={styles.closeButton}
              >
                <Text style={{ color: "#fff", fontSize: 18 }}>Fechar </Text>
              </TouchableOpacity>

             </View>
             
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 15,
    borderBottomWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: { fontSize: 20, fontWeight: "bold" },
  profileSection: { flexDirection: "row", padding: 15, alignItems: "center" },
  profileImage: { width: 90, height: 90, borderRadius: 45 },
  stats: { flexDirection: "row", flex: 1, justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 12 },
  bio: { paddingHorizontal: 15, marginBottom: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
  description: { fontSize: 13 },
  buttons: { flexDirection: "row", paddingHorizontal: 15, marginBottom: 10 },
  followButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  messageButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: { fontWeight: "bold", color: "#fff" },
  stories: { paddingHorizontal: 10, marginBottom: 10 },
  storyItem: { alignItems: "center", marginRight: 15 },
  storyImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: "#ff8501",
  },
  storyName: { marginTop: 5, fontSize: 12 },

  // grid de posts
  postsContainer: { paddingBottom: 100 },
  postWrapper: { width: "33%", aspectRatio: 1 },
  postImage: { width: "100%", height: "100%" },

  // Configurações
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  settingsButton: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  likeButton: {
  
  },
});
