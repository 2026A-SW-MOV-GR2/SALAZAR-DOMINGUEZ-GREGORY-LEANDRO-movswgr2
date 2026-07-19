package com.examenproyecto

import android.content.Context
import android.content.SharedPreferences
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

private val Context.secretDataStore by preferencesDataStore(name = "secret_data_store")

class SecretStorageModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val scope = CoroutineScope(Dispatchers.IO + Job())

  override fun getName(): String = "SecretStorage"

  @ReactMethod
  fun saveSecret(mode: String, key: String, value: String, promise: Promise) {
    when (mode) {
      "sharedPreferences" -> saveInSharedPreferences(key, value, promise)
      "dataStore" -> saveInDataStore(key, value, promise)
      "encryptedSharedPreferences" -> saveInEncryptedSharedPreferences(key, value, promise)
      else -> promise.reject("MODE_NOT_SUPPORTED", "Modo no soportado: $mode")
    }
  }

  @ReactMethod
  fun readSecret(mode: String, key: String, promise: Promise) {
    when (mode) {
      "sharedPreferences" -> promise.resolve(readFromSharedPreferences(key))
      "dataStore" -> readFromDataStore(key, promise)
      "encryptedSharedPreferences" -> promise.resolve(readFromEncryptedSharedPreferences(key))
      else -> promise.reject("MODE_NOT_SUPPORTED", "Modo no soportado: $mode")
    }
  }

  private fun saveInSharedPreferences(key: String, value: String, promise: Promise) {
    context.getSharedPreferences("shared_secrets", Context.MODE_PRIVATE)
      .edit()
      .putString(key, value)
      .apply()
    promise.resolve(null)
  }

  private fun readFromSharedPreferences(key: String): String? {
    return context.getSharedPreferences("shared_secrets", Context.MODE_PRIVATE)
      .getString(key, null)
  }

  private fun saveInDataStore(key: String, value: String, promise: Promise) {
    scope.launch {
      context.secretDataStore.edit { preferences ->
        preferences[stringPreferencesKey(key)] = value
      }
      promise.resolve(null)
    }
  }

  private fun readFromDataStore(key: String, promise: Promise) {
    scope.launch {
      val preferences = context.secretDataStore.data.first()
      val storedValue = preferences[stringPreferencesKey(key)]
      promise.resolve(storedValue)
    }
  }

  private fun saveInEncryptedSharedPreferences(key: String, value: String, promise: Promise) {
    encryptedPreferences()
      .edit()
      .putString(key, value)
      .apply()
    promise.resolve(null)
  }

  private fun readFromEncryptedSharedPreferences(key: String): String? {
    return encryptedPreferences().getString(key, null)
  }

  private fun encryptedPreferences(): SharedPreferences {
    val masterKey = MasterKey.Builder(context)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()

    return EncryptedSharedPreferences.create(
      context,
      "encrypted_secrets",
      masterKey,
      EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
      EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )
  }
}
