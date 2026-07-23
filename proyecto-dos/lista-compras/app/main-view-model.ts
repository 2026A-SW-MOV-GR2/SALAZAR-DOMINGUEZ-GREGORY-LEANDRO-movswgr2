import { Observable, ObservableArray, Application, Utils, Dialogs } from '@nativescript/core';

export const TARGET_PACKAGE = "com.tuempresa.app2cajero";
export const TARGET_ACTIVITY = "com.tuempresa.app2cajero.MainActivity";

export interface PromoProduct {
    id: number;
    nombre: string;
    precio: number;
    tienda: string;
    imagen: string;
    latitude: number;
    longitude: number;
    isBestOffer?: boolean;
}

export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
    imagen: string;
}

export class MainViewModel extends Observable {
    private _promotions: Array<PromoProduct> = [
        {
            id: 2,
            nombre: "Leche Entera 1L",
            precio: 1.25,
            tienda: "Sucursal Norte",
            imagen: "~/images/leche.jpg",
            latitude: -0.1807,
            longitude: -78.4678,
            isBestOffer: true
        },
        {
            id: 1,
            nombre: "Aceite de Oliva 1L",
            precio: 8.50,
            tienda: "Sucursal Norte",
            imagen: "~/images/aceite.jpg",
            latitude: -0.1807,
            longitude: -78.4678
        },
        {
            id: 3,
            nombre: "Queso Fresco 500g",
            precio: 3.50,
            tienda: "Sucursal Norte",
            imagen: "~/images/queso.jpg",
            latitude: -0.1807,
            longitude: -78.4678
        },
        {
            id: 6,
            nombre: "Atún en Agua 170g",
            precio: 1.50,
            tienda: "Sucursal Centro",
            imagen: "~/images/atun.jpg",
            latitude: -0.2201,
            longitude: -78.5123,
            isBestOffer: true
        },
        {
            id: 5,
            nombre: "Pan Molde Integral",
            precio: 2.10,
            tienda: "Sucursal Centro",
            imagen: "~/images/pan.jpg",
            latitude: -0.2201,
            longitude: -78.5123
        },
        {
            id: 4,
            nombre: "Arroz Súper Extra 5kg",
            precio: 6.75,
            tienda: "Sucursal Centro",
            imagen: "~/images/arroz.jpg",
            latitude: -0.2201,
            longitude: -78.5123
        },
        {
            id: 9,
            nombre: "Manzanas 1kg",
            precio: 2.20,
            tienda: "Sucursal Sur",
            imagen: "~/images/manzanas.jpg",
            latitude: -0.2712,
            longitude: -78.5495,
            isBestOffer: true
        },
        {
            id: 8,
            nombre: "Yogurt Natural 1L",
            precio: 2.80,
            tienda: "Sucursal Sur",
            imagen: "~/images/yogurt.jpg",
            latitude: -0.2712,
            longitude: -78.5495
        },
        {
            id: 7,
            nombre: "Café Molido 250g",
            precio: 4.30,
            tienda: "Sucursal Sur",
            imagen: "~/images/cafe.jpg",
            latitude: -0.2712,
            longitude: -78.5495
        }
    ];

    private _cartItems: ObservableArray<CartItem> = new ObservableArray<CartItem>([]);
    private _selectedProduct: PromoProduct | null = null;
    private _selectedQuantity: number = 1;
    private _isDialogVisible: boolean = false;
    private _isCartVisible: boolean = false;

    constructor() {
        super();
        this.updateTotals();
    }

    get promotions(): Array<PromoProduct> {
        return this._promotions;
    }

    get cartItems(): ObservableArray<CartItem> {
        return this._cartItems;
    }

    get selectedProduct(): PromoProduct | null {
        return this._selectedProduct;
    }

    set selectedProduct(value: PromoProduct | null) {
        if (this._selectedProduct !== value) {
            this._selectedProduct = value;
            this.notifyPropertyChange('selectedProduct', value);
            this.notifyPropertyChange('selectedProductName', this.selectedProductName);
            this.notifyPropertyChange('selectedProductPriceFormatted', this.selectedProductPriceFormatted);
            this.notifyPropertyChange('selectedProductStore', this.selectedProductStore);
            this.notifyPropertyChange('selectedProductImage', this.selectedProductImage);
        }
    }

    get selectedProductName(): string {
        return this._selectedProduct ? this._selectedProduct.nombre : '';
    }

    get selectedProductPriceFormatted(): string {
        return this._selectedProduct ? `$${this._selectedProduct.precio.toFixed(2)}` : '$0.00';
    }

    get selectedProductStore(): string {
        return this._selectedProduct ? `📍 ${this._selectedProduct.tienda}` : '';
    }

