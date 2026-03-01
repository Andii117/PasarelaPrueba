import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { transactionService } from "./transactionService";

// Mock de axios
vi.mock("axios");

describe("transactionService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("createTransaction debe enviar los datos correctamente y retornar la respuesta", async () => {
    const mockData = { productId: "123", amount: 5000 };
    const mockResponse = { data: { id: "trans_001", status: "PENDING" } };

    // Simulamos respuesta exitosa
    (axios.post as any).mockResolvedValueOnce(mockResponse);

    const result = await transactionService.createTransaction(mockData);

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3000/transactions/createTransaction",
      mockData,
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("debe lanzar el mensaje de error del servidor si la petición falla", async () => {
    const mockData = { productId: "123" };
    const serverErrorMessage = "El producto no tiene stock";

    // Simulamos un error de Axios con respuesta del servidor
    const mockError = {
      response: {
        data: serverErrorMessage,
      },
    };
    (axios.post as any).mockRejectedValueOnce(mockError);

    // Verificamos que el catch relance el error correctamente
    await expect(transactionService.createTransaction(mockData)).rejects.toBe(
      serverErrorMessage,
    );
  });

  it("debe lanzar un mensaje genérico si el servidor no responde con data", async () => {
    // Simulamos un error donde no hay response.data (ej: error de red)
    (axios.post as any).mockRejectedValueOnce(new Error("Network Error"));

    await expect(transactionService.createTransaction({})).rejects.toBe(
      "Error al procesar la transacción",
    );
  });
});
