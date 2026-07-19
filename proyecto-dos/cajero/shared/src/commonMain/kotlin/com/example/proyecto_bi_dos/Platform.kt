package com.example.proyecto_bi_dos

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform