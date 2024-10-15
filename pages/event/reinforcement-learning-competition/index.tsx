import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import { useTranslation } from "next-i18next";
import HeadSEO from "@src/components/SEO/HeadSEO";
import EventGameDetail from "@src/modules/event/EventGameDetail";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function EventGameDetailWrapper() {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Event")} />
      <DefaultLayout allowAnonymous>
        <div className="image-fit">
          <EventGameDetail />
        </div>
      </DefaultLayout>
    </>
  );
}
