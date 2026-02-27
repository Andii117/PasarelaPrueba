import axios from "axios";

const GATEWAY_URL =
  import.meta.env.VITE_GATEWAY_URL || "https://api-sandbox.co.uat.wompi.dev/v1";
const PUB_KEY = import.meta.env.VITE_PUB_KEY || "";

export const gatewayService = {
  tokenizeCard: async (cardData: {
    number: string;
    cvc: string;
    expMonth: string;
    expYear: string;
    cardHolder: string;
  }) => {
    const { data } = await axios.post(
      `${GATEWAY_URL}/tokens/cards`,
      {
        number: cardData.number,
        cvc: cardData.cvc,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        card_holder: cardData.cardHolder,
      },
      { headers: { Authorization: `Bearer ${PUB_KEY}` } },
    );
    return data.data.id;
  },

  processPayment: async (payload: {
    transactionId: string;
    amount: number;
    cardToken: string;
    installments: number;
    customerEmail: string;
  }) => {
    const { data } = await axios.post(
      `${GATEWAY_URL}/transactions`,
      {
        amount_in_cents: payload.amount * 100,
        currency: "COP",
        customer_email: payload.customerEmail,
        reference: payload.transactionId,
        payment_method: {
          type: "CARD",
          installments: payload.installments,
          token: payload.cardToken,
        },
      },
      { headers: { Authorization: `Bearer ${PUB_KEY}` } },
    );
    return { status: data.data.status };
  },
};
