# Proyecto React Native: Red y Seguridad + Persistencia Dual

Este repositorio contiene una base desde cero para cubrir los requisitos del examen:

- Módulo REST con JSONPlaceholder usando GET y PUT.
- Pantalla de secretos con selección de backend nativo: SharedPreferences, DataStore y EncryptedSharedPreferences.
- Examen de persistencia dual con conmutación en tiempo de ejecución entre SQLite y NoSQL local.
- Repositorio común, logs estructurados y pruebas unitarias.

## 1. Crear el proyecto base

Si todavía no existe un proyecto React Native, créalo con TypeScript:

```bash
npx react-native init examen_proyecto --template react-native-template-typescript
```

Después copia el contenido de este repositorio dentro del proyecto generado.

## 2. Instalar dependencias sugeridas

Para la parte local dual:

```bash
yarn add react-native-sqlite-storage react-native-mmkv
```

Para pruebas:

```bash
yarn add -D jest @types/jest ts-jest
```

## 3. Qué implementa cada módulo

### Módulo REST

- Entrada numérica para el `id` del post.
- GET a `https://jsonplaceholder.typicode.com/posts/:id`.
- PUT al mismo recurso con el JSON editado.
- Estado `loading` para deshabilitar controles mientras la petición está en tránsito.

### Módulo de secretos

- No lista claves.
- El usuario ingresa llave, valor y backend.
- Recupera un secreto por llave y backend.
- Para Android nativo, conecta con módulos Kotlin que usan:
  - SharedPreferences
  - Jetpack DataStore
  - EncryptedSharedPreferences

### Persistencia dual

- Switch en la barra superior para alternar entre SQLite y NoSQL.
- La interfaz se actualiza al instante cuando cambia el motor.
- Chip visible para mostrar el origen activo.
- La vista no conoce el motor de datos; habla con un repositorio común.

## 4. Nota importante

Los archivos de Kotlin para Android están preparados para integrarse dentro de un proyecto React Native CLI real. Si partes desde cero, debes generar el proyecto base de React Native primero para que exista la carpeta `android/`.

## 5. Orden recomendado para estudiar o defender el proyecto

1. Explica la arquitectura por capas: UI, servicios, repositorios y almacenamiento.
2. Muestra la pantalla REST y demuestra GET/PUT con loading state.
3. Muestra el selector de backend de secretos y explica el uso de almacenamiento nativo seguro.
4. Muestra el switch de persistencia dual y prueba que SQLite y NoSQL no se pisan entre sí.
5. Ejecuta los tests unitarios y explica qué validan.
