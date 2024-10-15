import { Breadcrumbs, OverlayLoading } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Container } from "@src/components";
import DefaultLayout from "@src/components/Layout/Layout";
import HeadSEO from "@src/components/SEO/HeadSEO";
import { logout } from "@src/helpers/helper";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const Page = () => {
  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <HeadSEO />
      <DefaultLayout bgGray allowAnonymous>
        <VerifyEmail />
      </DefaultLayout>
    </>
  );
};

export default Page;

const VerifyEmail = () => {
  const { t } = useTranslation();
  const nonce = useNextQueryParam("nonce");

  const router = useRouter();

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const verifyEmail = async () => {
    setLoading(true);
    const res = await IdentityService.userChallengeEmail({
      nonce,
    });
    setLoading(false);
    if (res?.data?.success) {
      setData(res?.data?.data);
      setTimeout(() => {
        router.push("/");
      }, 4000);
    } else if (res?.data?.message) {
      Notify.error(t(res?.data?.message));
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [executeRecaptcha]);

  if (loading) {
    return <OverlayLoading />;
  }

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
              title: t("Verify email"),
            },
          ]}
        />
        <div className="pt-10 pb-20 text-[24px] font-semibold gap-2 flex items-center justify-center flex-col">
          <div>{t(data ? "Congratulations" : "Verify email")} !</div>
          <div>{t(data ? "You have successfully registered." : "Your email address could not be validated.")}</div>
        </div>
      </Container>
    </div>
  );
};
