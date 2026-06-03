# Android native integration

Estos archivos son los que debes registrar dentro de un proyecto React Native CLI real para que la pantalla de secretos funcione sobre Android.

## Dependencias Android que debes añadir

En `android/app/build.gradle`, agrega las librerías necesarias para:

- Jetpack DataStore
- EncryptedSharedPreferences
- Coroutines Kotlin

## Registro del paquete

En `MainApplication.kt`, agrega `SecretStoragePackage()` a la lista de paquetes nativos.

## Qué hace el módulo

- `sharedPreferences`: almacén plano de prueba.
- `dataStore`: persistencia reactiva y moderna.
- `encryptedSharedPreferences`: cifrado nativo con AndroidX Security.
