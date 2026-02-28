import transactionReducer, {
  setTransaction,
  resetTransaction,
} from "../store/slices/transactionSlice";

const initialState = {
  transactionId: null,
  status: "IDLE" as const,
};

describe("transactionSlice — estado inicial", () => {
  it("retorna el estado inicial por defecto", () => {
    const state = transactionReducer(undefined, { type: "@@INIT" });
    expect(state.transactionId).toBeNull();
    expect(state.status).toBe("IDLE");
  });
});

describe("transactionSlice — setTransaction", () => {
  it("actualiza transactionId correctamente", () => {
    const state = transactionReducer(
      initialState,
      setTransaction({ transactionId: "TXN-001", status: "APPROVED" }),
    );
    expect(state.transactionId).toBe("TXN-001");
  });

  it("actualiza status a APPROVED", () => {
    const state = transactionReducer(
      initialState,
      setTransaction({ transactionId: "TXN-001", status: "APPROVED" }),
    );
    expect(state.status).toBe("APPROVED");
  });

  it("actualiza status a PENDING", () => {
    const state = transactionReducer(
      initialState,
      setTransaction({ transactionId: "TXN-002", status: "PENDING" }),
    );
    expect(state.status).toBe("PENDING");
  });

  it("actualiza status a FAILED", () => {
    const state = transactionReducer(
      initialState,
      setTransaction({ transactionId: "TXN-003", status: "FAILED" }),
    );
    expect(state.status).toBe("FAILED");
  });

  it("sobreescribe una transacción previa", () => {
    const prev = { transactionId: "TXN-OLD", status: "PENDING" as const };
    const state = transactionReducer(
      prev,
      setTransaction({ transactionId: "TXN-NEW", status: "APPROVED" }),
    );
    expect(state.transactionId).toBe("TXN-NEW");
    expect(state.status).toBe("APPROVED");
  });

  it("actualiza ambos campos al mismo tiempo", () => {
    const state = transactionReducer(
      initialState,
      setTransaction({ transactionId: "TXN-004", status: "FAILED" }),
    );
    expect(state).toEqual({ transactionId: "TXN-004", status: "FAILED" });
  });
});

describe("transactionSlice — resetTransaction", () => {
  it("resetea el estado al inicial", () => {
    const prev = { transactionId: "TXN-001", status: "APPROVED" as const };
    const state = transactionReducer(prev, resetTransaction());
    expect(state).toEqual(initialState);
  });

  it("retorna transactionId en null después del reset", () => {
    const prev = { transactionId: "TXN-001", status: "APPROVED" as const };
    const state = transactionReducer(prev, resetTransaction());
    expect(state.transactionId).toBeNull();
  });

  it("retorna status IDLE después del reset", () => {
    const prev = { transactionId: "TXN-001", status: "FAILED" as const };
    const state = transactionReducer(prev, resetTransaction());
    expect(state.status).toBe("IDLE");
  });

  it("resetea correctamente desde estado PENDING", () => {
    const prev = { transactionId: "TXN-002", status: "PENDING" as const };
    const state = transactionReducer(prev, resetTransaction());
    expect(state).toEqual(initialState);
  });
});