    get selectedProductImage(): string {
        return this._selectedProduct ? this._selectedProduct.imagen : '';
    }

    get selectedQuantity(): number {
        return this._selectedQuantity;
    }

    set selectedQuantity(value: number) {
        if (this._selectedQuantity !== value && value >= 1) {
            this._selectedQuantity = value;
            this.notifyPropertyChange('selectedQuantity', value);
            this.notifyPropertyChange('dialogSubtotalFormatted', this.dialogSubtotalFormatted);
        }
    }

    get isDialogVisible(): boolean {
        return this._isDialogVisible;
    }

    set isDialogVisible(value: boolean) {
        if (this._isDialogVisible !== value) {
            this._isDialogVisible = value;
            this.notifyPropertyChange('isDialogVisible', value);
        }
    }

    get isCartVisible(): boolean {
        return this._isCartVisible;
    }

    set isCartVisible(value: boolean) {
        if (this._isCartVisible !== value) {
            this._isCartVisible = value;
            this.notifyPropertyChange('isCartVisible', value);
        }
    }

    get cartCount(): number {
        let count = 0;
        for (let i = 0; i < this._cartItems.length; i++) {
            const item = this._cartItems.getItem(i);
            if (item) {
                count += item.cantidad;
            }
        }
        return count;
    }

    get cartTotal(): number {
        let total = 0;
        for (let i = 0; i < this._cartItems.length; i++) {
            const item = this._cartItems.getItem(i);
            if (item) {
                total += item.subtotal;
            }
        }
        return total;
    }

    get cartTotalFormatted(): string {
        return `$${this.cartTotal.toFixed(2)}`;
    }

    get cartBadgeText(): string {
        return `🛒 (${this.cartCount})`;
    }

    get isCartEmpty(): boolean {
        return this._cartItems.length === 0;
    }

    get hasCartItems(): boolean {
        return this._cartItems.length > 0;
    }

    get dialogSubtotalFormatted(): string {
        if (!this._selectedProduct) return '$0.00';
        return `$${(this._selectedProduct.precio * this._selectedQuantity).toFixed(2)}`;
    }

    public selectProductForCart(product: PromoProduct): void {
        this.selectedProduct = product;
        this.selectedQuantity = 1;
        this.isDialogVisible = true;
    }

    public incrementQuantity(): void {
        this.selectedQuantity = this.selectedQuantity + 1;
    }

    public decrementQuantity(): void {
        if (this.selectedQuantity > 1) {
            this.selectedQuantity = this.selectedQuantity - 1;
        }
    }

    public confirmAddToCart(): void {
        if (!this._selectedProduct) return;

        let existingIndex = -1;
        for (let i = 0; i < this._cartItems.length; i++) {
            if (this._cartItems.getItem(i).id === this._selectedProduct.id) {
                existingIndex = i;
                break;
            }
        }

        const addedQty = this._selectedQuantity;

        if (existingIndex >= 0) {
            const currentItem = this._cartItems.getItem(existingIndex);
            const newQty = currentItem.cantidad + addedQty;
            const updatedItem: CartItem = {
                ...currentItem,
                cantidad: newQty,
                subtotal: currentItem.precio * newQty
            };
            this._cartItems.setItem(existingIndex, updatedItem);
        } else {
            const newItem: CartItem = {
                id: this._selectedProduct.id,
                nombre: this._selectedProduct.nombre,
                precio: this._selectedProduct.precio,
                cantidad: addedQty,
                subtotal: this._selectedProduct.precio * addedQty,
                imagen: this._selectedProduct.imagen
            };
            this._cartItems.push(newItem);
        }

        this.isDialogVisible = false;
        this.updateTotals();

        Dialogs.alert({
            title: "¡Producto añadido!",
            message: `Se añadió ${addedQty}x ${this._selectedProduct.nombre} al carrito.`,
            okButtonText: "Entendido"
        });
    }

    public cancelAddToCart(): void {
        this.isDialogVisible = false;
        this.selectedProduct = null;
    }

    public toggleCart(): void {
        this.isCartVisible = !this.isCartVisible;
    }

