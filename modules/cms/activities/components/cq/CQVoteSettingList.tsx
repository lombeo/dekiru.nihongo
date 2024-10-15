import { TextInput } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { useTranslation } from "next-i18next";

export const CQVoteSettingListItem = (props: any) => {
  const { data, onChange, starName } = props;
  const { t } = useTranslation();
  return (
    <>
      <tr>
        <td className="w-40">
          <div className="flex gap-2">
            <span>
              <AppIcon name="IconStar" type={starName.toLowerCase()} />
            </span>{" "}
            <span>{t([`${starName} star`])}</span>
          </div>
        </td>
        {data.map((card: any) => (
          <>
            <td>
              <TextInput
                size="xs"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                value={card.starValue}
                onChange={(event: any) => onChange(card, "starValue", event.currentTarget.value)}
              />
            </td>
            <td>
              <TextInput
                size="xs"
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                value={card.quantity}
                onChange={(event: any) => onChange(card, "quantity", event.currentTarget.value)}
              />
            </td>
          </>
        ))}
      </tr>
    </>
  );
};
export const CQVoteSettingList = (props: any) => {
  const { cards, onChange } = props;
  const starTypes = ["Red", "Blue", "Green", "Black"];
  return (
    <>
      {cards.map((x: any, idx: any) => (
        <CQVoteSettingListItem
          key={idx}
          index={idx}
          data={x.data}
          onChange={onChange}
          starName={starTypes[parseInt(x.starType) - 1]}
        />
      ))}
    </>
  );
};
