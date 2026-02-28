export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface CheckoutState {
  currentStep: number;
  productId: string;
  productName: string;
  productPrice: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
  deliveryName: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPhone: string;
  clientIp: string;
}

export interface TransactionState {
  transactionId: string | null;
  status: "IDLE" | "PENDING" | "APPROVED" | "FAILED";
}

export interface MultiProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
