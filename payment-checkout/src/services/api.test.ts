import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { apiService } from "./apiService";

// 1. Mock de axios
vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn().mockReturnThis(),
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
    },
  };
});

// Importamos el objeto mockeado para poder definir sus respuestas
import api from "axios";

describe("apiService", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("getProduct debe retornar la data correctamente", async () => {
    const mockProduct = { id: "1", name: "Sony Camera" };
    (api.get as any).mockResolvedValueOnce({ data: mockProduct });

    const result = await apiService.getProduct();

    expect(api.get).toHaveBeenCalledWith("/products/featured");
    expect(result).toEqual(mockProduct);
  });

  it("createTransaction debe enviar el payload correcto y recibir respuesta", async () => {
    const payload = {
      productId: "123",
      amount: 5000,
      customerData: { name: "Harold" },
    };
    const mockResponse = { transactionId: "TX-999" };

    (api.post as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await apiService.createTransaction(payload);

    expect(api.post).toHaveBeenCalledWith("/transactions", payload);
    expect(result).toEqual(mockResponse);
  });

  it("updateTransaction debe enviar el status a la ruta correcta", async () => {
    const transactionId = "TX-1";
    const status = "APPROVED";
    const mockResponse = { success: true };

    (api.patch as any).mockResolvedValueOnce({ data: mockResponse });

    const result = await apiService.updateTransaction(transactionId, status);

    expect(api.patch).toHaveBeenCalledWith(`/transactions/${transactionId}`, {
      status,
    });
    expect(result).toEqual(mockResponse);
  });
});
