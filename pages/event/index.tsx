import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@src/components/Layout/Layout";
import { useTranslation } from "next-i18next";
import HeadSEO from "@src/components/SEO/HeadSEO";
import EventPage from "@src/modules/event/EventPage";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function EventPageWrapper() {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Event")} />
      <DefaultLayout allowAnonymous>
        <div className="image-fit">
          <EventPage />
        </div>
      </DefaultLayout>
    </>
  );
}
