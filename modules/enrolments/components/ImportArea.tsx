import { Button, Modal, Text } from "@edn/components";
import { Group } from "@edn/components/Group";
import { Notify } from "@edn/components/Notify/AppNotification";
import Icon from "@edn/font-icons/icon";
import { Dropzone, MS_EXCEL_MIME_TYPE } from "@mantine/dropzone";
import { useProfileContext } from "@src/context/Can";
import { LearnCourseService } from "@src/services";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ImportArea = (props: any) => {
  const { courseId, refreshList, open, onClose } = props;
  const { t } = useTranslation();
  const [listFile, setListFile] = useState(null);
  const [listErrorEmail, setListErrorEmail] = useState([]);
  const [isDisabed, setIsDisabed] = useState(false);
  const [group, setGroup] = useState<any>(null);

  let { profile } = useProfileContext();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    // resolver: yupResolver(FolderFileManager),
    defaultValues: {
      file: null,
    },
  });

  //On change file
  const onChangeFiles = (data: any) => {
    const isValid = validation(data);
    if (!isValid) {
      setListFile([]);
      return;
    }
    setListFile(data);
    setValue("file", data);
    setIsDisabed(false);
  };

  //Validate file
  const validation = (data: any) => {
    let isValid = true;
    const file = data[0];
    if (file.size == 0) {
      Notify.error(t("Import file size is too small or invalid, please check again"));
      isValid = false;
    }
    if (file.size > 1024 * 2000) {
      Notify.error(t("Attachment file size cannot exceed 2MB"));
      isValid = false;
    } else if (file.name.length > 100) {
      Notify.error(t("File name must not exceed 100 characters"));
      isValid = false;
    }
    return isValid;
  };

  //Get render file
  const getRenderData = () => {
    return listFile ? listFile : [];
  };

  //Delete file
  const onDelete = () => {
    setListFile([]);
  };

  //Import handle
  const importEnroll = (files: any) => {
    setIsDisabed(true);
    let formData = new FormData();
    formData.append("file", listFile[0]);
    formData.append("courseId", courseId);
    formData.append("groupId", group?.id || 0);
    formData.append("userId", profile?.userId);
    LearnCourseService.importUserEnroll(formData)
      .then((res: any) => {
        let data = res?.data?.data;
        if (data != null && data.success) {
          Notify.success(t("Import enrollment list successfully!"));
          if (data.listNotExistEmail.length > 0) {
            setListErrorEmail(data?.listNotExistEmail);
          } else {
            setListErrorEmail([]);
            onClose();
          }
          refreshList?.();
        } else {
          if (data?.data?.message != null && data?.data?.message != "") {
            Notify.error(t(data?.data?.message));
          } else {
            Notify.error(t("Import enrollment list failed!"));
          }
          setListFile([]);
        }
        setListFile([]);
        setIsDisabed(false);
      })
      .catch((errors: any) => {
        console.log(errors);
        setListFile([]);
      });
  };

  // @ts-ignore
  return (
    <>
      <Modal title={t("Import list members to learn")} size="xl" opened={open} zIndex={300} onClose={onClose}>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(importEnroll)} noValidate>
          {/*<div className="w-full lg:w-48">*/}
          {/*  <label style={{ color: "#212529" }} className="text-sm font-medium flex align-center justify-between">*/}
          {/*    {t("Group")}*/}
          {/*  </label>*/}
          {/*  <SearchGroup courseId={courseId} onChange={(option) => setGroup(option)} value={group} />*/}
          {/*</div>*/}
          <Dropzone
            multiple={false}
            onDrop={(files) => onChangeFiles(files)}
            onReject={(files) => console.log("rejected files", files)}
            accept={MS_EXCEL_MIME_TYPE}
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
          <div className="space-y-2 mb-5">
            {getRenderData().map((x: any, idx: any) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-lighter rounded-sm mt-2">
                <span className="font-semibold text-sm">
                  {x.name}{" "}
                  <span className="font-normal italic text-sm">({(parseInt(x.size) / 1024).toFixed(2)} KB)</span>
                </span>
                <span className="cursor-pointer text-danger opacity-90 flex items-center" onClick={() => onDelete()}>
                  <Icon size={20} name="delete" />
                </span>
              </div>
            ))}
          </div>
          <a
            className="text-blue-primary text-sm font-semibold italic"
            download
            href="https://s3-sgn09.fptcloud.com/codelearnstorage/template/ImportMemberForCourse.xlsx"
          >
            {t("Download template here")}
          </a>
          <div
            className={`text-sm border-dashed border-2 border-orange rounded-md px-4 py-3 ${
              listErrorEmail.length > 0 ? "" : "hidden"
            }`}
          >
            <p className="font-semibold mb-2">
              {t("Can not import some emails below because they do not exist in the system, please check again")}
              {":"}
            </p>
            <ul className="pl-5 list-disc max-h-48 overflow-y-auto">
              {listErrorEmail &&
                listErrorEmail.map((item: string, idx: number) => {
                  return <li key={idx}>{item}</li>;
                })}
            </ul>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onClose()}>
              {t("Cancel")}
            </Button>
            <Button disabled={listFile == null || listFile == "" || isDisabed} type="submit">
              {t("Import")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ImportArea;
