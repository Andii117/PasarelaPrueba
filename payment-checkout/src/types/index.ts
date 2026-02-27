export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface CheckoutState {
  currentStep: number;
  cardNumber: string;
  cardHolder: string;
  cardExpiry: string;
  cardCvv: string;
  deliveryName: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPhone: string;
}

export interface TransactionState {
  transactionId: string | null;
  status: "IDLE" | "PENDING" | "APPROVED" | "FAILED";
}

export interface ProductState {
  product: Product | null;
  stock: number;
  loading: boolean;
  error: string | null;
}
