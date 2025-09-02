import React from "react";

type Props = { children: React.ReactNode };

const CartProvider = ({ children }: Props) => {
  return <>{children}</>;
};

export default CartProvider;
