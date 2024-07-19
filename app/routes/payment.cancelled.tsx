import { Link } from "@remix-run/react";
import React from "react";

const PaymentCancelled = () => {
  return (
    <>
      <h2>Paymne, failed your are nor be charged</h2>
      <Link to={"/"}>Back to home </Link>
    </>
  );
};

export default PaymentCancelled;
