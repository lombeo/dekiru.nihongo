import { Button, Group, Modal, Text } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Table } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";
import { useState } from "react";

interface ImportUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
  contestId: any;
}

const ImportUserModal = (props: ImportUserModalProps) => {
  const { onClose, onSuccess, contestId } = props;
  const { t } = useTranslation();

  const [loadingForm, setLoadingForm] = useState<any>(false);
  const [file, setFile] = useState<any>(null);
  const [successList, setSuccessList] = useState([]);

  //Validate file
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 1000 * 25) {
      Notify.error(t("Attachment file size cannot exceed 25MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  const onChangeFiles = (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      return;
    }
    setFile(data?.[0]);
  };

  const submit = async () => {
    if (!file) {
      return Notify.error(t("File import cannot be blank"));
    }
    setLoadingForm(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("contestId", contestId);
    const res = await CodingService.contestRegisterImportRegister(formData);
    setLoadingForm(false);
    if (res?.data?.success) {
      if (res.data.data) {
        setSuccessList(res.data.data);
      }
      onSuccess();
      Notify.success(t("Add successfully!"));
    } else if (res?.data?.message) {
      Notify.error(t(res.data.message));
    }
  };

  return (
    <>
      <Modal
        title={t("FIGHT_ADD_USER")}
        classNames={{
          title: "font-semibold text-lg",
        }}
        size="xl"
        opened
        zIndex={300}
        onClose={onClose}
      >
        <div>
          <div>
            <Dropzone
              multiple={false}
              onDrop={(files) => onChangeFiles(files)}
              onReject={(files) => console.log("rejected files", files)}
            >
              <Group position="center" spacing="sm" style={{ height: 34, pointerEvents: "none" }}>
                <span className="text-blue-primary">
                  <Icon name="upload-cloud" size={30}></Icon>
                </span>
                <div className="text-blue-primary">
                  <Text size="md" inline>
                    {t("Drag and drop the file, or Browse")}
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </div>
          {file && (
            <div className="mt-4 bg-[#F1F3F5] px-4 py-2 rounded-md min-h-[50px] flex gap-5 justify-between items-center">
              <Text className="font-semibold">{file.name}</Text>
              <div className="cursor-pointer w-6 " onClick={() => setFile(null)}>
                <Icon name="close" className="text-[#868e96] hover:text-[#045fbb]" />
              </div>
            </div>
          )}
          <Text className="mt-4">
            (<span className="text-red-500">*</span>) {t("File size limit: {{limit}}", { limit: "25MB" })}
          </Text>
        </div>
        <a
          className="mt-2 inline-block underline text-primary"
          href="/files/fight-add-member-20240102.xlsx"
          target="_blank"
        >
          {t("Download template here")}
        </a>
        {successList?.length > 0 && (
          <Table captionSide="bottom" striped withColumnBorders withBorder my="xl">
            <thead>
              <tr>
                <th>{t("Username")}</th>
                <th>{t("Status")}</th>
              </tr>
            </thead>
            <tbody>
              {successList?.map((item) => (
                <tr key={item.userName}>
                  <td>{item.userName}</td>
                  <td>{t(item.message)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="flex justify-end mt-5">
          <Group>
            <Button onClick={() => onClose()} variant="outline">
              {t("Cancel")}
            </Button>
            <Button loading={loadingForm} onClick={() => submit()}>
              {t("Add")}
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

export default ImportUserModal;
