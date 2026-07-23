package com.example.proyecto_bi_dos

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import android.widget.Toast
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.viewinterop.AndroidView
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import kotlinx.coroutines.launch

// Paleta de colores centralizada
object AppColors {
    // Primario
    val Primary = Color(0xFFFF5733)
    val PrimaryDisabled = Color(0x4DFF5733)  // 30% opacidad

    // Fondos
    val Background = Color(0xFF22242A)
    val Surface = Color(0xFF2C2E36)

    // Textos
    val TextWhite = Color(0xFFFFFFFF)
    val TextGray = Color(0xFFB0B3C0)
    val TextDarkGray = Color(0xFF7A7D8A)
    val Divider = Color(0xFF4A4D5A)
}

data class Item(val nombre: String, val precio: Double, val cantidad: Int)
data class Sucursal(val nombre: String, val lat: Double, val lng: Double)

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Configuration.getInstance().userAgentValue = "MiEmpresaCajeroApp/1.0"

        val nombres = intent.getStringArrayListExtra("nombres") ?: arrayListOf("Producto demo")
        val precios = intent.getDoubleArrayExtra("precios") ?: doubleArrayOf(5.0)
        val cantidades = intent.getIntArrayExtra("cantidades") ?: intArrayOf(1)

        val items = nombres.indices.map {
            Item(nombres[it], precios.getOrElse(it) { 0.0 }, cantidades.getOrElse(it) { 1 })
        }
        val total = items.sumOf { it.precio * it.cantidad }

        setContent {
            MaterialTheme(colorScheme = lightColorScheme(
                primary = AppColors.Primary,
                background = AppColors.Background,
                surface = AppColors.Surface,
                onPrimary = AppColors.TextWhite,
                onBackground = AppColors.TextWhite,
                onSurface = AppColors.TextWhite,
                scrim = Color(0xCC000000)
            )) {
                CajeroScreen(items, total) { sucursal -> enviarAPagoConfirmado(total, sucursal) }
            }
        }
    }

    private fun enviarAPagoConfirmado(total: Double, sucursal: Sucursal) {
        val intent = Intent("com.grupo.carrito.ACTION_PAGO").apply {
            putExtra("total", total)
            putExtra("sucursal_nombre", sucursal.nombre)
            putExtra("sucursal_lat", sucursal.lat)
            putExtra("sucursal_lng", sucursal.lng)
            setPackage("com.grupo.app3envio")
        }
        startActivity(intent)
    }
}

