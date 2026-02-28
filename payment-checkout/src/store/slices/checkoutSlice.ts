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
      return updated;
    },
    setClientIp: (state, action: PayloadAction<string>) => {
      state.clientIp = action.payload;
      localStorage.setItem("checkoutState", JSON.stringify(state));
    },
    resetCheckout: () => {
      localStorage.removeItem("checkoutState");
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
        clientIp: "",
      };
    },
  },
});

export const { setStep, setFormData, setClientIp, resetCheckout } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
