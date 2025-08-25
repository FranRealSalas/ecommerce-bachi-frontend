"use client";

import HeaderComponent from "@/components/HeaderComponent";
import CartService from "@/services/CartService";
import { CartResponseDTO } from "@/types/cart";
import { useEffect, useState } from "react";

export default function CartPage() {
    const [loggedUser, setLoggedUser] = useState<string | null>(null);
    const [cart, setCart] = useState<CartResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const loadCart = () => {
        if (!loggedUser) return;
        CartService.getCart(loggedUser)
            .then(setCart)
            .catch((error) => console.error("Error al obtener carrito:", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const user = localStorage.getItem("username");
        setLoggedUser(user);
    }, []);

    useEffect(() => {
        if (loggedUser) {
            loadCart();
        } else {
            setLoading(false);
        }
    }, [loggedUser]);

    const handleIncrease = (productId: number, price: number) => {
        if (!loggedUser) return;
        CartService.addItemToCart(loggedUser, {
            productCartId: productId,
            productPrice: price,
            quantity: 1
        })
            .then(loadCart)
            .catch((error) => console.error("Error al aumentar cantidad:", error));
    };

    const handleDecrease = (productId: number) => {
        if (!loggedUser) return;
        CartService.removeOneFromCart(loggedUser, productId)
            .then(loadCart)
            .catch((error) => console.error("Error al disminuir cantidad:", error));
    };

    const handleRemoveItem = (productId: number) => {
        if (!loggedUser) return;
        CartService.removeItemFromCart(loggedUser, productId)
            .then(loadCart)
            .catch((error) => console.error("Error al eliminar item:", error));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <HeaderComponent loggedUser={loggedUser} />
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-200 to-green-600 text-white text-center py-16 px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Tu carrito de compras</h2>
                <p className="text-lg">Revisá los productos antes de finalizar la compra</p>
            </section>

            {/* Contenido del carrito */}
            <main className="flex-1 max-w-4xl mx-auto px-4 py-16">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando carrito...</p>
                ) : !cart || cart.items.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                            0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 
                            14l.84-2h8.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a.996.996 
                            0 0 0-.87-1.48H5.21L4.27 2H1v2h2l3.6 7.59-1.35 
                            2.44C5.08 14.37 5 14.68 5 15c0 1.1.9 2 2 
                            2h12v-2H7.42c-.14 0-.25-.11-.26-.25z"/>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700">Tu carrito está vacío</h3>
                        <p className="text-gray-500 text-center">
                            Agregá productos para verlos acá.
                        </p>
                        <a
                            href="/products"
                            className="mt-4 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
                        >
                            Ver productos
                        </a>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-8 flex flex-col gap-6">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Productos en tu carrito</h3>
                        <ul className="divide-y divide-gray-200">
                            {cart.items.map((item) => (
                                <li
                                    key={item.productId}
                                    className="py-4 flex items-center gap-4"
                                >
                                    {/* Imagen */}
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/uploads/products/${item.productId}`}
                                        alt={item.productName}
                                        className="rounded-md h-16 w-16 object-cover"
                                    />

                                    {/* Info */}
                                    <div className="flex-1">
                                        <h4 className="text-gray-800 font-medium truncate max-w-xs">
                                            {item.productName}
                                        </h4>
                                        <button
                                            onClick={() => handleRemoveItem(item.productId)}
                                            className="text-blue-500 text-sm hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDecrease(item.productId)}
                                            className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                        >
                                            −
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.productId, item.productPrice)}
                                            className="px-2 py-1 border rounded text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Precio */}
                                    <div className="flex flex-col items-end w-24">
                                        <span className="text-lg font-semibold text-gray-800">
                                            ${item.totalItemPrice}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            (${item.productPrice} c/u)
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Total y botón de pagar */}
                        <div className="mt-6 flex justify-between items-center border-t pt-4">
                            <span className="text-xl font-semibold text-gray-800">
                                Total: ${cart.totalPrice}
                            </span>
                            <button
                                className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-medium px-6 py-2 rounded-lg transition"
                                onClick={() => console.log("Pagar funcionalidad pendiente")}
                            >
                                Pagar
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-6 mt-12">
                <p>© 2025 Gol & Flow. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
