import { Breadcrumbs } from "@edn/components";
import { Button, Flex, MultiSelect, Select, Text } from "@mantine/core";
import { Container } from "@src/components";
import { IdentityService } from "@src/services/IdentityService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StatisticReport from "./components/StatisticReport";

const OrganizationReport = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const [listOrganization, setListOrganization] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [usersTarget, setUserTarget] = useState([]);
  const [typeReport, setTypeReport] = useState(0);
  const [usersLabel, setUsersLabel] = useState([]);
  const fetch = async () => {
    const res = await IdentityService.getManagedOrganization();
    if (res?.data?.success) {
      const data = res.data.data;
      setListOrganization(data);
    }
  };
  const fetchUser = async () => {
    const resUser = await IdentityService.userInOrganization(id ?? listOrganization[0]?.id);
    if (resUser?.data?.success) {
      setListUsers(resUser.data.data);
      setUserTarget(resUser.data.data.map((user) => user.userId));
      setUsersLabel([-1]);
    }
  };
  const handleChangeUsers = (users: any) => {
    if (users.includes(-1)) {
      setUserTarget(listUsers.map((user) => user.userId));
      setUsersLabel([-1]);
    } else {
      setUserTarget(users);
      setUsersLabel(users);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [id, listOrganization]);

  return (
    <Container size="xl">
      <div className="px-12">
        <Flex className="justify-center" align="center">
          <Breadcrumbs
            data={[
              {
                href: "/",
                title: t("Home"),
              },
              {
                href: "/organization/report",
                title: t("Organization report"),
              },
            ]}
          />
        </Flex>
        <div className="py-4">
          <Button onClick={() => setTypeReport(0)} variant={typeReport !== 0 ? "subtle" : "filled"}>
            {t("Course")}
          </Button>
          <Button onClick={() => setTypeReport(1)} variant={typeReport !== 1 ? "subtle" : "filled"}>
            {t("Classes")}
          </Button>
          <Button onClick={() => setTypeReport(2)} variant={typeReport !== 2 ? "subtle" : "filled"}>
            {t("Contest")}
          </Button>
          <Button onClick={() => setTypeReport(3)} variant={typeReport !== 3 ? "subtle" : "filled"}>
            {t("Training")}
          </Button>
        </div>
        <div className="flex justify-between">
          <div>
            <Text className="font-semibold">{t("Select organization")}</Text>
            <Select
              className="w-[300px]"
              value={id ? id + "" : listOrganization[0]?.id + ""}
              onChange={(value: any) => {
                router.push(`/organization/report/${value}`);
              }}
              data={listOrganization?.map((organization) => {
                return {
                  label: organization.name,
                  value: organization.id + "",
                };
              })}
            />
          </div>
          <div>
            <Text className="font-semibold">{t("Select users")}</Text>
            <MultiSelect
              className="w-[500px]"
              searchable
              value={usersLabel}
              data={[
                {
                  value: -1,
                  label: "All",
                },
                ...listUsers?.map((user) => ({
                  value: user.userId,
                  label: user.userName,
                })),
              ]}
              onChange={handleChangeUsers}
            />
          </div>
        </div>
        <div>
          <StatisticReport listUsers={usersTarget} typeReport={typeReport} />
        </div>
      </div>
    </Container>
  );
};

export default OrganizationReport;
