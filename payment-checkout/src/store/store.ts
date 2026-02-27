import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import checkoutReducer from "./slices/checkoutSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
