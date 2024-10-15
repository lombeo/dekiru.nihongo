/* eslint-disable @next/next/no-img-element */
import { Card, clsx, HoverCard, Image, Text } from "@mantine/core";
import Avatar from "@src/components/Avatar";
import ExternalLink from "@src/components/ExternalLink";

interface TopUserCardProps {
  user: any;
  cssCard: string;
  cssFooter: string;
}

const TopUserCard = (props: TopUserCardProps) => {
  const { user, cssCard, cssFooter } = props;
  const numberFormat = new Intl.NumberFormat();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={clsx("lg:w-[30%] w-[100%] p-0", cssCard)}>
      <Card.Section className="pt-10 h-[calc(100%-40px)]">
        <div className="flex flex-col items-center">
          <Avatar
            size={90}
            src={user?.avatarUrl}
            userExpLevel={user?.userExpLevel}
            userId={user?.userId}
            className="mb-5"
          />
          <ExternalLink href={`/profile/${user?.userId}`}>
            <Text className="text-[#333] font-semibold text-lg mb-3">{user?.userName}</Text>
          </ExternalLink>
          <HoverCard width={100} withArrow arrowSize={10} shadow="md" position="top">
            <HoverCard.Target>
              <Image
                width={32}
                height={32}
                src={user?.countryIconUrl}
                alt=""
                withPlaceholder
                placeholder={<img className="bg-white" src="/images/flag-default.png" alt="flag-default" width={32} />}
              />
            </HoverCard.Target>
            <HoverCard.Dropdown className="p-2 flex justify-center">
              <Text size="sm">{user?.countryName}</Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </div>
      </Card.Section>
      <Card.Section className={clsx("h-[40px] mt-6 flex items-center", cssFooter)}>
        <Text className="text-white pl-[45px]">EXP: {numberFormat.format(Math.floor(user?.totalExp ?? 0))}</Text>
      </Card.Section>
    </Card>
  );
};

export default TopUserCard;
