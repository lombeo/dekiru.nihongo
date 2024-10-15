import { Anchor, Badge, Table, Title } from "@mantine/core";
import { Button, Modal, confirmAction } from "components/cms";
import { Subtitle } from "modules/cms/models/settings.model";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { VideoSubtitleForm } from "./VideoSubtitleForm";
interface VideoSubtitleProps {
  getSubtitles: Function;
  subtitlesInit: Array<Subtitle>;
}
/**
 *
 * @param props
 * getSubtitles: return subtitles value
 * subtitlesInit: subtitles init when amount component
 * @returns
 */
export const VideoSubtitle = (props: VideoSubtitleProps) => {
  const { t } = useTranslation();
  const { getSubtitles, subtitlesInit } = props;
  const [subtitles, setSubtitles] = useState<any>(subtitlesInit || []);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [keyEdit, setKeyEdit] = useState(null);
  const [data, setData] = useState<Subtitle | null>(null);
  const [keysDisable, setKeyDisable] = useState<any>(null);

  const rows =
    subtitles?.length > 0 ? (
      subtitles?.map((element: any) => (
        <tr key={element.lang}>
          <td>{element.label}</td>
          <td>{element.default ? <Badge variant="filled">{t("Default")}</Badge> : ""}</td>
          <td align="right">
            {!element.default ? (
              <Anchor className="mx-2" component="a" size="sm" onClick={() => onSetDefault(element?.lang)}>
                {t("Set default")}
              </Anchor>
            ) : (
              ""
            )}
            <Anchor className="mx-2" component="a" size="sm" onClick={() => onEdit(element)}>
              {t("Edit")}
            </Anchor>
            <Anchor className="mx-2" component="a" size="sm" onClick={() => onDelete(element?.lang)}>
              {t("Delete")}
            </Anchor>
          </td>
        </tr>
      ))
    ) : (
      <tr className="text-center">
        <td colSpan={4} style={{ color: "rgb(134, 142, 150)" }}>
          {t("No data")}
        </td>
      </tr>
    );

  const onSaveModal = (value: any) => {
    if (isEdit) {
      var dataChange = subtitles.reduce((preItem: any, currentItem: any) => {
        if (currentItem.lang == keyEdit) preItem.push(value);
        else preItem.push(currentItem);
        return preItem;
      }, []);
      setSubtitles(dataChange);
    } else {
      const dataTemp = [...subtitles, value];
      setSubtitles(dataTemp);
    }
    onCloseModal();
  };

  const onSetDefault = (lang: string) => {
    var dataTemp = subtitles?.map((item: any) => {
      if (item?.lang == lang) item.default = true;
      else item.default = false;
      return item;
    });
    setSubtitles(dataTemp);
  };
  const onEdit = (item: any) => {
    setKeyEdit(item?.lang);
    setIsEdit(true);
    setData(item);
    setOpenModal(true);
  };

  const onDelete = (lang: string) => {
    const onConfirm = () => {
      var sub = subtitles?.filter((x: any) => x?.lang != lang);
      setSubtitles(sub);
    };
    confirmAction({
      message: t("Are you sure you want to delete this item?"),
      onConfirm,
    });
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setData(null);
    setIsEdit(false);
    setKeyEdit(null);
  };

  useEffect(() => {
    var key = subtitles?.length > 0 ? subtitles?.map((item: any) => item?.lang) : null;
    setKeyDisable(key);
    checkItemDefault();
    getSubtitles && getSubtitles(subtitles);
  }, [subtitles]);

  const checkItemDefault = () => {
    if (subtitles?.length > 0) {
      var item = subtitles?.some((item: any) => item.default);
      if (!item && subtitles?.length > 0) {
        var dataChange = subtitles.reduce((preItem: any, currentItem: any, index: any) => {
          if (index == 0) preItem.push({ ...currentItem, default: true });
          else preItem.push(currentItem);
          return preItem;
        }, []);
        setSubtitles(dataChange);
      }
    }
  };

  return (
    <>
      <Title order={3}>{t("Subtitles")}</Title>
      <Table>
        <thead>
          <tr>
            <th>{t("Language")}</th>
            <th>{t("Status")}</th>
            <th style={{ textAlign: "right" }}>{t("Action")}</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Button className="mt-2" preset="primary" size="xs" onClick={() => setOpenModal(true)}>
        {t("Add language")}
      </Button>
      <Modal title={t("Add subtitle")} opened={openModal} size="lg" onClose={onCloseModal}>
        <VideoSubtitleForm data={data} keysDisable={keysDisable} onSave={onSaveModal} onClose={onCloseModal} />
      </Modal>
    </>
  );
};
