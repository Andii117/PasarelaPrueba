import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TransactionState } from "../../types";

const initialState: TransactionState = {
  transactionId: null,
  status: "IDLE",
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransaction: (
      state,
      action: PayloadAction<{
        transactionId: string;
        status: TransactionState["status"];
      }>,
    ) => {
      state.transactionId = action.payload.transactionId;
      state.status = action.payload.status;
    },
    resetTransaction: () => initialState,
  },
});

export const { setTransaction, resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
