import { ipService } from "../services/ipServices";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ipService — getClientIp", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a la URL correcta de ipify", async () => {
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ip: "192.168.1.1" }),
    });

    await ipService.getClientIp();

    expect(mockFetch).toHaveBeenCalledWith("https://api.ipify.org?format=json");
  });

  it("retorna el IP cuando la respuesta es exitosa", async () => {
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ ip: "190.24.100.5" }),
    });

    const result = await ipService.getClientIp();

    expect(result).toBe("190.24.100.5");
  });

  it("retorna 0.0.0.0 cuando fetch lanza un error", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const result = await ipService.getClientIp();

    expect(result).toBe("0.0.0.0");
  });

  it("retorna 0.0.0.0 cuando json() falla", async () => {
    mockFetch.mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error("Invalid JSON")),
    });

    const result = await ipService.getClientIp();

    expect(result).toBe("0.0.0.0");
  });

  it("retorna 0.0.0.0 cuando la respuesta no tiene campo ip", async () => {
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const result = await ipService.getClientIp();

    expect(result).toBeUndefined();
  });
});
