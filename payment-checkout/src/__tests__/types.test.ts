describe("Product interface", () => {
  it("debe aceptar un objeto con todos los campos requeridos", () => {
    const product: import("../types").Product = {
      id: "1",
      name: "Producto Test",
      description: "Descripción del producto",
      price: 50000,
      imageUrl: "https://example.com/image.jpg",
      stock: 10,
    };
    expect(product.id).toBe("1");
    expect(product.price).toBe(50000);
    expect(product.stock).toBe(10);
  });

  it("debe aceptar stock en 0 para producto agotado", () => {
    const product: import("../types").Product = {
      id: "2",
      name: "Agotado",
      description: "Sin stock",
      price: 0,
      imageUrl: "https://example.com/image.jpg",
      stock: 0,
    };
    expect(product.stock).toBe(0);
  });

  it("debe aceptar precio en 0", () => {
    const product: import("../types").Product = {
      id: "3",
      name: "Gratis",
      description: "Producto gratis",
      price: 0,
      imageUrl: "",
      stock: 1,
    };
    expect(product.price).toBe(0);
  });
});

describe("CheckoutState interface", () => {
  it("debe aceptar un estado completo de checkout", () => {
    const state: import("../types").CheckoutState = {
      currentStep: 1,
      productId: "abc123",
      productName: "Producto Test",
      productPrice: 99000,
      cardNumber: "4111111111111111",
      cardHolder: "Juan Pérez",
      cardExpiry: "12/26",
      cardCvv: "123",
      deliveryName: "Juan Pérez",
      deliveryAddress: "Calle 10 # 43-25",
      deliveryCity: "Medellín",
      deliveryPhone: "3001234567",
      clientIp: "192.168.1.1",
    };
    expect(state.currentStep).toBe(1);
    expect(state.clientIp).toBe("192.168.1.1");
    expect(state.cardNumber).toHaveLength(16);
  });

  it("debe aceptar currentStep en cualquier paso válido", () => {
    [1, 2, 3].forEach((step) => {
      const state: import("../types").CheckoutState = {
        currentStep: step,
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
      expect(state.currentStep).toBe(step);
    });
  });

  it("debe aceptar estado vacío con strings vacíos", () => {
    const state: import("../types").CheckoutState = {
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
    expect(state.productName).toBe("");
    expect(state.clientIp).toBe("");
  });
});

describe("TransactionState interface", () => {
  it("debe aceptar status IDLE con transactionId null", () => {
    const state: import("../types").TransactionState = {
      transactionId: null,
      status: "IDLE",
    };
    expect(state.status).toBe("IDLE");
    expect(state.transactionId).toBeNull();
  });

  it("debe aceptar status APPROVED con transactionId", () => {
    const state: import("../types").TransactionState = {
      transactionId: "txn_abc123",
      status: "APPROVED",
    };
    expect(state.status).toBe("APPROVED");
    expect(state.transactionId).toBe("txn_abc123");
  });

  it("debe aceptar todos los status posibles", () => {
    const statuses: import("../types").TransactionState["status"][] = [
      "IDLE",
      "PENDING",
      "APPROVED",
      "FAILED",
    ];
    statuses.forEach((status) => {
      const state: import("../types").TransactionState = {
        transactionId: null,
        status,
      };
      expect(state.status).toBe(status);
    });
  });

  it("debe aceptar status FAILED", () => {
    const state: import("../types").TransactionState = {
      transactionId: "txn_failed",
      status: "FAILED",
    };
    expect(state.status).toBe("FAILED");
  });
});

describe("MultiProductState interface", () => {
  it("debe aceptar un estado con productos y sin error", () => {
    const state: import("../types").MultiProductState = {
      products: [
        {
          id: "1",
          name: "Producto A",
          description: "Desc A",
          price: 30000,
          imageUrl: "https://example.com/a.jpg",
          stock: 5,
        },
      ],
      loading: false,
      error: null,
    };
    expect(state.products).toHaveLength(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("debe aceptar estado de carga con lista vacía", () => {
    const state: import("../types").MultiProductState = {
      products: [],
      loading: true,
      error: null,
    };
    expect(state.products).toHaveLength(0);
    expect(state.loading).toBe(true);
  });

  it("debe aceptar estado con error", () => {
    const state: import("../types").MultiProductState = {
      products: [],
      loading: false,
      error: "Error al cargar productos",
    };
    expect(state.error).toBe("Error al cargar productos");
  });

  it("debe aceptar múltiples productos", () => {
    const state: import("../types").MultiProductState = {
      products: [
        {
          id: "1",
          name: "A",
          description: "",
          price: 1000,
          imageUrl: "",
          stock: 1,
        },
        {
          id: "2",
          name: "B",
          description: "",
          price: 2000,
          imageUrl: "",
          stock: 2,
        },
        {
          id: "3",
          name: "C",
          description: "",
          price: 3000,
          imageUrl: "",
          stock: 0,
        },
      ],
      loading: false,
      error: null,
    };
    expect(state.products).toHaveLength(3);
  });
});
