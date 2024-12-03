export {};

declare global {
  interface Product {
    product_id: number;
    product_name: string;
    category: string;
    price: number;
  }

  interface Sale {
    sale_id: number;
    product_id: number;
    quantity: number;
    date: Date;
    total_amount: number;
  }
}
