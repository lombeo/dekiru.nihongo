import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Select, TextInput, Image, ActionIcon, Autocomplete, Modal, Checkbox, ScrollArea } from "@mantine/core";
import yup from "@src/validations/yupGlobal";
import { Trans, useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CodingService from "@src/services/Coding/CodingService";
import { IdentityService } from "@src/services/IdentityService";
import { Notify } from "@src/components/cms";
import { useSelector } from "react-redux";
import { getEventProfile } from "@src/store/slices/eventSlice";
import { capitalizeName } from "@src/constants/event/event.constant";
import { selectProfile } from "@src/store/slices/authSlice";
import Avatar from "@src/components/Avatar";
import { Calendar, Camera } from "tabler-icons-react";
import { UploadService } from "@src/services/UploadService/UploadService";
import { fileType } from "@src/config";
import { DatePickerInput } from "@mantine/dates";
import { convertDate, FunctionBase } from "@src/helpers/fuction-base.helpers";
import Link from "@src/components/Link";
import useDebounce from "@src/hooks/useDebounce";

export default function EventUpdateProfileModal({ onCloseUpdateProfileModal, onUpdateSuccess }) {
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [university, setUniversity] = useState([]);
  const [userData, setUserData] = useState(null);

  const eventProfile = useSelector(getEventProfile);
  const profile = useSelector(selectProfile);

  const classList: any = [
    { label: "Khối 1", value: 1 },
    { label: "Khối 2", value: 2 },
    { label: "Khối 3", value: 3 },
    { label: "Khối 4", value: 4 },
    { label: "Khối 5", value: 5 },
    { label: "Khối 6", value: 6 },
    { label: "Khối 7", value: 7 },
    { label: "Khối 8", value: 8 },
    { label: "Khối 9", value: 9 },
    { label: "Khối 10", value: 10 },
    { label: "Khối 11", value: 11 },
    { label: "Khối 12", value: 12 },
    { label: "Khác", value: 13 },
  ];

  const firstTime = useRef(true);

  const { t } = useTranslation();

  const VietNamId = 238;

  const initialValues = {
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    school: "",
    schoolName: "",
    class: "",
  };

  const schema = yup.object().shape({
    fullName: yup.string().required(t("This field is required, do not be left blank")),
    phoneNumber: yup
      .string()
      .nullable()
      .required(t("This field is required, do not be left blank"))
      .test(
        "is-valid-phone",
        t("You must enter a valid phone number."),
        (value) => !value || /(^[0-9\-\+]{1})+([0-9]{9,12})$/g.test(value)
      ),
    province: yup.string().nullable().required(t("This field is required, do not be left blank")),
    district: yup.string().nullable().required(t("This field is required, do not be left blank")),
    school: yup.string().when("class", {
      is: (val: string) => val !== "13",
      then: yup.string().nullable().required(t("This field is required, do not be left blank")),
      otherwise: yup.string().notRequired(),
    }),
    schoolName: yup.string().when("class", {
      is: (val: string) => val === "13",
      then: yup.string().nullable().required(t("This field is required, do not be left blank")),
      otherwise: yup.string().notRequired(),
    }),
    class: yup.string().nullable().required(t("This field is required, do not be left blank")),
    agree: yup
      .boolean()
      .required(t("You have not agreed to our Terms of Service and Privacy Policy"))
      .isTrue(t("You have not agreed to our Terms of Service and Privacy Policy")),
  });

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
    setValue,
    watch,
  } = methodForm;

  const debounceUni = useDebounce(watch("schoolName"));

  useEffect(() => {
    fetchUniversity(watch("schoolName"));
  }, [debounceUni]);

  useEffect(() => {
    if (eventProfile) {
      methodForm.setValue("fullName", eventProfile?.fullName || "");
      methodForm.setValue("phoneNumber", eventProfile?.phoneNumber || "");
      methodForm.setValue("address", eventProfile?.address || "");
      methodForm.setValue("avatarUrl", eventProfile?.avatarUrl || "");
      methodForm.setValue("schoolName", FunctionBase.htmlDecode(eventProfile?.school?.name) || "");
      methodForm.setValue("major", FunctionBase.htmlDecode(eventProfile?.school?.major) || "");
      methodForm.setValue("fromDate", convertDate(eventProfile?.school?.fromDate) || null);
      methodForm.setValue("toDate", convertDate(eventProfile?.school?.toDate) || null);
      methodForm.setValue("birthYear", convertDate(eventProfile?.birthYear) || null);

      if (eventProfile?.province && eventProfile.province?.id !== 0) {
        methodForm.setValue("province", eventProfile?.province?.id);
        setProvinceList([{ label: eventProfile?.province?.name || "", value: eventProfile?.province?.id }]);
      }

      if (eventProfile?.district && eventProfile.district?.id !== 0) {
        methodForm.setValue("district", eventProfile?.district?.id);
        setDistrictList([{ label: eventProfile?.district?.name || "", value: eventProfile?.district?.id }]);
      }

      if (eventProfile?.school && eventProfile.school?.id !== 0) {
        methodForm.setValue("school", eventProfile.school.id);
        setSchoolList([{ label: eventProfile.school?.name || "", value: eventProfile.school?.id }]);
      }
      const classTemp = classList.find((item) => item.label === eventProfile.school?.grade);
      if (classTemp) methodForm.setValue("class", classTemp.value);
      else if (eventProfile.school?.grade) methodForm.setValue("class", 13);
      setUserData(eventProfile);
    }
    setTimeout(() => (firstTime.current = false), 500);
  }, [eventProfile]);

  useEffect(() => {
    if (!firstTime.current) {
      methodForm.setValue("district", "");
      setDistrictList([]);
    }
  }, [methodForm.watch("province")]);

  useEffect(() => {
    if (!firstTime.current) {
      methodForm.setValue("address", "");
      methodForm.setValue("school", "");
      setSchoolList([]);
    }
  }, [methodForm.watch("district")]);

  useEffect(() => {
    if (!firstTime.current) {
      methodForm.setValue("school", "");
      methodForm.setValue("schoolName", "");
      methodForm.setValue("major", "");
      methodForm.setValue("fromDate", null);
      methodForm.setValue("toDate", null);
    }
  }, [methodForm.watch("class")]);

  const isDistrictDisabled = !methodForm.watch("province");
  const isSchoolDisabled = !methodForm.watch("class");
  const isAddressDisabled = !methodForm.watch("district");
  const isClassDisabled = !methodForm.watch("district");

  const handleGetAllProvince = async () => {
    const res = await CodingService.getAllCountry({
      parentId: VietNamId,
    });

    if (res?.data?.data) {
      const arr = res?.data?.data.map((item) => ({ label: item?.name, value: item?.id }));
      setProvinceList(arr);
    }
  };

  const handleGetAllDistrict = async () => {
    const res = await CodingService.getAllCountry({
      parentId: methodForm.getValues("province"),
    });

    if (res?.data?.data) {
      const arr = res?.data?.data.map((item) => ({ label: item?.name, value: item?.id }));
      setDistrictList(arr);
    }
  };

  const handleGetAllSchool = async () => {
    const res = await IdentityService.getSchoolOrUniversity({
      districtId: methodForm.getValues("district"),
    });

    const obj = res?.data?.data;
    if (res?.data?.data) {
      const arr = [];
      for (let key in obj) {
        arr.push({ label: obj[key], value: Number(key) });
      }
      setSchoolList(arr);
    }
  };

  const fetchUniversity = async (university: string) => {
    const res = await IdentityService.getSchoolOrUniversity({ keyword: university });
    const objectData = res?.data?.data;
    if (res?.data?.success && objectData) {
      setUniversity(Object.values(objectData));
    }
  };

  const onSubmit = async (rawdata: any) => {
    const gradeTemp = classList.find((item) => item.value == rawdata.class);
    const params = {
      isFromMyProfile: true,
      fullName: capitalizeName(rawdata.fullName),
      phoneNumber: rawdata.phoneNumber,
      address: rawdata.address,
      birthYear: rawdata.birthYear,
      avatarUrl: rawdata.avatarUrl,
      provinceId: Number(rawdata.province),
      districtId: Number(rawdata.district),
      school: {
        educationId: Number(userData?.school?.educationId) || 0,
        id: gradeTemp.value !== 13 ? Number(rawdata.school) : 0,
        grade: gradeTemp ? gradeTemp.label : "",
        name: rawdata?.schoolName,
        major: rawdata?.major,
        fromDate: rawdata?.fromDate,
        toDate: rawdata?.toDate,
      },
    };
    const res = await IdentityService.updateUserProfileFromContest(params);
    if (res?.data?.success) {
      onUpdateSuccess();
      Notify.success(t("Update information successfully!"));
    }
    onCloseUpdateProfileModal();
  };

  const validation = (file: any) => {
    let isValid = true;
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

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    const isValid = validation(file);
    if (!isValid) {
      return;
    }
    const res = await UploadService.upload(file, fileType.assignmentAttach);
    if (res.data?.success && res.data.data) {
      const url = res.data.data.url;
      setValue(`avatarUrl`, url);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onCloseUpdateProfileModal}
      size={"xl"}
      title={<span className="text-[18px] font-bold uppercase">{t("Update profile")}</span>}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <div className="p-4">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <>
              <div className="relative mx-auto">
                <input
                  accept="image/png, image/gif, image/jpeg"
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Avatar
                  className=""
                  size={120}
                  userId={0}
                  userExpLevel={profile?.userExpLevel}
                  src={watch("avatarUrl")}
                />
                <ActionIcon
                  onClick={() => document.getElementById("fileInput").click()}
                  className="absolute bottom-0 right-0 !z-100 bg-white p-2 rounded-full border-2 border-[#DBDBDB]"
                  size={"lg"}
                >
                  <Camera />
                </ActionIcon>
              </div>
            </>
            <div className="sm:flex sm:gap-4 sm:space-y-0 space-y-4">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label={t("Full name")}
                    placeholder={t("Type full name")}
                    error={errors[field.name]?.message as string}
                    autoComplete="off"
                    size="md"
                    required
                    className="w-full"
                  />
                )}
              />
              <Controller
                name="birthYear"
                control={control}
                render={({ field }) => (
                  <DatePickerInput
                    {...field}
                    label={t("Birthday")}
                    maxDate={new Date()}
                    size="md"
                    placeholder={t("Birthday")}
                    valueFormat="DD/MM/YYYY"
                    className="w-full"
                    icon={<Calendar size={16} />}
                    clearable
                    error={errors[field.name]?.message as string}
                  />
                )}
              />
            </div>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={t("Phone number")}
                  placeholder={t("Type phone number")}
                  error={errors[field.name]?.message as string}
                  onChange={(e) => {
                    setUserData({ ...userData, phoneNumber: e.target.value });
                    field.onChange(e);
                  }}
                  required
                  autoComplete="off"
                  size="md"
                  rightSection={
                    eventProfile?.isVerifiedPhoneNumber && userData?.phoneNumber === eventProfile?.phoneNumber ? (
                      <Image alt="checked" src="/images/event/check-mark.png" height={20} width={20} />
                    ) : null
                  }
                />
              )}
            />
            {eventProfile?.isVerifiedPhoneNumber && userData?.phoneNumber === eventProfile?.phoneNumber ? (
              <span className="-mt-2 text-xs text-[#8899A8]">{t("Phone number has been verified")}</span>
            ) : null}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/2">
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t("Province")}
                      placeholder={"Chọn tỉnh thành"}
                      nothingFound={t("No result found")}
                      data={provinceList}
                      clearable
                      searchable
                      error={errors[field.name]?.message as string}
                      size="md"
                      onFocus={() => handleGetAllProvince()}
                      required
                    />
                  )}
                />
              </div>

              <div className="sm:w-1/2">
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t("District")}
                      placeholder={"Chọn quận huyện"}
                      nothingFound={t("No result found")}
                      data={districtList}
                      clearable
                      searchable
                      error={errors[field.name]?.message as string}
                      size="md"
                      onFocus={() => handleGetAllDistrict()}
                      disabled={isDistrictDisabled}
                      required
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t("Grade_1")}
                  placeholder={t("Select grade")}
                  nothingFound={t("No result found")}
                  data={classList}
                  clearable
                  searchable
                  error={errors[field.name]?.message as string}
                  size="md"
                  disabled={isDistrictDisabled || isClassDisabled}
                  required
                />
              )}
            />
            {watch("class") !== 13 && (
              <Controller
                name="school"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t("School")}
                    placeholder={t("Select school")}
                    nothingFound={t("No result found")}
                    data={schoolList}
                    clearable
                    searchable
                    error={errors[field.name]?.message as string}
                    size="md"
                    onFocus={() => handleGetAllSchool()}
                    disabled={isDistrictDisabled || isSchoolDisabled || isClassDisabled}
                    required
                  />
                )}
              />
            )}

            {watch("class") === 13 && (
              <>
                <div className="sm:flex sm:gap-4 sm:space-y-0 space-y-4">
                  <Controller
                    name="schoolName"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        label={t("School")}
                        placeholder={t("Select or input school")}
                        required
                        maxDropdownHeight={200}
                        error={errors[field.name]?.message as string}
                        autoComplete="off"
                        size="md"
                        className="w-full"
                        data={university}
                        disabled={isDistrictDisabled || isSchoolDisabled || isClassDisabled}
                      />
                    )}
                  />
                  <Controller
                    name="major"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label={t("Major")}
                        placeholder={t("Your graduated major")}
                        error={errors[field.name]?.message as string}
                        autoComplete="off"
                        className="w-full"
                        size="md"
                        disabled={isDistrictDisabled || isSchoolDisabled || isClassDisabled || !watch("schoolName")}
                      />
                    )}
                  />
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <Controller
                    name="fromDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        {...field}
                        icon={<Calendar size={16} />}
                        clearable
                        size="md"
                        valueFormat="DD/MM/YYYY"
                        decadeLabelFormat="DD/MM/YYYY"
                        placeholder={t("From date")}
                        disabled={isDistrictDisabled || isSchoolDisabled || isClassDisabled || !watch("schoolName")}
                        error={errors[field.name]?.message as string}
                        label={t("From")}
                      />
                    )}
                  />
                  <Controller
                    name="toDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        {...field}
                        icon={<Calendar size={16} />}
                        clearable
                        size="md"
                        valueFormat="DD/MM/YYYY"
                        decadeLabelFormat="DD/MM/YYYY"
                        placeholder={t("To date")}
                        disabled={isDistrictDisabled || isSchoolDisabled || isClassDisabled || !watch("schoolName")}
                        error={errors[field.name]?.message as string}
                        label={t("To")}
                      />
                    )}
                  />
                </div>
              </>
            )}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label={t("Address")}
                  placeholder={t("Type address")}
                  error={errors[field.name]?.message as string}
                  autoComplete="off"
                  size="md"
                  disabled={isAddressDisabled}
                />
              )}
            />
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  label={
                    <Trans i18nKey="AGREE_PRIVACY_POLICY" t={t}>
                      I agree to
                      <Link target="_blank" href={`/terms`} className="text-[#337ab7] hover:underline">
                        Terms of Service and Privacy Policy
                      </Link>
                    </Trans>
                  }
                  error={errors[field.name]?.message as string}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full mt-6" size="md">
            {t("Update")}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

EventUpdateProfileModal.defaultProps = { onUpdateSuccess: () => {} };
