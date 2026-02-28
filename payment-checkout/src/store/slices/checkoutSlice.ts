import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CheckoutState } from "../../types";

const savedState = localStorage.getItem("checkoutState");
const initialState: CheckoutState = savedState
  ? JSON.parse(savedState)
  : {
      currentStep: 1,
      productId: "",
      productName: "",
      productPrice: 0,
      cardNumber: "",
      cardHolder: "",
      cardExpiry: "",
      cardCvv: "",
      deliveryName: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryPhone: "",
      deliveryEmail: "",
      clientIp: "",
    };

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      localStorage.setItem("checkoutState", JSON.stringify(state));
    },
    setFormData: (state, action: PayloadAction<Partial<CheckoutState>>) => {
      const updated = { ...state, ...action.payload };
      localStorage.setItem("checkoutState", JSON.stringify(updated));
      localStorage.setItem("customer_email", updated.deliveryEmail ?? "");
      return updated;
    },
    setClientIp: (state, action: PayloadAction<string>) => {
      state.clientIp = action.payload;
      localStorage.setItem("checkoutState", JSON.stringify(state));
    },
    resetCheckout: () => {
      localStorage.removeItem("checkoutState");
      localStorage.removeItem("customer_email");
      return {
        currentStep: 1,
        productId: "",
        productName: "",
        productPrice: 0,
        cardNumber: "",
        cardHolder: "",
        cardExpiry: "",
        cardCvv: "",
        deliveryName: "",
        deliveryAddress: "",
        deliveryCity: "",
        deliveryPhone: "",
        deliveryEmail: "",
        clientIp: "",
      };
    },
  },
});

export const { setStep, setFormData, setClientIp, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
