import { Breadcrumbs } from "@edn/components";
import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Card, Text } from "@mantine/core";
import { Container } from "@src/components";
import { useNextQueryParam } from "@src/helpers/query-utils";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const OrganizationVerify = () => {
  const { t } = useTranslation();

  const router = useRouter();
  const token = useNextQueryParam("token");

  const [data, setData] = useState(null);

  const fetch = async () => {
    if (!token) return;
    const res = await IdentityService.organizationGetOrganizationVerify({
      token,
    });
    if (res?.data?.success) {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleResponse = async (isAccept: boolean) => {
    confirmAction({
      message: t("Are you sure this action?"),
      title: t("Notice"),
      labelConfirm: t("Ok"),
      allowCancel: false,
      onConfirm: async () => {
        const res = await IdentityService.organizationResponseJoinOrganization({
          isAccept,
          token,
        });
        if (res?.data.success) {
          router.push("/organization");
          Notify.success(t("Response successfully!"));
        } else if (res?.data?.message) {
          Notify.error(t(res.data.message));
        }
      },
    });
  };

  return (
    <div className="pb-20">
      <Container>
        <Breadcrumbs
          data={[
            {
              href: "/",
              title: t("Home"),
            },
            {
              title: t("Organization"),
            },
          ]}
        />
        <Card className="grid gap-5 grid-cols-[1fr_2fr] bg-white py-6">
          <div className="flex flex-col gap-2">
            {data?.organizations?.map((organization, index: number) => (
              <div key={index}>{organization}</div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <Text className="font-semibold text-lg">{t("Confirm join organization?")}</Text>
            <div className="flex gap-4 mt-2">
              <Button color="green" className="w-[120px]" onClick={() => handleResponse(true)}>
                {t("Yes")}
              </Button>
              <Button color="red" className="w-[120px]" onClick={() => handleResponse(false)}>
                {t("No")}
              </Button>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default OrganizationVerify;
