import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import { NotFound } from "@src/components/NotFound/NotFound";
import HeadSEO from "@src/components/SEO/HeadSEO";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export default function Custom404() {
  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <Container>
          <div className="flex justify-center my-24 w-full">
            <NotFound />
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
}
