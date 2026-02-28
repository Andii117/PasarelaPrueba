import axios from "axios";

const API_URL = "http://localhost:3000";

export const transactionService = {
  createTransaction: async (data: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/transactions/createTransaction`,
        data,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || "Error al procesar la transacción";
    }
  },
};
