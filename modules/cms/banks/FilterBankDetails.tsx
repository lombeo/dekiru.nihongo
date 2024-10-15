import { Button, Center, Select, Space, Text, TextInput } from "@mantine/core";
import { questionTypes } from "@src/constants/cms/question-bank/question.constant";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { Search } from "tabler-icons-react";

export const FilterBankDetails = ({ onSearch }: any) => {
  const { t } = useTranslation();

  const questionTypeData: any = [{ label: "All", type: "" }, ...questionTypes].map((q) => ({
    label: t(String(q.label)),
    value: String(q.type),
  }));

  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState<string | null>("");
  const [tag, setTag] = useState("");

  const onEnter = (e: any) => {
    if (e.key === "Enter") {
      onSearch({ questionContent, questionType, tag });
    }
  };

  return (
    <div className="search-area mt-6">
      <Text weight={"bold"}>{t("Search Questions")}</Text>
      <div className="flex justify-between gap-10 mt-2 mb-5">
        <div className="w-1/3">
          <TextInput
            size="md"
            label={t("Title")}
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            onKeyPress={onEnter}
          />
        </div>
        <div className="w-1/3">
          <Select
            size="md"
            label={t("Question type")}
            data={questionTypeData}
            value={questionType}
            onChange={(value) => setQuestionType(value)}
          />
        </div>
        <div className="w-1/3">
          <TextInput
            size="md"
            label={t("Tags")}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyPress={onEnter}
          />
        </div>
      </div>
      <Center>
        <Button color="blue" onClick={() => onSearch({ questionContent, questionType, tag })}>
          <Search width={20} height={20} />
          <Space w="xs" />
          {t("Search")}
        </Button>
      </Center>
    </div>
  );
};
