import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {theme} from '../../theme';
import {log} from '../../data/logger';
import {NoSqlRecordRepository} from '../../data/records/NoSqlRecordRepository';
import {RepositoryController} from '../../data/records/RepositoryController';
import {SqliteRecordRepository} from '../../data/records/SqliteRecordRepository';
import {RecordItem, StorageMode} from '../../data/records/types';

const sqliteRepository = new SqliteRecordRepository();
const nosqlRepository = new NoSqlRecordRepository();
const controller = new RepositoryController(sqliteRepository, nosqlRepository);

export function HybridPersistenceScreen() {
  const [mode, setMode] = useState<StorageMode>('sqlite');
  const [items, setItems] = useState<RecordItem[]>([]);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const activeLabel = useMemo(() => (mode === 'sqlite' ? 'SQLite' : 'NoSQL'), [mode]);

  useEffect(() => {
    controller
      .init()
      .then(() => {
        setInitialized(true);
      })
      .catch(error => {
        log('ERROR', 'Repository init failed', {message: error instanceof Error ? error.message : 'Unknown'});
        Alert.alert('Error', 'No se pudo inicializar la persistencia local.');
      });
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    controller.setMode(mode);
    loadItems();
  }, [mode, initialized]);

  const loadItems = async () => {
    try {
      const currentItems = await controller.getAll();
      setItems(currentItems);
      log('INFO', 'Records loaded', {mode, count: currentItems.length});
    } catch (error) {
      log('ERROR', 'Failed to load records', {mode, message: error instanceof Error ? error.message : 'Unknown'});
    }
  };

  const saveItem = async () => {
    if (!title.trim() || !note.trim()) {
      Alert.alert('Campos requeridos', 'Escribe título y nota antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      const item: RecordItem = {
        id: `${Date.now()}`,
        title: title.trim(),
        note: note.trim(),
        createdAt: Date.now(),
      };

      await controller.save(item);
      setTitle('');
      setNote('');
      await loadItems();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setLoading(true);
    try {
      await controller.delete(id);
      await loadItems();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.sectionTitle}>Persistencia dual</Text>
          <Text style={styles.helperText}>Origen activo: {activeLabel}</Text>
        </View>
        <View style={styles.switchBox}>
          <Text style={styles.switchLabel}>SQLite</Text>
          <Switch value={mode === 'nosql'} onValueChange={value => setMode(value ? 'nosql' : 'sqlite')} />
          <Text style={styles.switchLabel}>NoSQL</Text>
        </View>
      </View>

      <View style={styles.badgeRow}>
        <Text style={[styles.badge, mode === 'sqlite' ? styles.badgeSqlite : styles.badgeNosql]}>{activeLabel}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          editable={!loading}
          style={styles.input}
          placeholder="Ejemplo de registro"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>Nota</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          editable={!loading}
          style={[styles.input, styles.multiline]}
          multiline
          numberOfLines={4}
          placeholder="Detalle del registro"
          placeholderTextColor={theme.colors.muted}
        />

        <Pressable onPress={saveItem} disabled={loading} style={[styles.button, loading && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Guardar en {activeLabel}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Registros leídos desde {activeLabel}</Text>
        {items.length === 0 ? <Text style={styles.emptyText}>No hay registros aún.</Text> : null}
        {items.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Pressable onPress={() => deleteItem(item.id)} disabled={loading}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
            <Text style={styles.itemNote}>{item.note}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 28,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  helperText: {
    color: theme.colors.muted,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    color: '#001018',
    fontWeight: '700',
  },
  badgeSqlite: {
    backgroundColor: '#7dd3fc',
  },
  badgeNosql: {
    backgroundColor: '#fdba74',
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
    minHeight: 90,
    textAlignVertical: 'top',
  },
  button: {
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
  emptyText: {
    color: theme.colors.muted,
  },
  itemCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  itemTitle: {
    color: theme.colors.text,
    fontWeight: '700',
    flex: 1,
  },
  itemNote: {
    color: theme.colors.muted,
  },
  deleteText: {
    color: theme.colors.danger,
    fontWeight: '700',
  },
});