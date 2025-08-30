"use client"
import HeaderComponent from "@/components/HeaderComponent";
import ProductService from "@/services/ProductService";
import { ProductResponseDTO } from "@/types/product";
import { useEffect, useState } from "react";
import Modal from "@/modals/Modal";
import CartService from "@/services/CartService";

export default function Page() {
  const [products, setProducts] = useState<ProductResponseDTO[]>([]);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  // Estados para modal
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseDTO | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    ProductService.getProducts().then((response) => {
      setProducts(response);
    });
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("username");
    setLoggedUser(user);
  }, []);

  const closeProductModal = () => {
    setSelectedProduct(null);
    setShowMenu(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await ProductService.getProducts();
      setProducts(response);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct?.id) return;

    try {
      await ProductService.deleteProduct(selectedProduct.id);
      console.log("Producto eliminado:", selectedProduct.id);

      // Cierra el modal
      closeProductModal();

      // Refresca productos
      await fetchProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleAddToCart = async (product: ProductResponseDTO) => {
    if (!loggedUser) return;

    try {
      await CartService.addItemToCart(loggedUser, {
        productCartId: product.id,
        productPrice: product.price,
        quantity: 1,
      });
      console.log("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      console.log("No se pudo agregar al carrito");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct?.id) return;

    try {
      const updatedProduct = await ProductService.updateProduct(
        selectedProduct.id,
        editFormData.name,
        editFormData.description,
        editFormData.price,
        editFormData.category
      );

      console.log("Producto actualizado:", updatedProduct);

      // Cierra los modales
      setEditOpen(false);
      closeProductModal();

      // Refresca productos
      await fetchProducts();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? Number(value) : value,
    });
  };

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
              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition"
              >
                Ver más
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Modal de Producto */}
      {selectedProduct && (
        <Modal open={!!selectedProduct} setOpen={closeProductModal}>
          <div className="relative w-full max-w-md mx-auto p-3">
            {/* Botón de opciones */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h.01M12 12h.01M18 12h.01" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                  <button
                    onClick={() => {
                      setEditFormData({
                        name: selectedProduct.name,
                        description: selectedProduct.description,
                        price: selectedProduct.price,
                        category: selectedProduct.category,
                      });
                      setEditOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => {
                      // esta función la tenías en tu snippet
                      handleDelete?.();
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    🗑 Eliminar
                  </button>
                </div>
              )}
            </div>

            {/* Imagen */}
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/uploads/products/${selectedProduct.id}`}
              alt={selectedProduct.name}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />

            {/* Detalles */}
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
            <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
            <p className="text-green-700 text-xl font-semibold mb-4">${selectedProduct.price}</p>

            {/* Botón Agregar al carrito */}
            <button
              onClick={() => handleAddToCart?.(selectedProduct)}
              className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition"
            >
              Agregar al carrito
            </button>

            {/* Modal de edición */}
            {editOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                  <button
                    onClick={() => setEditOpen(false)}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Editar producto</h2>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="product_name"
                      placeholder="Nombre del producto"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      value={editFormData.name}
                      onChange={handleEditChange}
                    />
                    <input
                      type="text"
                      name="description"
                      placeholder="Descripción"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      value={editFormData.description}
                      onChange={handleEditChange}
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Precio"
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      value={editFormData.price}
                      onChange={handleEditChange}
                    />
                    <select
                      className="bg-white border border-green-700 rounded px-4 py-2 text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-green-600"
                      name="category"
                      value={editFormData.category ?? ""}
                      onChange={handleEditChange}
                    >
                      <option value="">Seleccioná una categoría</option>
                      <option value="camisetas">Camisetas</option>
                      <option value="pantalones">Pantalones</option>
                      <option value="calzado">Calzado</option>
                      <option value="mas">Más</option>
                    </select>

                    <div className="flex justify-end gap-2">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Guardar cambios
                      </button>
                      <button onClick={() => setEditOpen(false)} type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>© 2025 Gol & Flow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
