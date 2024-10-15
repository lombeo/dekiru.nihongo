import React from "react";
import DefaultLayout from "@src/components/Layout/Layout";
import EvaluatingCreateIndex from "@src/modules/evaluating/EvaluatingCreateIndex";

const RedirectEvaluating = () => {
  return (
    <DefaultLayout>
      <EvaluatingCreateIndex />
    </DefaultLayout>
  );
};

export default RedirectEvaluating;
