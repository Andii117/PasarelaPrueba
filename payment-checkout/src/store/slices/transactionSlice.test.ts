import { describe, it, expect } from "vitest";
import transactionReducer, {
  setTransaction,
  resetTransaction,
} from "./transactionSlice";

describe("transactionSlice", () => {
  const initialState = {
    transactionId: null,
    status: "IDLE" as const,
  };

  it("debe retornar el estado inicial por defecto", () => {
    expect(transactionReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("debe actualizar la transacción con setTransaction", () => {
    const payload = {
      transactionId: "TX-12345",
      status: "APPROVED" as const,
    };

    const state = transactionReducer(initialState, setTransaction(payload));

    expect(state.transactionId).toBe("TX-12345");
    expect(state.status).toBe("APPROVED");
  });

  it("debe manejar el cambio a estado PENDING o ERROR", () => {
    const payload = {
      transactionId: "TX-999",
      status: "FAILED" as const,
    };

    const state = transactionReducer(initialState, setTransaction(payload));

    expect(state.status).toBe("FAILED");
    expect(state.transactionId).toBe("TX-999");
  });

  it("debe resetear la transacción a su estado inicial con resetTransaction", () => {
    const dirtyState = {
      transactionId: "TX-123",
      status: "APPROVED" as const,
    };

    const state = transactionReducer(dirtyState, resetTransaction());

    expect(state).toEqual(initialState);
    expect(state.transactionId).toBeNull();
    expect(state.status).toBe("IDLE");
  });
});
