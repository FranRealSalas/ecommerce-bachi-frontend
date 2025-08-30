"use client";
import { useState } from "react";
import ProductImageUploader from "./ProductImageUploader";

interface ProductForm {
  name: string;
  price: string;
  description: string;
  category: string; 
  image: File | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductForm) => void;
}) {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    price: "",
    description: "",
    category:"",
    image: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ name: "", price: "", description: "",category: "", image: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto border border-gray-200 relative p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Crear Producto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="mt-1 block w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="mt-1 block w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="mt-1 block w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
                value={formData.category}
                onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
                className="w-full appearance-none bg-white border border-green-600 text-green-800 font-medium rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Todas las categorías</option>
                <option value="camisetas">Camisetas</option>
                <option value="pantalones">Pantalones</option>
                <option value="calzado">Calzado</option>
                <option value="mas">Más</option>
              </select>
          </div>

          <ProductImageUploader
            onImageChange={(file) =>
              setFormData((prev) => ({ ...prev, image: file }))
            }
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
