import axiosInstance from "@/lib/axios";
import { CartRequestDTO, CartResponseDTO } from "@/types/cart";

const CartService = {
    async getCart(username: string): Promise<CartResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/cart/${username}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async addItemToCart(username: string, cartRequestDTO: CartRequestDTO): Promise<CartResponseDTO> {
        return new Promise((resolve, reject) => {
            axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/cart/add/${username}`, cartRequestDTO)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async clearCart(username: string): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/cart/clear/${username}`)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async removeItemFromCart(username: string, productId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/cart/${username}/item/${productId}`)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    async removeOneFromCart(username: string, productId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            axiosInstance.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/cart/${username}/item/${productId}/one`)
                .then(() => {
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};

export default CartService;
