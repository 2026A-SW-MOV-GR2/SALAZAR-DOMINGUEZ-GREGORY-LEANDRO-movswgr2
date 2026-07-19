import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {theme} from '../../theme';
import {SecretStorageMode, secretStorage} from '../../services/secretStorage';

const storageOptions: {label: string; value: SecretStorageMode}[] = [
  {label: 'SharedPreferences', value: 'sharedPreferences'},
  {label: 'DataStore', value: 'dataStore'},
  {label: 'EncryptedSharedPreferences', value: 'encryptedSharedPreferences'},
];

export function SecretsScreen() {
  const [selectedMode, setSelectedMode] = useState<SecretStorageMode>('encryptedSharedPreferences');
  const [key, setKey] = useState('token_demo');
  const [value, setValue] = useState('mi-secreto-123');
  const [result, setResult] = useState('Elige un compartimento y guarda o recupera un secreto.');
  const [loading, setLoading] = useState(false);

  const saveSecret = async () => {
    if (!key.trim()) {
      Alert.alert('Llave requerida', 'Escribe una llave antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      await secretStorage.saveSecret(selectedMode, key.trim(), value);
      setResult(`Guardado en ${selectedMode}: ${key.trim()}`);
    } catch (error) {
      setResult('No se pudo guardar el secreto.');
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const readSecret = async () => {
    if (!key.trim()) {
      Alert.alert('Llave requerida', 'Escribe una llave antes de recuperar.');
      return;
    }

    setLoading(true);
    try {
      const storedValue = await secretStorage.readSecret(selectedMode, key.trim());
      if (storedValue === null) {
        setResult('No existe un secreto para esa llave en el compartimento elegido.');
      } else {
        setResult(`Secreto recuperado: ${storedValue}`);
      }
    } catch (error) {
      setResult('No se pudo recuperar el secreto.');
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Módulo de seguridad</Text>
      <Text style={styles.helperText}>{result}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Compartimento nativo</Text>
        <View style={styles.optionsRow}>
          {storageOptions.map(option => (
            <ChoiceButton
              key={option.value}
              label={option.label}
              active={selectedMode === option.value}
              onPress={() => setSelectedMode(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Llave</Text>
        <TextInput
          value={key}
          onChangeText={setKey}
          editable={!loading}
          style={styles.input}
          placeholder="token_demo"
          placeholderTextColor={theme.colors.muted}
        />

        <Text style={styles.label}>Valor</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          editable={!loading}
          style={styles.input}
          placeholder="mi-secreto"
          placeholderTextColor={theme.colors.muted}
        />
      </View>

      <View style={styles.actionsRow}>
        <ActionButton label="Guardar" onPress={saveSecret} disabled={loading} />
        <ActionButton label="Recuperar" onPress={readSecret} disabled={loading} />
      </View>
    </ScrollView>
  );
}

function ChoiceButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.choice, active && styles.choiceActive]}>
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
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
  optionsRow: {
    gap: 8,
  },
  choice: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  choiceActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#0b3b52',
  },
  choiceText: {
    color: theme.colors.muted,
    fontWeight: '600',
  },
  choiceTextActive: {
    color: theme.colors.text,
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
});