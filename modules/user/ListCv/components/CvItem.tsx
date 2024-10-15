import { confirmAction } from "@edn/components/ModalConfirm";
import { Notify } from "@edn/components/Notify/AppNotification";
import { TextLineCamp } from "@edn/components/TextLineCamp";
import { Menu, Switch } from "@mantine/core";
import { Cv } from "@src/components/Svgr/components";
import { RecruitmentService } from "@src/services/RecruitmentService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { InfoCircle, Pencil, Trash } from "tabler-icons-react";

const CvItem = (props: any) => {
  const { data, refetch } = props;
  const { t } = useTranslation();
  const router = useRouter();

  // const [isPublic, setIsPublic] = useState(data.isPublic);
  // const [isOpen, setIsOpen] = useState(data.isOpen);
  // const [loading, setLoading] = useState(null);

  const isPublic = data.isPublic;
  const isOpen = data.isOpen;

  const handlePublic = async () => {
    confirmAction({
      message: t(isPublic ? "Don't allow your profile to be searched?" : "Allow searching for your profile?"),
      onConfirm: async () => {
        const res = await RecruitmentService.cvSwitchIsPublicStatus(data?.id);
        if (res.data?.success) {
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  const handleOpen = async () => {
    confirmAction({
      message: t(isOpen ? "Turn off job search for this CV?" : "Turn on job search for this CV?"),
      onConfirm: async () => {
        const res = await RecruitmentService.cvSwitchIsOpenStatus(data?.id);
        if (res.data?.success) {
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  const handleDelete = () => {
    confirmAction({
      message: t("Are you sure you want to delete?"),
      onConfirm: async () => {
        const res = await RecruitmentService.cvDelete(data.id);
        if (res.data?.success) {
          Notify.success(t("Delete successfully!"));
          refetch();
        } else if (res.data?.message) {
          Notify.error(t(res.data?.message));
        }
      },
    });
  };

  return (
    <div className="bg-white relative rounded-md shadow-md flex gap-2 items-center p-5">
      <Cv width={56} height={56} className="flex-none" />
      <TextLineCamp line={2} className="font-semibold text-lg">
        {data.name}
      </TextLineCamp>
      <div className="ml-auto text-sm flex items-center border-r border-l px-2 gap-2">
        <div className="flex flex-none flex-col gap-3">
          <div className="flex flex-none gap-2">
            <Switch
              checked={isPublic}
              onChange={() => {
                handlePublic();
              }}
            />
            {t("Make profile searchable")}
            <div
              className="flex items-center cursor-pointer"
              data-tooltip-id="global-tooltip"
              data-tooltip-place="top"
              data-tooltip-content={t(
                "Enabling Make profile searchable will maximize the chances of Employers contacting you."
              )}
            >
              <InfoCircle height={16} width={16} />
            </div>
          </div>
          <div className="flex flex-none gap-2">
            <Switch
              checked={isOpen}
              onChange={() => {
                handleOpen();
              }}
            />
            {t("Make is open for work")}
          </div>
        </div>
      </div>
      {/*<Button*/}
      {/*  */}
      {/*  className="bg-[#F0EDF8] text-[#2C31CF] hover:bg-[#F0EDF8]"*/}
      {/*>*/}
      {/*  {t("Edit")}*/}
      {/*</Button>*/}
      <Menu offset={0} zIndex={601} withArrow withinPortal shadow="md">
        <Menu.Target>1</Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => router.push(`/user/cv/${data.id}`)} icon={<Pencil color="blue" size={14} />}>
            {t("Edit")}
          </Menu.Item>
          <Menu.Item onClick={() => handleDelete()} icon={<Trash color="red" size={14} />}>
            {t("Delete")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default CvItem;
