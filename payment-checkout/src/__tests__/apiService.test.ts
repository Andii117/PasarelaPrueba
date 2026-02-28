import axios from "axios";
import { apiService } from "../services/apiService";

jest.mock("axios", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  };
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    create: jest.fn(() => mockAxiosInstance),
  };
});

const mockAxiosInstance = (axios.create as jest.Mock)();

describe("apiService — getProduct", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a GET /products/featured", async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { id: "1", name: "Producto" },
    });
    await apiService.getProduct();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith("/products/featured");
  });

  it("retorna los datos del producto", async () => {
    const product = { id: "1", name: "Producto Test", price: 90000 };
    mockAxiosInstance.get.mockResolvedValue({ data: product });
    const result = await apiService.getProduct();
    expect(result).toEqual(product);
  });

  it("lanza error si el request falla", async () => {
    mockAxiosInstance.get.mockRejectedValue(new Error("Network Error"));
    await expect(apiService.getProduct()).rejects.toThrow("Network Error");
  });
});

describe("apiService — createTransaction", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a POST /transactions con el payload correcto", async () => {
    const payload = {
      productId: "prod-1",
      amount: 101000,
      customerData: { name: "Juan Pérez" },
    };
    mockAxiosInstance.post.mockResolvedValue({
      data: { transactionId: "txn_123" },
    });
    await apiService.createTransaction(payload);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      "/transactions",
      payload,
    );
  });

  it("retorna los datos de la transacción creada", async () => {
    const response = { transactionId: "txn_123", status: "PENDING" };
    mockAxiosInstance.post.mockResolvedValue({ data: response });
    const result = await apiService.createTransaction({
      productId: "prod-1",
      amount: 101000,
      customerData: {},
    });
    expect(result).toEqual(response);
  });

  it("lanza error si el request falla", async () => {
    mockAxiosInstance.post.mockRejectedValue(new Error("Server Error"));
    await expect(
      apiService.createTransaction({
        productId: "1",
        amount: 0,
        customerData: {},
      }),
    ).rejects.toThrow("Server Error");
  });
});

describe("apiService — updateTransaction", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a PATCH /transactions/:id con el status correcto", async () => {
    mockAxiosInstance.patch.mockResolvedValue({ data: { status: "APPROVED" } });
    await apiService.updateTransaction("txn_123", "APPROVED");
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
      "/transactions/txn_123",
      {
        status: "APPROVED",
      },
    );
  });

  it("retorna los datos actualizados", async () => {
    const response = { transactionId: "txn_123", status: "APPROVED" };
    mockAxiosInstance.patch.mockResolvedValue({ data: response });
    const result = await apiService.updateTransaction("txn_123", "APPROVED");
    expect(result).toEqual(response);
  });

  it("lanza error si el request falla", async () => {
    mockAxiosInstance.patch.mockRejectedValue(new Error("Not Found"));
    await expect(
      apiService.updateTransaction("txn_invalid", "APPROVED"),
    ).rejects.toThrow("Not Found");
  });

  it("construye correctamente la URL con el transactionId", async () => {
    mockAxiosInstance.patch.mockResolvedValue({ data: {} });
    await apiService.updateTransaction("abc-456", "FAILED");
    expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
      "/transactions/abc-456",
      { status: "FAILED" },
    );
  });
});
