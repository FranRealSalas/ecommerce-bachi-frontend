import { ProductResponseDTO } from "@/types/product";

function ProductComponent({ product, openProductModal, handleAddToCart }: { product: ProductResponseDTO, openProductModal: any, handleAddToCart: any }) {

    return (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all hover:shadow-lg flex flex-col">
            {/* Imagen */}
            <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/uploads/products/${product.id}`}
                alt={product.name}
                className="w-full h-48 object-cover"
            />

            {/* Contenido */}
            <div className="p-4 flex flex-col flex-1">
                <h4 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <p className="text-green-700 font-bold text-lg mt-2">${product.price}</p>

                {/* Botones */}
                <div className="flex items-center justify-between mt-auto pt-4">
                    <button
                        onClick={() => openProductModal(product)}
                        className="flex-1 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition text-sm"
                    >
                        Ver más
                    </button>
                    <button
                        onClick={() => handleAddToCart(product)}
                        className="ml-3 flex items-center justify-center w-10 h-10 rounded-full text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-transform transform hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 
                            0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 
                            14l.84-2h8.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49a.996.996 
                            0 0 0-.87-1.48H5.21L4.27 2H1v2h2l3.6 7.59-1.35 
                            2.44C5.08 14.37 5 14.68 5 15c0 1.1.9 2 2 
                            2h12v-2H7.42c-.14 0-.25-.11-.26-.25z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductComponent;
