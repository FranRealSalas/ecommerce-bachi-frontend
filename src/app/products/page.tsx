"use client";
import HeaderComponent from "@/components/HeaderComponent";
import ProductService from "@/services/ProductService";
import { ProductResponseDTO } from "@/types/product";
import { useEffect, useState } from "react";
import AllProductsComponent from "@/components/AllProductsComponent";
import ProductModal from "@/components/ProductModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProducts();
      setProducts(response);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    setLoggedUser(user);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);

    try {
      let filteredProducts: ProductResponseDTO[] = [];
      if (category === "") {
        filteredProducts = await ProductService.getProducts();
      } else {
        try {
          const productsByCategory = await ProductService.getProductsByCategory(category);
          filteredProducts = productsByCategory ?? [];
        } catch (err: any) {
          if (err.response?.status === 404) filteredProducts = [];
          else throw err;
        }
      }
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error al filtrar productos:", error);
      setProducts([]);
    }
  };

  const handleClose = () => setModalOpen(false);

  const handleSave = async (data: {
    name: string;
    price: string;
    description: string;
    category: string;
    image: File | null;
  }) => {
    try {
      // 1. Crear el producto con ProductService
      const savedProduct = await ProductService.createProduct(
        data.name,
        data.description,
        parseFloat(data.price), // asegurar que sea number
        data.category
      );

      console.log("Producto creado:", savedProduct);

      // 2. Si hay imagen, subirla
      if (data.image) {
        const updatedProduct = await ProductService.uploadProductImage(savedProduct.id, data.image);
        console.log("Producto con imagen:", updatedProduct);
      }

      handleClose();      // cerrar modal
      await fetchProducts(); // recargar productos

    } catch (err) {
      console.error("Error al guardar producto:", err);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <HeaderComponent loggedUser={loggedUser} />
      </header>

      {/* Sección de filtros y botón crear */}
      <section className="bg-gradient-to-r from-green-300 to-green-500 text-gray-800 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Productos</h2>

          <div className="bg-white shadow-md rounded-xl px-6 py-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full appearance-none bg-white border border-green-600 text-green-800 font-medium rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Todas las categorías</option>
                <option value="camisetas">Camisetas</option>
                <option value="pantalones">Pantalones</option>
                <option value="calzado">Calzado</option>
                <option value="mas">Más</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-green-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L10 13.414 5.293 8.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 font-semibold px-5 py-2 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar producto
            </button>
          </div>
        </div>

        {/* Modal */}
        <ProductModal isOpen={modalOpen} onSave={handleSave} onClose={handleClose} />
      </section>

      {/* Grid de Productos */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <AllProductsComponent products={products} setProducts={setProducts} />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>© 2025 Gol & Flow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
