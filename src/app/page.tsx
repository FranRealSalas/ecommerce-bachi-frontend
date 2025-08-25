"use client"
import HeaderComponent from "@/components/HeaderComponent";
import ProductService from "@/services/ProductService";
import { ProductResponseDTO } from "@/types/product";
import { useEffect, useState } from "react";

export default function Page() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    ProductService.getProducts().then((response) => {
      setProducts(response);
    });
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setLoggedUser(user);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <HeaderComponent loggedUser={loggedUser}></HeaderComponent>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-300 to-green-500 text-gray-800 text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Descubrí lo mejor en deportes y estilo</h2>
        <p className="text-lg">Ofertas exclusivas y productos seleccionados para vos</p>
      </section>

      {/* Productos Destacados */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-semibold mb-8 text-gray-800">Productos destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.sort(() => Math.random() - 0.5).slice(0, 3).map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition-shadow"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/uploads/products/${product.id}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="text-lg font-medium text-gray-800 mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <p className="text-lg font-semibold text-green-700 mb-4">${product.price}</p>
              <button className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition">
                Ver más
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>© 2025 Gol & Flow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
