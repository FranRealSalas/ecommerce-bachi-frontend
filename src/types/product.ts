export type Product = {
    id: number;
    name: string;
    category: string;
    description: string;
    price: number;
}

export type ProductResponseDTO = {
    id: number;
    product_name: string;
    category: string;
    description: string;
    price: number;
}
