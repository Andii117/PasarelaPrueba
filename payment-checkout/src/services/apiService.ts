import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export const apiService = {
  getProduct: async () => {
    const { data } = await api.get("/products/featured");
    return data;
  },

  createTransaction: async (payload: {
    productId: string;
    amount: number;
    customerData: object;
  }) => {
    const { data } = await api.post("/transactions", payload);
    return data;
  },

  updateTransaction: async (transactionId: string, status: string) => {
    const { data } = await api.patch(`/transactions/${transactionId}`, {
      status,
    });
    return data;
  },
};
