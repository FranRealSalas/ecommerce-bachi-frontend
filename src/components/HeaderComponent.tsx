import CartService from "@/services/CartService";
import { CartResponseDTO } from "@/types/cart";
import { Home, Package, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function HeaderComponent({ loggedUser }: { loggedUser: string | null }) {
    const [openLogout, setOpenLogout] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [cart, setCart] = useState<CartResponseDTO>();


    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("username");
            window.location.reload();
        }
    };

    useEffect(() => {
        CartService.getCart(loggedUser!).then((response) => {
            setCart(response);
        });
    }, [loggedUser]);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenLogout(false);
            }
        }
        if (openLogout) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openLogout]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center relative">
            <h1 className="text-2xl font-bold text-gray-800">Gol & Flow ⚽</h1>
            <nav className="flex space-x-4 items-center">
                {/* Inicio */}
                <a
                    href="/"
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition"
                >
                    <Home className="w-5 h-5" />
                    <span>Inicio</span>
                </a>

                {/* Productos */}
                <a
                    href="/products"
                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition"
                >
                    <Package className="w-5 h-5" />
                    <span>Productos</span>
                </a>

                {/* Carrito */}
                <a
                    href="/cart"
                    className="relative flex items-center gap-2 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition"
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Carrito</span>

                    {cart && cart.totalItems > 0 &&(
                        <span className="absolute -top-1 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                            {cart.totalItems}
                        </span>
                    )}
                </a>

                {/* Usuario o Login */}
                {loggedUser ? (
                    <div className="relative" ref={menuRef}>
                        <span
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 cursor-pointer transition"
                            onClick={() => setOpenLogout(!openLogout)}
                        >
                            👤 {loggedUser}
                        </span>

                        {openLogout && (
                            <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50">
                                <span
                                    className="text-red-600 cursor-pointer hover:underline"
                                    onClick={handleLogout}
                                >
                                    Salir
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    <a
                        href="/login"
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition"
                    >
                        👤 Iniciar sesión
                    </a>
                )}
            </nav>

        </div>
    );
}

export default HeaderComponent;
