import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { useRouter } from "@src/hooks/useRouter";
import ShareCertificate from "@src/modules/course-detail/components/ShareCertificate";
import { GetStaticPaths, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
export const getStaticPaths: GetStaticPaths<{
  enrolmentUniqueId: string;
}> = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const Page: NextPage = () => {
  const router = useRouter();
  const { enrolmentUniqueId } = router.query;

  return (
    <>
      <HeadSEO />
      <DefaultLayout allowAnonymous>
        <Container>
          <ShareCertificate enrolmentUniqueId={enrolmentUniqueId} />
        </Container>
      </DefaultLayout>
    </>
  );
};

export default Page;
