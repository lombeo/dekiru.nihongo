import { Notify } from "@edn/components/Notify/AppNotification";
import { Button, Modal, Text, TextInput } from "@mantine/core";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function ModalAddSkill(props: any) {
  const { t } = useTranslation();
  const { setMoadlAddSkill, fetch, parentId, dataEdit } = props;
  console.log(dataEdit);
  const [dataSkill, setDataSkill] = useState(
    dataEdit
      ? {
          eng: dataEdit?.multiLangData[0]?.name,
          vn: dataEdit?.multiLangData[1]?.name,
        }
      : {
          eng: "",
          vn: "",
        }
  );
  const handleSubmit = async () => {
    const res = await CodingService.saveWarehouse(
      dataEdit
        ? {
            id: dataEdit.id,
            parentId: parentId,
            multiLangData: [
              {
                key: "en",
                name: dataSkill.eng,
              },
              {
                key: "vn",
                name: dataSkill.vn,
              },
            ],
          }
        : {
            parentId: parentId,
            multiLangData: [
              {
                key: "en",
                name: dataSkill.eng,
              },
              {
                key: "vn",
                name: dataSkill.vn,
              },
            ],
          }
    );
    if (res?.data?.success) {
      Notify.success(dataEdit ? t("Update successfully!") : t("Create successfully!"));
    } else {
      Notify.error(t(res?.data?.message));
    }
    fetch();
    setMoadlAddSkill(null);
  };

  return (
    <Modal opened={true} onClose={() => setMoadlAddSkill(false)} size="lg">
      <div className="border-b-2 pb-2 flex justify-center">
        <Text className="uppercase font-semibold text-lg text-blue-500">
          {dataEdit ? t("Edit skill") : t("Add skill")}
        </Text>
      </div>
      <div className="flex flex-col gap-4 py-4 px-4">
        <TextInput
          value={dataSkill.eng}
          onChange={(value) =>
            setDataSkill((pre) => ({
              ...pre,
              eng: value.target.value,
            }))
          }
          label={<Text className="font-semibold text-base">English</Text>}
          placeholder={t("Skill")}
        />
        <TextInput
          value={dataSkill.vn}
          onChange={(value) =>
            setDataSkill((pre) => ({
              ...pre,
              vn: value.target.value,
            }))
          }
          label={<Text className="font-semibold text-base">Tiếng Việt</Text>}
          placeholder={t("Skill")}
        />
      </div>
      <div className="flex justify-end px-4 py-6">
        <Button onClick={handleSubmit}>{dataEdit ? t("Save") : t("Send")}</Button>
      </div>
    </Modal>
  );
}
