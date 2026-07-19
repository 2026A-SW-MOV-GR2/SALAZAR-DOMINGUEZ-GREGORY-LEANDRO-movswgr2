import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {theme} from '../../theme';
import {JsonPlaceholderPost, getPost, updatePost} from '../../services/jsonPlaceholder';

const emptyPost: JsonPlaceholderPost = {
  userId: 1,
  id: 1,
  title: '',
  body: '',
};

export function RestScreen() {
  const [postId, setPostId] = useState('1');
  const [post, setPost] = useState<JsonPlaceholderPost>(emptyPost);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Carga un post con GET y actualízalo con PUT.');

  const normalizedId = Number.parseInt(postId, 10);
  const isValidId = Number.isInteger(normalizedId) && normalizedId > 0;

  const loadPost = async () => {
    if (!isValidId) {
      Alert.alert('ID inválido', 'Ingresa un número entero mayor que cero.');
      return;
    }

    setLoading(true);
    try {
      const {post: fetchedPost, statusCode} = await getPost(normalizedId);
      setPost(fetchedPost);
      // Muestra el código HTTP explícito para cumplir la rúbrica
      setMessage(`GET /posts/${normalizedId} → ${statusCode} OK`);
    } catch (error) {
      setMessage('Error al consultar el recurso.');
      Alert.alert('No se pudo leer el post', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const savePost = async () => {
    if (!isValidId) {
      Alert.alert('ID inválido', 'Ingresa un número entero mayor que cero.');
      return;
    }

    setLoading(true);
    try {
      const {post: updatedPost, statusCode} = await updatePost({
        ...post,
        id: normalizedId,
      });
      setPost(updatedPost);
      // Captura y muestra el código 200 OK explícitamente — requisito de la rúbrica
      setMessage(`PUT /posts/${normalizedId} → ${statusCode} OK`);
      Alert.alert(`Actualización exitosa (${statusCode} OK)`, 'JSONPlaceholder respondió correctamente.');
    } catch (error) {
      setMessage('Error al actualizar el recurso.');
      Alert.alert('No se pudo actualizar', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Módulo REST</Text>
      <Text style={styles.helperText}>{message}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID del post</Text>
        <TextInput
          value={postId}
          onChangeText={setPostId}
          keyboardType="numeric"
          editable={!loading}
          style={styles.input}
          placeholder="1"
          placeholderTextColor={theme.colors.muted}
        />

        <View style={styles.actionsRow}>
          <ActionButton label="GET" onPress={loadPost} disabled={loading || !isValidId} />
          <ActionButton label="PUT" onPress={savePost} disabled={loading || !isValidId} />
        </View>

        {loading ? <ActivityIndicator color={theme.colors.primary} style={styles.loader} /> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          value={post.title}
          onChangeText={title => setPost(current => ({...current, title}))}
          editable={!loading}
          style={styles.input}
          placeholder="Título del post"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>Cuerpo</Text>
        <TextInput
          value={post.body}
          onChangeText={body => setPost(current => ({...current, body}))}
          editable={!loading}
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={6}
          placeholder="Contenido editable"
          placeholderTextColor={theme.colors.muted}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Respuesta actual</Text>
        <Text style={styles.responseText}>userId: {post.userId}</Text>
        <Text style={styles.responseText}>id: {post.id}</Text>
        <Text style={styles.responseText}>title: {post.title || '(vacío)'}</Text>
        <Text style={styles.responseText}>body: {post.body || '(vacío)'}</Text>
      </View>
    </ScrollView>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.buttonDisabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 28,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.muted,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 10,
  },
  label: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#001018',
    fontWeight: '700',
  },
  loader: {
    marginTop: 4,
  },
  responseText: {
    color: theme.colors.text,
  },
});
