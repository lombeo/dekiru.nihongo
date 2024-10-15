import { Breadcrumbs } from "@edn/components";
import { Notify } from "@edn/components/Notify/AppNotification";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, Flex, MultiSelect, NumberInput, ScrollArea, Select, Text, TextInput } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { getAccessToken } from "@src/api/axiosInstance";
import { Container } from "@src/components";
import { NotPermission } from "@src/components/NotPermission/NotPermission";
import { resolveLanguage } from "@src/helpers/helper";
import CodingService from "@src/services/Coding/CodingService";
import { FriendService } from "@src/services/FriendService/FriendService";
import yup from "@src/validations/yupGlobal";
import _, { uniqBy } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ChevronDown, Pencil, Trash } from "tabler-icons-react";
import ModalAddSection from "../EvaluatingTemplateCreate/components/ModalAddSection";

const EvaluatingTemplateEdit = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = router.locale;
  const keyLocale = locale === "vi" ? "vn" : "en";

  const [state, handlers] = useListState([]);
  const [dropDown, setDropDown] = useState([]);
  const [indexSectionEdit, setIndexSectionEdit] = useState();
  const [idSection, setIdSection] = useState();
  const [openModalAddSection, setOpenModalAddSection] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const id = router.query.id;
  const token = getAccessToken();

  const fetchDetailWarehouse = async (id: any) => {
    const res = await CodingService.getWarehouse({
      warehouseId: id,
      pageSize: 10000,
      pageIndex: 1,
    });
    if (res?.data?.success) {
      const data = res?.data?.data?.warehouseSummary;
      if (indexSectionEdit) {
        handlers.setItem(indexSectionEdit - 1, {
          subData: data?.listSubWarehouses.map((value) => {
            return {
              numberEasyTask: value.totalEasy,
              numberMediumTask: value.totalMedium,
              numberHardTask: value.totalHard,
              maxNumberEasyTask: value.totalEasy,
              maxNumberMediumTask: value.totalMedium,
              maxNumberHardTask: value.totalHard,
              minNumberEasyTask: 0,
              minNumberMediumTask: 0,
              minNumberHardTask: 0,
              warehouseId: value.id,
              ...value,
            };
          }),
          warehouseId: data?.id,
          name: data?.warehouseName,
        });
      } else {
        handlers.append({
          subData: data?.listSubWarehouses.map((value) => {
            return {
              numberEasyTask: value.totalEasy,
              numberMediumTask: value.totalMedium,
              numberHardTask: value.totalHard,
              maxNumberEasyTask: value.totalEasy,
              maxNumberMediumTask: value.totalMedium,
              maxNumberHardTask: value.totalHard,
              minNumberEasyTask: 0,
              minNumberMediumTask: 0,
              minNumberHardTask: 0,
              warehouseId: value.id,
              ...value,
            };
          }),
          warehouseId: data.id,
          name: data.warehouseName,
        });
      }
      setOpenModalAddSection(false);
    }
  };
  const handleEditSection = (index, id) => {
    setIdSection(id);
    setIndexSectionEdit(index + 1);
    setOpenModalAddSection(true);
  };

  const handleDeleteSection = (index) => {
    handlers.remove(index);
  };
  const initialValues = {
    name: "",
    isPublic: "1",
    point: 1000,
    easyTaskPercent: 0,
    mediumTaskPercent: 0,
    hardTaskPercent: 0,
    duration: 0,
    userViewTemplate: [],
    listTemplateWarehouses: [],
    language: keyLocale,
  };
  const schema = yup.object().shape({
    name: yup
      .string()
      .max(70, t("Name max is 70 characters."))
      .required(t("Name should not be empty."))
      .trim(t("Name should not be empty.")),
    duration: yup
      .number()
      .typeError(t("Duration must be a number."))
      .min(1, t("Duration must be greater than or equal to 1.")),
    point: yup.number().typeError(t("Point must be a number.")).min(1, t("Score must be greater than or equal to 1.")),
  });
  const handleDropdown = (index) => {
    let rawData = [...dropDown];
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] === index) {
        rawData.splice(i, 1);
        setDropDown(rawData);
        return;
      }
    }
    rawData = [...rawData, index];
    setDropDown(rawData);
  };
  const onSubmit = async (data) => {
    const currentLang = data.language;
    let multiLangData = data.multiLangData || [];
    const langData = {
      key: currentLang,
      name: data.name,
    };

    const langDataOther = {
      key: currentLang == "en" ? "vn" : "en",
      name: data.name,
    };

    multiLangData = [...multiLangData.filter((e) => e.key !== currentLang), langData];

    if (multiLangData.length <= 1) {
      multiLangData = [...multiLangData, langDataOther];
    }

    multiLangData.forEach((e) => {
      if (_.isEmpty(e.name)) {
        e.name = data.name;
      }
    });

    const res = await CodingService.saveTemplateEvaluating({
      id: id,
      name: data.name,
      isPublic: data.isPublic === "1",
      point: data.point,
      easyTaskPercent: data.easyTaskPercent,
      mediumTaskPercent: data.mediumTaskPercent,
      hardTaskPercent: data.hardTaskPercent,
      duration: data.duration,
      multiLangData: multiLangData,
      userViewTemplate: data.userViewTemplate.map((value) => {
        return +value;
      }),
      listTemplateWarehouses: state.map((item, index) => {
        return {
          percent: item.percent,
          warehouseId: item.warehouseId,
          listTemplateSubWarehouses: item.subData.map((element) => {
            return {
              warehouseId: element.warehouseId,
              name: element.name,
              minNumberEasyTask: element.minNumberEasyTask || 0,
              maxNumberEasyTask: element.maxNumberEasyTask !== "" ? element.maxNumberEasyTask : element.numberEasyTask,
              minNumberMediumTask: element.minNumberMediumTask || 0,
              maxNumberMediumTask:
                element.maxNumberMediumTask !== "" ? element.maxNumberMediumTask : element.numberMediumTask,
              minNumberHardTask: element.minNumberHardTask || 0,
              maxNumberHardTask: element.maxNumberHardTask !== "" ? element.maxNumberHardTask : element.numberHardTask,
            };
          }),
        };
      }),
    });
    if (res?.data?.success) {
      Notify.success(t("Edit successfully"));
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/evaluating/template");
    } else {
      Notify.error(t(res?.data?.message));
    }
  };

  const handleOpenModal = () => {
    setIdSection(null);
    setIndexSectionEdit(null);
    setOpenModalAddSection(true);
  };

  const methodForm = useForm<any>({
    mode: "onChange",
    defaultValues: initialValues,
    shouldUnregister: false,
    resolver: yupResolver(schema),
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
  } = methodForm;
  const fetch = async () => {
    const res = await CodingService.getDetailTemplate({
      evaluateTemplateId: id,
    });
    if (res?.data?.success) {
      const data = res?.data?.data;
      setUsers(
        data?.listUserViewTemplate?.map((user) => {
          return {
            label: user.userName,
            value: `${user.userId}`,
          };
        })
      );
      reset({
        name: resolveLanguage(data, locale)?.name,
        isPublic: data.isPublic === true ? "1" : "0",
        point: data.point,
        easyTaskPercent: data.easyTaskPercent,
        mediumTaskPercent: data.mediumTaskPercent,
        hardTaskPercent: data.hardTaskPercent,
        duration: data.duration,
        userViewTemplate: data?.listUserViewTemplate?.map((user) => {
          return `${user.userId}`;
        }),
        multiLangData: data?.multiLangData,
        language: keyLocale,
      });
      handlers.setState(
        data.evaluateTemplateWarehouses.map((value) => {
          return {
            subData: value.listTemplateSubWarehouses.map((value) => {
              return {
                totalEasy: value.maxNumberEasyTask,
                totalMedium: value.maxNumberMediumTask,
                totalHard: value.maxNumberHardTask,
                minNumberEasyTask: 0,
                minNumberMediumTask: 0,
                minNumberHardTask: 0,
                warehouseId: value.id,
                ...value,
              };
            }),
            warehouseId: value.warehouseId,
            name: value.name,
            percent: value.percent,
          };
        })
      );
    } else {
      Notify.error(t(res?.data?.message));
    }
  };
  useEffect(() => {
    fetch();
  }, [id, locale]);

  const handleChangeLang = (value) => {
    const preLang = watch("language");
    if (value === preLang) return;
    let multiLangData = watch("multiLangData") || [];

    const data = {
      key: preLang,
      name: watch("name"),
    };
    multiLangData = multiLangData.filter((e) => e.key !== preLang);
    setValue("multiLangData", [...multiLangData, data]);

    const dataLang = multiLangData.find((e) => e.key === value);
    setValue("name", _.isEmpty(dataLang?.name) ? "" : dataLang?.name);

    setValue("language", value);
  };

  return (
    <>
      {!token ? (
        <NotPermission />
      ) : (
        <div className="pb-20">
          {openModalAddSection && (
            <ModalAddSection
              setOpenModalAddSection={setOpenModalAddSection}
              fetchDetailWarehouse={fetchDetailWarehouse}
              indexSectionEdit={indexSectionEdit}
              idSection={idSection}
              listWarehousesTarget={state}
            />
          )}
          <Container>
            <Flex className="justify-center" align="center">
              <Breadcrumbs
                data={[
                  {
                    href: "/",
                    title: t("Home"),
                  },
                  {
                    href: "/evaluating",
                    title: t("Evaluating"),
                  },
                ]}
              />
            </Flex>
            <form className="pb-20" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mt-6 ">
                <Text className="text-2xl font-semibold">{t("Edit template")}</Text>
                <div className="mt-8 flex flex-col gap-4">
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={<Text className="text-base font-semibold inline-block">{t("Language")}</Text>}
                        data={[
                          { label: "Tiếng Việt", value: "vn" },
                          { label: "English", value: "en" },
                        ]}
                        allowDeselect={false}
                        onChange={handleChangeLang}
                      />
                    )}
                  />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label={<Text className="text-base font-semibold inline-block">{t("Template evaluate")}</Text>}
                        withAsterisk
                        placeholder={t("Template evaluate")}
                        error={errors[field.name]?.message as string}
                      />
                    )}
                  />
                  <Controller
                    name="isPublic"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label={<Text className="text-base font-semibold inline-block">{t("Share")}</Text>}
                        withAsterisk
                        data={[
                          {
                            label: t("Private"),
                            value: "0",
                          },
                          {
                            label: t("Public"),
                            value: "1",
                          },
                        ]}
                      />
                    )}
                  />
                  <Controller
                    name="userViewTemplate"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        {...field}
                        placeholder={t("Select user")}
                        data={users}
                        className={`${watch("isPublic") === "1" ? "hidden" : "block"}`}
                        clearable
                        searchable
                        onSearchChange={(query) => {
                          if (!query || query.trim().length < 2) return;
                          FriendService.searchUser({
                            filter: query,
                          }).then((res) => {
                            const data = res?.data?.data;
                            if (data) {
                              setUsers((prev) =>
                                uniqBy(
                                  [
                                    ...prev,
                                    ...data.map((user) => ({
                                      label: user.userName,
                                      value: `${user.userId}`,
                                    })),
                                  ],
                                  "value"
                                )
                              );
                            }
                          });
                        }}
                        label={<Text className="text-base font-semibold inline-block">{t("User who can view")}</Text>}
                      />
                    )}
                  />
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        label={
                          <Text className="text-base font-semibold inline-block">{t("Time allowed on the test")}</Text>
                        }
                        error={errors[field.name]?.message as string}
                      />
                    )}
                  />
                  <Controller
                    name="point"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        disabled
                        {...field}
                        label={<Text className="text-base font-semibold inline-block">{t("Score")}</Text>}
                        error={errors[field.name]?.message as string}
                      />
                    )}
                  />
                  <div>
                    <Text className="font-semibold">{t("Percentage")}</Text>
                    <div className="flex">
                      <div className="w-[33%] border-2">
                        <div className="border-b-2 p-2 flex gap-1">
                          <Text className="font-semibold">{t("Percentage of easy tasks")}</Text>
                          <Text className="font-semibold text-red-500">*</Text>
                        </div>
                        <div className="p-2">
                          <Controller
                            name="easyTaskPercent"
                            control={control}
                            render={({ field }) => (
                              <NumberInput {...field} precision={10} removeTrailingZeros={true} min={0} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-[33%] border-2">
                        <div className="border-b-2 p-2 flex gap-1">
                          <Text className="font-semibold">{t("Percentage of medium tasks")}</Text>
                          <Text className="font-semibold text-red-500">*</Text>
                        </div>
                        <div className="p-2">
                          <Controller
                            name="mediumTaskPercent"
                            control={control}
                            render={({ field }) => (
                              <NumberInput {...field} precision={10} removeTrailingZeros={true} min={0} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="w-[33%] border-2 ">
                        <div className="border-b-2 p-2 flex gap-1">
                          <Text className="font-semibold">{t("Percentage of hard tasks")}</Text>
                          <Text className="font-semibold text-red-500">*</Text>
                        </div>
                        <div className="p-2">
                          <Controller
                            name="hardTaskPercent"
                            control={control}
                            render={({ field }) => (
                              <NumberInput {...field} precision={10} removeTrailingZeros={true} min={0} />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button onClick={handleOpenModal}>{t("Add a new section")}</Button>
                    <DragDropContext
                      onDragEnd={({ destination, source }) =>
                        handlers.reorder({ from: source.index, to: destination?.index || 0 })
                      }
                    >
                      <Droppable droppableId="dnd-list" direction="vertical">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
                            {state.map((item, index) => (
                              <Draggable key={item.warehouseId} index={index} draggableId={item.warehouseId + ""}>
                                {(provided, snapshot) => (
                                  <div
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className="mt-4"
                                  >
                                    <div className="border-2 shadow-md">
                                      <div className="flex justify-between border-2 p-2 bg-gray-200 items-center gap-2 rounded-sm">
                                        <div
                                          className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
                                          onClick={() => handleDropdown(index)}
                                        >
                                          <ChevronDown />
                                          <Text className="font-semibold">{item.name}</Text>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <ActionIcon
                                            color="dark"
                                            onClick={() => handleEditSection(index, item.warehouseId)}
                                          >
                                            <Pencil />
                                          </ActionIcon>
                                          <ActionIcon color="dark" onClick={() => handleDeleteSection(index)}>
                                            <Trash />
                                          </ActionIcon>
                                        </div>
                                      </div>
                                      {dropDown.includes(index) && (
                                        <ScrollArea h={450}>
                                          <div className="bg-white p-3">
                                            <div className="flex gap-2 items-center">
                                              <Text className="text-blue-500">{t("Percentage") + "(%)"}</Text>
                                              <Text className="text-red-500">*</Text>
                                              <NumberInput
                                                value={item.percent}
                                                onChange={(value) => {
                                                  handlers.setItem(index, {
                                                    ...state[index],
                                                    percent: value,
                                                  });
                                                }}
                                                precision={10}
                                                removeTrailingZeros={true}
                                                min={0}
                                                max={100}
                                              />
                                            </div>
                                            {item?.subData?.map((value, indexSub) => {
                                              let data = item.subData;
                                              return (
                                                <div className="pt-3" key={value.id}>
                                                  <div className="border-b">
                                                    <Text className="font-semibold">{value.name}</Text>
                                                  </div>
                                                  <div className="flex pt-2 gap-4">
                                                    <div>
                                                      <div className="flex">
                                                        <Text className="text-blue-500">{t("Easy")}</Text>
                                                        <Text className="text-gray-500">{`(${t("Maximum")}: ${
                                                          value?.numberEasyTask ?? 0
                                                        })`}</Text>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        <NumberInput
                                                          value={value.minNumberEasyTask}
                                                          onChange={(element) => {
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              minNumberEasyTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Minimum value")}
                                                          min={0}
                                                          max={data[indexSub].numberEasyTask}
                                                        />
                                                        <NumberInput
                                                          value={value.maxNumberEasyTask}
                                                          onChange={(element) => {
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              maxNumberEasyTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Maximum value")}
                                                          min={0}
                                                          max={data[indexSub].numberEasyTask}
                                                        />
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="flex">
                                                        <Text className="text-blue-500">{t("Medium")}</Text>
                                                        <Text className="text-gray-500">{`(${t("Maximum")}: ${
                                                          value?.numberMediumTask ?? 0
                                                        })`}</Text>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        <NumberInput
                                                          value={value.minNumberMediumTask}
                                                          onChange={(element) => {
                                                            let data = item.subData;
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              minNumberMediumTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Minimum value")}
                                                          min={0}
                                                          max={data[indexSub].numberMediumTask}
                                                        />
                                                        <NumberInput
                                                          value={value.maxNumberMediumTask}
                                                          onChange={(element) => {
                                                            let data = item.subData;
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              maxNumberMediumTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Maximum value")}
                                                          min={0}
                                                          max={data[indexSub].numberMediumTask}
                                                        />
                                                      </div>
                                                    </div>
                                                    <div>
                                                      <div className="flex">
                                                        <Text className="text-blue-500">{t("Hard")}</Text>
                                                        <Text className="text-gray-500">{`(${t("Maximum")}: ${
                                                          value?.numberHardTask ?? 0
                                                        })`}</Text>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        <NumberInput
                                                          value={value.minNumberHardTask}
                                                          onChange={(element) => {
                                                            let data = item.subData;
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              minNumberHardTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Minimum value")}
                                                          min={0}
                                                          max={data[indexSub].numberHardTask}
                                                        />
                                                        <NumberInput
                                                          value={value.maxNumberHardTask}
                                                          onChange={(element) => {
                                                            let data = item.subData;
                                                            data[indexSub] = {
                                                              ...data[indexSub],
                                                              maxNumberHardTask: element,
                                                            };
                                                            handlers.setItem(index, {
                                                              ...item,
                                                              subData: [...data],
                                                            });
                                                          }}
                                                          placeholder={t("Maximum value")}
                                                          min={0}
                                                          max={data[indexSub].numberHardTask}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </ScrollArea>
                                      )}
                                    </div>
                                    <div></div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => router.push("/evaluating/template")}>
                      {t("Cancel")}
                    </Button>
                    <Button type="submit">{t("Save")}</Button>
                  </div>
                </div>
              </div>
            </form>
          </Container>
        </div>
      )}
    </>
  );
};

export default EvaluatingTemplateEdit;