    public increaseCartItemQty(args: any): void {
        const item: CartItem = (args && args.object) ? args.object.bindingContext : args;
        if (!item || typeof item.id === 'undefined') return;
        let index = -1;
        for (let i = 0; i < this._cartItems.length; i++) {
            if (this._cartItems.getItem(i).id === item.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            const newQty = item.cantidad + 1;
            this._cartItems.setItem(index, {
                ...item,
                cantidad: newQty,
                subtotal: item.precio * newQty
            });
            this.updateTotals();
        }
    }

    public decreaseCartItemQty(args: any): void {
        const item: CartItem = (args && args.object) ? args.object.bindingContext : args;
        if (!item || typeof item.id === 'undefined') return;
        let index = -1;
        for (let i = 0; i < this._cartItems.length; i++) {
            if (this._cartItems.getItem(i).id === item.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            if (item.cantidad > 1) {
                const newQty = item.cantidad - 1;
                this._cartItems.setItem(index, {
                    ...item,
                    cantidad: newQty,
                    subtotal: item.precio * newQty
                });
            } else {
                this._cartItems.splice(index, 1);
            }
            this.updateTotals();
        }
    }

    public removeCartItem(args: any): void {
        const item: CartItem = (args && args.object) ? args.object.bindingContext : args;
        if (!item || typeof item.id === 'undefined') return;
        let index = -1;
        for (let i = 0; i < this._cartItems.length; i++) {
            if (this._cartItems.getItem(i).id === item.id) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            this._cartItems.splice(index, 1);
            this.updateTotals();
        }
    }

    private updateTotals(): void {
        this.notifyPropertyChange('cartCount', this.cartCount);
        this.notifyPropertyChange('cartTotal', this.cartTotal);
        this.notifyPropertyChange('cartTotalFormatted', this.cartTotalFormatted);
        this.notifyPropertyChange('cartBadgeText', this.cartBadgeText);
        this.notifyPropertyChange('isCartEmpty', this.isCartEmpty);
        this.notifyPropertyChange('hasCartItems', this.hasCartItems);
    }

    public procederAlPago(): void {
        if (this._cartItems.length === 0) {
            Dialogs.alert({
                title: "Carrito vacío",
                message: "Por favor agrega al menos un producto antes de proceder al pago.",
                okButtonText: "Aceptar"
            });
            return;
        }

        if (Application.android || typeof android !== 'undefined') {
            try {
                this.launchApp2IntentAndroid();
            } catch (error) {
                console.error("Error al lanzar el Intent Android:", error);
                Dialogs.alert({
                    title: "App 2 no encontrada",
                    message: `No se pudo iniciar la App 2 Cajero en este dispositivo.\n` +
                             `Para probar la integración:\n` +
                             `1. Abre la carpeta 'cajero' en Android Studio.\n` +
                             `2. Compila y ejecuta la App 2 en este mismo emulador.\n` +
                             `3. Regresa a esta App 1 y presiona 'Proceder al Pago'.\n\n` +
                             `Detalle técnico: ${error}`,
                    okButtonText: "Entendido"
                });
            }
        } else {
            Dialogs.alert({
                title: "Modo de Prueba (No-Android)",
                message: `Intent explícito preparado para ${TARGET_PACKAGE}:\n` +
                         `- Productos: ${this._cartItems.length}\n` +
                         `- Total: ${this.cartTotalFormatted}\n\n` +
                         `En un dispositivo Android real, esto abrirá la App 2 mediante android.content.Intent.`,
                okButtonText: "Entendido"
            });
        }
    }

    private launchApp2IntentAndroid(): void {
        const count = this._cartItems.length;

        const context = Utils.android.getApplicationContext() || 
                        Application.android.context || 
                        Application.android.foregroundActivity;

        if (!context) {
            throw new Error("No se pudo obtener el Context nativo de Android.");
        }

        const targetPackages = [
            { pkg: TARGET_PACKAGE, act: TARGET_ACTIVITY },
            { pkg: "com.example.proyecto_bi_dos", act: "com.example.proyecto_bi_dos.MainActivity" }
        ];

        let launched = false;
        let lastError: any = null;

        for (const target of targetPackages) {
            try {
                const intent = new android.content.Intent();
                const componentName = new android.content.ComponentName(target.pkg, target.act);
                intent.setComponent(componentName);

                const nombresArrayList = new java.util.ArrayList<string>();
                const preciosArray = (global as any).Array.create ? 
                                     (global as any).Array.create("double", count) : 
                                     java.lang.reflect.Array.newInstance(java.lang.Double.TYPE, count);

                const cantidadesArray = (global as any).Array.create ? 
                                       (global as any).Array.create("int", count) : 
                                       java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, count);

                for (let i = 0; i < count; i++) {
                    const item = this._cartItems.getItem(i);
                    nombresArrayList.add(item.nombre);
                    preciosArray[i] = item.precio;
                    cantidadesArray[i] = item.cantidad;
                }

                intent.putStringArrayListExtra("nombres", nombresArrayList);
                intent.putExtra("precios", preciosArray);
                intent.putExtra("cantidades", cantidadesArray);
                intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

                context.startActivity(intent);
                launched = true;
                break;
            } catch (err) {
                lastError = err;
            }
        }

        if (!launched) {
            throw lastError || new Error(`No se encontró la actividad destino en el sistema.`);
        }
    }
}
