import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { GetStaticPaths } from "next";
import EventConfig from "@src/modules/event/EventConfig";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function EventHomeWrapper() {
  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <EventConfig />
      </DefaultLayout>
    </>
  );
}
