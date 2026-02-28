import axios from "axios";
import { gatewayService } from "../services/gatewayService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const GATEWAY_URL = "https://api-sandbox.co.uat.wompi.dev/v1";

describe("gatewayService — tokenizeCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a POST /tokens/cards con los datos correctos", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: "tok_test_123" } },
    });

    await gatewayService.tokenizeCard({
      number: "4111111111111111",
      cvc: "123",
      expMonth: "12",
      expYear: "26",
      cardHolder: "JUAN PEREZ",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${GATEWAY_URL}/tokens/cards`,
      {
        number: "4111111111111111",
        cvc: "123",
        exp_month: "12",
        exp_year: "26",
        card_holder: "JUAN PEREZ",
      },
      { headers: { Authorization: "Bearer " } },
    );
  });

  it("retorna el token id de la tarjeta", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { id: "tok_test_abc123" } },
    });

    const result = await gatewayService.tokenizeCard({
      number: "4111111111111111",
      cvc: "123",
      expMonth: "12",
      expYear: "26",
      cardHolder: "JUAN PEREZ",
    });

    expect(result).toBe("tok_test_abc123");
  });

  it("lanza error si la tokenización falla", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Card declined"));

    await expect(
      gatewayService.tokenizeCard({
        number: "0000000000000000",
        cvc: "000",
        expMonth: "01",
        expYear: "20",
        cardHolder: "TEST USER",
      }),
    ).rejects.toThrow("Card declined");
  });
});

describe("gatewayService — processPayment", () => {
  beforeEach(() => jest.clearAllMocks());

  it("llama a POST /transactions con el payload correcto", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { status: "APPROVED" } },
    });

    await gatewayService.processPayment({
      transactionId: "TXN-001",
      amount: 101000,
      cardToken: "tok_test_123",
      installments: 1,
      customerEmail: "juan@example.com",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${GATEWAY_URL}/transactions`,
      {
        amount_in_cents: 10100000,
        currency: "COP",
        customer_email: "juan@example.com",
        reference: "TXN-001",
        payment_method: {
          type: "CARD",
          installments: 1,
          token: "tok_test_123",
        },
      },
      { headers: { Authorization: "Bearer " } },
    );
  });

  it("convierte el amount a centavos correctamente", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { status: "APPROVED" } },
    });

    await gatewayService.processPayment({
      transactionId: "TXN-002",
      amount: 50000,
      cardToken: "tok_test_456",
      installments: 3,
      customerEmail: "test@example.com",
    });

    const callArgs = mockedAxios.post.mock.calls[0][1] as {
      amount_in_cents: number;
    };
    expect(callArgs.amount_in_cents).toBe(5000000);
  });

  it("retorna el status de la transacción", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { status: "APPROVED" } },
    });

    const result = await gatewayService.processPayment({
      transactionId: "TXN-003",
      amount: 90000,
      cardToken: "tok_test_789",
      installments: 1,
      customerEmail: "test@example.com",
    });

    expect(result).toEqual({ status: "APPROVED" });
  });

  it("retorna status DECLINED cuando el pago es rechazado", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { status: "DECLINED" } },
    });

    const result = await gatewayService.processPayment({
      transactionId: "TXN-004",
      amount: 90000,
      cardToken: "tok_test_bad",
      installments: 1,
      customerEmail: "test@example.com",
    });

    expect(result).toEqual({ status: "DECLINED" });
  });

  it("lanza error si el pago falla", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Payment failed"));

    await expect(
      gatewayService.processPayment({
        transactionId: "TXN-005",
        amount: 0,
        cardToken: "",
        installments: 1,
        customerEmail: "",
      }),
    ).rejects.toThrow("Payment failed");
  });

  it("usa currency COP siempre", async () => {
    mockedAxios.post.mockResolvedValue({
      data: { data: { status: "APPROVED" } },
    });

    await gatewayService.processPayment({
      transactionId: "TXN-006",
      amount: 30000,
      cardToken: "tok_test_cop",
      installments: 1,
      customerEmail: "test@example.com",
    });

    const callArgs = mockedAxios.post.mock.calls[0][1] as { currency: string };
    expect(callArgs.currency).toBe("COP");
  });
});
