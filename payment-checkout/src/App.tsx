import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Provider store={store}>
      <ProductPage />
    </Provider>
  );
}

export default App;
