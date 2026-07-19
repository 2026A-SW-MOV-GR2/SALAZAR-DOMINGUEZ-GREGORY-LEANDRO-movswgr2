import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';

// ─── Equivalencias Android → React Native ────────────────────────────────────
//  SharedPreferences      → AsyncStorage con prefijo "sp:"  (texto plano, síncrono-simulado)
//  Jetpack DataStore      → AsyncStorage con prefijo "ds:"  (asíncrono, sin bloquear UI)
//  EncryptedSharedPref    → EncryptedStorage                (AES-256-GCM nativo en disco)
// ─────────────────────────────────────────────────────────────────────────────

export type SecretStorageMode =
  | 'sharedPreferences'
  | 'dataStore'
  | 'encryptedSharedPreferences';

// Mapeo de modo a prefijo de clave para AsyncStorage
const PREFIX: Record<'sharedPreferences' | 'dataStore', string> = {
  sharedPreferences: 'sp:',
  dataStore: 'ds:',
};

export const secretStorage = {
  /**
   * Guarda un secreto en el compartimento nativo elegido.
   * - sharedPreferences / dataStore → AsyncStorage (texto plano)
   * - encryptedSharedPreferences    → EncryptedStorage (AES-256 en disco)
   */
  async saveSecret(
    mode: SecretStorageMode,
    key: string,
    value: string,
  ): Promise<void> {
    if (mode === 'encryptedSharedPreferences') {
      // Cifrado automático AES-256-SIV / AES-128-GCM antes de escribir en disco
      await EncryptedStorage.setItem(key, value);
    } else {
      // Texto plano — prefijo para evitar colisión entre compartimentos
      await AsyncStorage.setItem(`${PREFIX[mode]}${key}`, value);
    }
  },

  /**
   * Recupera un secreto del compartimento indicado.
   * Retorna null si la llave no existe — nunca revela si existe en otro compartimento.
   */
  async readSecret(
    mode: SecretStorageMode,
    key: string,
  ): Promise<string | null> {
    if (mode === 'encryptedSharedPreferences') {
      try {
        return await EncryptedStorage.getItem(key);
      } catch {
        // EncryptedStorage lanza si la clave no existe en algunos dispositivos
        return null;
      }
    } else {
      return AsyncStorage.getItem(`${PREFIX[mode]}${key}`);
    }
  },
};