@Composable
fun MapaSucursales(sucursales: List<Sucursal>, onSeleccionar: (Sucursal) -> Unit) {
    AndroidView(
        modifier = Modifier.fillMaxWidth().height(250.dp).clipToBounds(),
        factory = { ctx ->
            MapView(ctx).apply {
                setTileSource(TileSourceFactory.MAPNIK)
                setMultiTouchControls(true)
                controller.setZoom(11.0)
                controller.setCenter(GeoPoint(-0.2201, -78.5123))

                sucursales.forEach { s ->
                    val marker = Marker(this)
                    marker.position = GeoPoint(s.lat, s.lng)
                    marker.title = s.nombre
                    marker.setOnMarkerClickListener { _, _ ->
                        onSeleccionar(s)
                        Toast.makeText(ctx, "Seleccionaste ${s.nombre}", Toast.LENGTH_SHORT).show()
                        true
                    }
                    overlays.add(marker)
                }
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CajeroScreen(items: List<Item>, total: Double, onConfirmar: (Sucursal) -> Unit) {
    val sucursales = listOf(
        Sucursal("Sucursal Centro", -0.2201, -78.5123),
        Sucursal("Sucursal Norte", -0.1807, -78.4678),
        Sucursal("Sucursal Sur", -0.2712, -78.5495)
    )
    var seleccionada by remember { mutableStateOf<Sucursal?>(null) }
    var mostrarConfirmacion by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Cajero", fontWeight = FontWeight.SemiBold) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = AppColors.Primary,
                    titleContentColor = AppColors.TextWhite
                )
            )
        },
        containerColor = AppColors.Background,
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // --- Card: resumen del carrito ---
            Card(
                elevation = CardDefaults.cardElevation(2.dp),
                colors = CardDefaults.cardColors(containerColor = AppColors.Surface)
            ) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.ShoppingCart, contentDescription = null,
                            tint = AppColors.Primary)
                        Spacer(Modifier.width(8.dp))
                        Text("Resumen del carrito",
                            style = MaterialTheme.typography.titleMedium,
                            color = AppColors.TextWhite)
                    }
                    Spacer(Modifier.height(8.dp))
                    if (items.isEmpty()) {
                        Text("No se recibieron productos.",
                            color = AppColors.Primary)
                    } else {
                        items.forEach {
                            Row(
                                Modifier.fillMaxWidth().padding(vertical = 2.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("${it.nombre} x${it.cantidad}",
                                    color = AppColors.TextGray)
                                Text("$${"%.2f".format(it.precio * it.cantidad)}",
                                    color = AppColors.TextGray)
                            }
                        }
                        HorizontalDivider(
                            Modifier.padding(vertical = 8.dp),
                            color = AppColors.Divider
                        )
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Total a pagar",
                                style = MaterialTheme.typography.titleMedium,
                                color = AppColors.TextWhite)
                            Text(
                                "$${"%.2f".format(total)}",
                                style = MaterialTheme.typography.titleMedium,
                                color = AppColors.Primary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // --- Card: mapa de sucursales ---
            Card(
                elevation = CardDefaults.cardElevation(2.dp),
                colors = CardDefaults.cardColors(containerColor = AppColors.Surface)
            ) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.LocationOn, contentDescription = null,
                            tint = AppColors.Primary)
                        Spacer(Modifier.width(8.dp))
                        Text("¿En qué sucursal vas a pagar?",
                            style = MaterialTheme.typography.titleMedium,
                            color = AppColors.TextWhite)
                    }
                    Spacer(Modifier.height(8.dp))
                    MapaSucursales(sucursales) { seleccionada = it }

                    seleccionada?.let {
                        Spacer(Modifier.height(8.dp))
                        Row(
                            Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("✓ ",
                                color = AppColors.Primary)
                            Text("Seleccionada: ${it.nombre}",
                                color = AppColors.TextWhite)
                            TextButton(
                                onClick = { seleccionada = null }
                            ) {
                                Text("Cambiar", color = AppColors.TextDarkGray)
                            }
                        }
                    }
                }
            }

            Spacer(Modifier.weight(1f))

            Button(
                onClick = { mostrarConfirmacion = true },
                enabled = seleccionada != null && items.isNotEmpty(),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AppColors.Primary,
                    disabledContainerColor = AppColors.PrimaryDisabled,
                    contentColor = AppColors.TextWhite,
                    disabledContentColor = AppColors.TextDarkGray
                )
            ) {
                Text(if (seleccionada != null) "Confirmar pago de $${"%.2f".format(total)}" else "Elige una sucursal para continuar")
            }
        }
    }

    if (mostrarConfirmacion && seleccionada != null) {
        AlertDialog(
            onDismissRequest = { mostrarConfirmacion = false },
            containerColor = AppColors.Surface,
            title = { Text("Confirmar pago",
                color = AppColors.TextWhite) },
            text = { Text("Vas a pagar $${"%.2f".format(total)} en ${seleccionada!!.nombre}. ¿Continuar?",
                color = AppColors.TextGray) },
            confirmButton = {
                TextButton(
                    onClick = {
                        mostrarConfirmacion = false
                        scope.launch { snackbarHostState.showSnackbar("Pago enviado, redirigiendo a envío...") }
                        onConfirmar(seleccionada!!)
                    }
                ) {
                    Text("Confirmar", color = AppColors.Primary)
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { mostrarConfirmacion = false }
                ) {
                    Text("Cancelar", color = AppColors.TextDarkGray)
                }
            }
        )
    }
}