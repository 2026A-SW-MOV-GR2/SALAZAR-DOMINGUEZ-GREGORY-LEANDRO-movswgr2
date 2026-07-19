# Proyecto Carrito de Compras — Apps Interconectadas

## App 1 — Lista de Compras (NativeScript)
[Instrucciones de app 1]

## App 2 — Cajero (Kotlin Multiplatform)
Abrir la carpeta app2-cajero-kmp en Android Studio → Sync → Run

## App 3 — Envío (Kotlin Multiplatform)
[instrucciones de app 3]

## Contrato de datos (Intents)
### App1 → App2 
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| nombres | ArrayList<String> | Lista de nombres de los productos |
| precios | DoubleArray | Array con los precios de los productos |
| cantidades | IntArray | Array con las cantidades de los productos |

### App2 → App3 (Action: com.grupo.carrito.ACTION_PAGO)
| Nombre | Tipo | Descripción |
|--------|------|-------------|
| total | Double | Total a pagar |
| sucursal_nombre | String | Nombre de la sucursal |
| sucursal_lat / sucursal_lng | Double | Coordenadas de la sucursal |