import { useDebouncedValue } from "@mantine/hooks";
import CmsService from "@src/services/CmsService/CmsService";
import { Select } from "components/cms";
import { useTranslation } from "next-i18next";
import { LocaleKeys } from "public/locales/locale";
import { useEffect, useState } from "react";

export const QuestionBankFilterInput = (props: any) => {
  const { onSelect } = props;
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState<any>("");
  const [debouncedKeyword] = useDebouncedValue(keyword, 1500);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      setKeyword(null);
      setData([]);
    };
  }, []);

  useEffect(() => {
    if (debouncedKeyword) {
      setIsSearching(true);
      CmsService.getAllQuestionBank(
        {
          text: debouncedKeyword.trim(),
        },
        []
      ).then((x: any) => {
        const response: any = x?.data;
        setData(response?.items);
        setIsSearching(false);
      });
    }
  }, [debouncedKeyword]);

  const onSelectBank = (e: any) => {
    const bank = data.find((x: any) => x.uniqueId == e);
    onSelect(bank);
  };

  const getData = () => {
    if (data && data.length) {
      return data.map((x: any) => {
        return {
          value: x.uniqueId.toString(),
          label: x.title.toString(),
        };
      });
    }

    return [];
  };

  return (
    <>
      <Select
        placeholder={t(LocaleKeys.D_SEARCH_BY_SPECIFIC, {
          name: t(LocaleKeys.Bank).toLowerCase(),
        })}
        searchable
        clearable
        onReset={() => {
          console.log("Overide reset");
        }}
        onChange={onSelectBank}
        disabled={isSearching}
        onSearchChange={(x: any) => setKeyword(x)}
        nothingFound={t(LocaleKeys["No result found"])}
        data={getData()}
        className="w-1/2"
      />
    </>
  );
};
