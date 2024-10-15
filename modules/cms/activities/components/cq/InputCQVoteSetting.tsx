import { Table } from "@mantine/core";
import { FunctionBase } from "@src/helpers/fuction-base.helpers";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";
import { CQVoteSettingList } from "./CQVoteSettingList";

export const InputCQVoteSetting = (props: any) => {
  const { data, setValue } = props;
  const [cards, setCards] = useState<any>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setCards(FunctionBase.groupByField(data, "starType"));
    }
  }, [data]);

  // const getCardData = (type: any) => {
  //   const res = cards.find((x: any) => x.starType == type)?.data;
  //   if (res) return res;
  //   return [];
  // }

  const onChangeCardSetting = (cardData: any, field: string, value: any) => {
    console.log(value);
    let tempCards = data;
    if (!tempCards) return [];
    const cardIndex = tempCards.findIndex((x: any) => x.audence == cardData.audence && x.starType == cardData.starType);
    tempCards[cardIndex][field] = value.length ? parseInt(value) : "";
    setValue("settings.cards", tempCards);
  };

  return (
    <>
      <div>
        <label className="font-bold">{t(LocaleKeys["Vote settings"])}</label>
      </div>
      <div className="border  rounded overflow-hidden">
        <Table highlightOnHover>
          {data && (
            <thead>
              <tr>
                <th>{t(LocaleKeys["Tên thẻ"])}</th>
                <th colSpan={2}>{t(LocaleKeys["Inside Group"])}</th>
                <th colSpan={2}>{t(LocaleKeys["Outside Group"])}</th>
                <th colSpan={2}>{t(LocaleKeys["Teacher"])}</th>
              </tr>
              <tr>
                <th></th>
                <th>{t(LocaleKeys["Star"])}</th>
                <th>{t(LocaleKeys["Quantity"])}</th>
                <th>{t(LocaleKeys["Star"])}</th>
                <th>{t(LocaleKeys["Quantity"])}</th>
                <th>{t(LocaleKeys["Star"])}</th>
                <th>{t(LocaleKeys["Quantity"])}</th>
              </tr>
            </thead>
          )}
          <tbody>
            <CQVoteSettingList cards={cards} onChange={onChangeCardSetting} />
          </tbody>
        </Table>
      </div>
    </>
  );
};
