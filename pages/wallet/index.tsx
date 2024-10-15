import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import Wallet from "@src/modules/wallet/Wallet";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const WalletPage = () => {
  return (
    <DefaultLayout bgGray>
      <Wallet />
    </DefaultLayout>
  );
};

export default WalletPage;
