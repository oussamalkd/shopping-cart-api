export {};

declare global {
  interface IProduct {
    ProductID: number;
    ProductName: string;
    Category: string;
    Price: number;
  }

  interface ISale {
    SaleID: number;
    ProductId: number;
    Quantity: number;
    Date: Date;
    TotalAmount: number;
  }
}
