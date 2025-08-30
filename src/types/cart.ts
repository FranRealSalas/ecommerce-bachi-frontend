export interface CartItemDTO {
    id?: number;
    productId: number;
    productName: string;
    productPrice: number;
    totalItemPrice: number;
    quantity: number;
}

export interface CartResponseDTO {
    id: number;
    username: string;
    totalPrice: number;
    totalItems: number;
    items: CartItemDTO[];
}

export interface CartRequestDTO {
    productCartId: number;
    productPrice: number;
    quantity: number;
}
