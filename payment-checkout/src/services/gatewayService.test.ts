import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { gatewayService } from "./gatewayService";

// Mock de axios
vi.mock("axios");

describe("gatewayService (Wompi Integration)", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("tokenizeCard debe mapear los datos correctamente y retornar el ID del token", async () => {
    const cardData = {
      number: "4111...",
      cvc: "123",
      expMonth: "12",
      expYear: "26",
      cardHolder: "Harold Jara",
    };

    const mockResponse = { data: { data: { id: "tok_test_123" } } };
    (axios.post as any).mockResolvedValueOnce(mockResponse);

    const result = await gatewayService.tokenizeCard(cardData);

    // Verificamos que se envíen las propiedades con snake_case (exp_month)
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/tokens/cards"),
      expect.objectContaining({
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
      }),
      expect.any(Object),
    );
    expect(result).toBe("tok_test_123");
  });

  it("processPayment debe convertir el monto a centavos y enviar el token", async () => {
    const payload = {
      transactionId: "REF-001",
      amount: 5000, // 5.000 COP
      cardToken: "tok_abc",
      installments: 3,
      customerEmail: "test@email.com",
    };

    const mockResponse = { data: { data: { status: "APPROVED" } } };
    (axios.post as any).mockResolvedValueOnce(mockResponse);

    const result = await gatewayService.processPayment(payload);

    // Verificación clave: el monto debe estar multiplicado por 100
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/transactions"),
      expect.objectContaining({
        amount_in_cents: 500000, // 5000 * 100
        customer_email: payload.customerEmail,
        payment_method: expect.objectContaining({
          token: "tok_abc",
        }),
      }),
      expect.any(Object),
    );
    expect(result.status).toBe("APPROVED");
  });
});
