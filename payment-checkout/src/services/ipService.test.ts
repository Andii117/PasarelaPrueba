import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { ipService } from "./ipServices";

// Mockeamos axios
vi.mock("axios");

describe("ipService con Axios", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("debe retornar la IP cuando la petición es exitosa", async () => {
    const mockIp = "190.0.0.1";
    // Simulamos la respuesta de axios
    (axios.get as any).mockResolvedValueOnce({ data: { ip: mockIp } });

    const result = await ipService.getClientIp();

    expect(axios.get).toHaveBeenCalledWith("https://api.ipify.org?format=json");
    expect(result).toBe(mockIp);
  });

  it('debe retornar "0.0.0.0" cuando la petición falla', async () => {
    // Simulamos un error de Axios
    (axios.get as any).mockRejectedValueOnce(new Error("Timeout"));

    const result = await ipService.getClientIp();

    expect(result).toBe("0.0.0.0");
  });
});
