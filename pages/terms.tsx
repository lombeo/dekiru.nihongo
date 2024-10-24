import { Breadcrumbs } from "@edn/components";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { TERM_EN, TERM_VI } from "@src/constants/terms.constant";
import styles from "@src/modules/terms/Terms.module.scss";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const Page: NextPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;

  return (
    <>
      <HeadSEO
        title={t("CodeLearn terms of use")}
        description={t(
          "Legal information and agreements between you and CodeLearn when usin1g document, service and learning information on CodeLearn."
        )}
      />
      <DefaultLayout allowAnonymous>
        <div className="pb-20 border-b">
          <Container size="lg">
            <Breadcrumbs
              data={[
                {
                  href: `/`,
                  title: t("Home"),
                },
                {
                  title: t("Terms of Use"),
                },
              ]}
            />
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: locale === "en" ? TERM_EN : TERM_VI,
              }}
            ></div>
          </Container>
        </div>
      </DefaultLayout>
    </>
  );
};

export default Page;
