import { useHover } from "@mantine/hooks";
import Link from "@src/components/Link";
import { AppIcon } from "@src/components/cms/core/Icons";
import { resolveLanguage } from "@src/helpers/helper";
import { ActionIcon, Badge, Breadcrumbs, Card, Group, Image, Text } from "components/cms";
import TextOverflow from "components/cms/core/TextOverflow";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { LocaleKeys } from "public/locales/locale";
import { ViewTags } from "./view/ViewTags/ViewTags";

export const CourseInfo = (props: any) => {
  const { id, category, provider, tags, onEdit, imgSrc } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const data = [{ title: t("Courses"), href: "/cms/courses" }];

  const title = resolveLanguage(props, locale)?.title;

  if (id) data.push({ title: title, href: "/cms/course/" + id });

  const items = data.map((item, index) => (
    <Link href={item.href} key={index}>
      <TextOverflow>{item.title}</TextOverflow>
    </Link>
  ));

  const { hovered, ref } = useHover();

  return (
    <div className="grid grid-cols-3 gap-7" ref={ref}>
      <div className="col-span-2 relative">
        <ActionIcon onClick={onEdit} variant="light" className="absolute right-0 top-0 z-50" hidden={!hovered}>
          <AppIcon name="edit" />
        </ActionIcon>
        <div className="text-white hidden md:block">
          <Breadcrumbs
            className="items-baseline mb-6 text-sm "
            classNames={{ breadcrumb: "text-white" }}
            separator={<span className="text-white">/</span>}
          >
            {items}
          </Breadcrumbs>
        </div>
        <Text className="text-white text-3xl filter drop-shadow mb-3 font-bold break-words">{title}</Text>
        <Group className="mb-3">
          <Text className="text-white text-sm">
            <span>{t(LocaleKeys.Provider)}:</span>
          </Text>
          <Text className="text-white text-sm">
            <span>{provider?.name}</span>
          </Text>
        </Group>
        <Group className="mb-3">
          <Text className="text-white text-sm">
            <span>{t(LocaleKeys.Category)}:</span>
          </Text>
          <Badge variant="filled" size="lg" className="normal-case" radius="sm">
            {resolveLanguage(category, locale)?.title}
          </Badge>
        </Group>
        <Group className="flex items-center">
          <Text className="text-white text-sm">{t(LocaleKeys.Tags)}:</Text>
          <ViewTags size="lg" className="font-bold" gap={3} data={tags ? tags : []} />
        </Group>
      </div>
      <div className="col-span-1">
        <Card radius={0}>
          <Card.Section>
            <Image
              src={imgSrc}
              height={210}
              className="bg-gray-lighter"
              fit="cover"
              alt={"CodeLearn"}
              classNames={{
                figure: "h-full",
              }}
              withPlaceholder
            />
          </Card.Section>
        </Card>
      </div>
    </div>
  );
};
