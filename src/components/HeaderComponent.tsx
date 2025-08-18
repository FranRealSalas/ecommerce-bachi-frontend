import { useState } from "react";

function HeaderComponent({ loggedUser }: { loggedUser: string | null }) {
    const [openLogout, setOpenLogout] = useState(false);

    const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("username");
      window.location.reload();
    }
  };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center relative">
            <h1 className="text-2xl font-bold text-gray-800">Gol & Flow ⚽</h1>
            <nav className="flex space-x-6 items-center">
                <a href="/" className="text-gray-600 hover:text-green-600 hover:underline">Inicio</a>
                <a href="/products" className="text-gray-600 hover:text-green-600 hover:underline">Productos</a>
                <a href="/cart" className="text-gray-600 hover:text-green-600 hover:underline">Carrito</a>
                {loggedUser ? (
                    <div className="relative">
                        <span
                            className="text-gray-600 hover:text-green-600 hover:underline cursor-pointer"
                            onClick={() => setOpenLogout(!openLogout)}
                        >
                            {loggedUser}
                        </span>

                        {openLogout && (
                            <div
                                className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50"
                            >
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
                    <a href="/login" className="text-gray-600 hover:text-green-600 hover:underline">Iniciar sesión</a>
                )}
            </nav>
        </div>
    );
}

export default HeaderComponent;
