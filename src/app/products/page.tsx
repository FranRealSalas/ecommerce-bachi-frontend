"use client"
import HeaderComponent from "@/components/HeaderComponent";
import ProductComponent from "@/components/ProductViewComponent";
import Modal from "@/modals/Modal";
import CartService from "@/services/CartService";
import ProductService from "@/services/ProductService";
import { ProductResponseDTO } from "@/types/product";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponseDTO[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "camisetas",
    });
    const [selectedProduct, setSelectedProduct] = useState<ProductResponseDTO | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [editOpen, setEditOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: selectedProduct?.name || "",
        description: selectedProduct?.description || "",
        price: selectedProduct?.price || 0,
        category: selectedProduct?.category || "",
    });
    const [loggedUser, setLoggedUser] = useState<string | null>(null);


    const openProductModal = (product: ProductResponseDTO) => {
        setSelectedProduct(product);
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
    };

    const fetchProducts = async () => {
        try {
            const response = await ProductService.getProducts();
            setProducts(response);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem("username");
        setLoggedUser(user);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setSelectedCategory(category);

        try {
            let filteredProducts: ProductResponseDTO[] = [];

            if (category === "") {
                // Traer todos los productos
                const allProducts = await ProductService.getProducts();
                filteredProducts = allProducts ?? [];
            } else {
                try {
                    // Traer productos filtrados por categoría
                    const productsByCategory = await ProductService.getProductsByCategory(category);
                    filteredProducts = productsByCategory ?? [];
                } catch (err: any) {
                    if (err.response?.status === 404) {
                        // No hay productos en esa categoría
                        filteredProducts = [];
                    } else {
                        throw err; // si es otro error, lo relanza
                    }
                }
            }

            setProducts(filteredProducts);

        } catch (error) {
            console.error("Error al filtrar productos:", error);
            setProducts([]); // fallback si falla la petición
        }
    };



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { name, description, price, category } = formData;
            const response = await ProductService.createProduct(name, description, price, category);
            console.log("Producto creado:", response);
            // Opcional: resetear campos o cerrar modal
        } catch (error) {
            console.error("Error al crear producto:", error);
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: name === "price" ? Number(value) : value,
        });
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

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <HeaderComponent loggedUser={loggedUser}></HeaderComponent>
            </header>

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
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L10 13.414 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setModalOpen(!modalOpen)
                            }}
                            className="flex items-center gap-2 text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 font-semibold px-5 py-2 rounded-lg transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Agregar producto
                        </button>
                    </div>
                </div>

                {/* Modal para crear producto */}
                {modalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setModalOpen(false)} // cerrar al clickear fondo
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto border border-gray-200 relative animate-fadeIn"
                            onClick={(e) => e.stopPropagation()} // evita cerrar si clickeas dentro
                        >
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col space-y-5 bg-gradient-to-r from-green-100 to-green-200 p-8 rounded-2xl"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 text-center">
                                    Crear Producto
                                </h2>

                                {/* Nombre */}
                                <input
                                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    name="name"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                {/* Descripción */}
                                <textarea
                                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                                    name="description"
                                    placeholder="Descripción"
                                    value={formData.description}
                                    onChange={() => handleChange}
                                    rows={3}
                                />

                                {/* Precio */}
                                <input
                                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    name="price"
                                    type="number"
                                    placeholder="Precio"
                                    value={formData.price}
                                    onChange={handleChange}
                                />

                                {/* Categoría */}
                                <select
                                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona una categoría</option>
                                    <option value="camisetas">Camisetas</option>
                                    <option value="pantalones">Pantalones</option>
                                    <option value="calzado">Calzado</option>
                                    <option value="mas">Más</option>
                                </select>

                                {/* Imagen */}
                                <div className="flex flex-col space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Imagen del producto
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Botón submit */}
                                <button
                                    type="submit"
                                    className="w-full rounded-lg px-4 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition"
                                >
                                    Agregar Producto
                                </button>
                            </form>
                        </div>
                    </div>
                )}


            </section>

            {/* Grid de Productos */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
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
                                                if (!selectedProduct) return;
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
                                            onClick={handleDelete}
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
                                onClick={() => {
                                    handleAddToCart(selectedProduct);
                                }}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products && products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id}>
                                <ProductComponent
                                    product={product}
                                    openProductModal={openProductModal}
                                    handleAddToCart={handleAddToCart}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 col-span-full text-center">
                            No hay productos en esta categoría.
                        </p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-6 mt-12">
                <p>© 2025 Gol & Flow. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}
