import { ProductResponseDTO } from "@/types/product";

function ProductComponent({ product, openProductModal }: { product: ProductResponseDTO, openProductModal: any }) {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition-shadow flex flex-col justify-between">
            <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/uploads/products/${product.id}`}
                alt={`${product.product_name}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{product.product_name}</h4>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-md text-green-700 font-bold mb-4">${product.price}</p>
            </div>
            <div className="flex justify-between items-center mt-auto space-x-2">
                <button
                    onClick={() => openProductModal(product)}
                    className="flex-1 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition text-sm"
                >
                    Ver más
                </button>
                <button className="flex items-center justify-center w-10 h-10 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className="w-6 h-6">
                        <path fill="currentColor" d="..." />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ProductComponent;