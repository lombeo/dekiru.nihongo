import { Breadcrumbs } from "@edn/components";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import useFetchProfile from "@src/hooks/useFetchProfile";
import ChangeUsername from "@src/modules/user/ChangeUsername";
import { setOpenModalLogin } from "@src/store/slices/applicationSlice";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadSEO title={t("Change username")} />
      <DefaultLayout bgGray allowAnonymous>
        <ChangeUsernameWrap />
      </DefaultLayout>
    </>
  );
};

export default Page;

const ChangeUsernameWrap = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const token = getAccessToken();

  const fetchProfile = useFetchProfile();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!token) {
    return (
      <div>
        <Container>
          <Breadcrumbs
            data={[
              {
                href: `/`,
                title: t("Home"),
              },
              {
                href: `/user/information`,
                title: t("My information"),
              },
              {
                title: t("Change username"),
              },
            ]}
          />
          <div
            onClick={() => {
              dispatch(setOpenModalLogin(true));
            }}
            className="text-[red] italic mb-20"
          >
            {t("Please sign in to update your username!")}
          </div>
        </Container>
      </div>
    );
  }

  return <ChangeUsername />;
};
