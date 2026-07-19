# Proyecto React Native: Red y Seguridad + Persistencia Dual

Este repositorio contiene una base desde cero para cubrir los requisitos del examen:

- Módulo REST con JSONPlaceholder usando GET y PUT.
- Pantalla de secretos con selección de backend nativo: SharedPreferences, DataStore y EncryptedSharedPreferences.
- Persistencia dual con conmutación en tiempo de ejecución entre SQLite y NoSQL local.

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
