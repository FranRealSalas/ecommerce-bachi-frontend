import axiosInstance from "@/lib/axios";
import { ProductResponseDTO } from "@/types/product";
import { AxiosError } from "axios";

const ProductService = {
    async getProducts(): Promise<ProductResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async getProductsByCategory(category: string): Promise<ProductResponseDTO[]> {
        return new Promise((resolve, reject) => {
            axiosInstance
                .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/category/${category}`)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },
    async createProduct(name: string, description: string, price: number, category: string): Promise<ProductResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products`, { name, description, price, category })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async uploadProductImage(id: number, file: File): Promise<ProductResponseDTO> {
        const formData = new FormData();
        formData.append("file", file);

        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/upload-product-image/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => {
                    if (error.isAxiosError) reject(error)
                    reject(error.response?.data || error)
                })
        })
    },
    async updateProduct(id: number, name: string, description: string, price: number, category: string): Promise<ProductResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/${id}`, {
                name,
                description,
                price,
                category
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async deleteProduct(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/${id}`)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

}

export default ProductService;