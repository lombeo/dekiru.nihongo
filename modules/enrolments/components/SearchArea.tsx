import Icon from "@edn/font-icons/icon";
import { ActionIcon, Button, NumberInput, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { FriendService } from "@src/services/FriendService/FriendService";
import dayjs from "dayjs";
import _, { isNil } from "lodash";
import { useTranslation } from "next-i18next";
import AsyncSelect from "react-select/async";

const SearchArea = (props) => {
  const { setFilter, filter, onSubmit } = props;

  const { t } = useTranslation();
  let debouncedTime: any;
  const handleChangeProgress = (e) => {
    clearTimeout(debouncedTime);
    if (e) {
      debouncedTime = setTimeout(function () {
        setFilter({ ...filter, progress: parseFloat(e) > 100 ? 100 : parseFloat(e) });
      }, 800);
    } else {
      debouncedTime = setTimeout(function () {
        setFilter({ ...filter, progress: 0 });
      }, 800);
    }
  };

  const handleChangeDate = (value, startDate, endDate) => {
    if (startDate) {
      setFilter({ ...filter, startDate: value });
    }
    if (endDate) {
      setFilter({ ...filter, endDate: value });
    }
  };

  const onRemoveStartDate = () => {
    setFilter({ ...filter, startDate: null });
  };
  const onRemoveEndDate = () => {
    setFilter({ ...filter, endDate: null });
  };

  const handleChangeSelect = (value) => {
    setFilter({ ...filter, status: parseInt(value) });
  };

  const handleSearch = () => {
    onSubmit();
  };

  return (
    <div className="lg:grid-cols-[1fr_1fr_1fr_2fr_auto] md:grid-cols-2 grid-cols-1 grid gap-4 items-start flex-wrap lg:flex-nowrap">
      <div className="w-full">
        <label style={{ color: "#212529" }} className="text-sm font-medium">
          {t("Username")}
        </label>
        <AsyncSelect
          onChange={(value) => setFilter({ ...filter, users: value })}
          value={filter.users}
          isMulti
          classNames={{
            control: () => "!min-h-[34px] hover:shadow-none hover:!border-[#2C31CF]",
            placeholder: () => "text-sm !text-[#AEB7BF]",
            noOptionsMessage: () => "text-sm",
            valueContainer: () => "!py-0",
            indicatorsContainer: () => "h-[34px]",
          }}
          noOptionsMessage={(obj) =>
            !_.isNil(obj.inputValue) && obj.inputValue.length >= 2
              ? t("No result found")
              : t("Enter 2 or more characters")
          }
          placeholder={t("Select")}
          loadOptions={(query: string, callback: (options: any[]) => void) => {
            if (!query || query.trim().length < 2) {
              callback([]);
              return;
            }
            FriendService.searchUser({
              filter: query,
            }).then((res: any) => {
              const data = res?.data?.data;
              callback(
                data?.map((user: any) => ({
                  label: user.userName,
                  value: `${user.userId}`,
                })) || []
              );
            });
          }}
        />
      </div>
      <div className="w-full lg:w-auto">
        <Select
          label={t("Status")}
          placeholder={t("Select")}
          data={[
            { value: "-1", label: t("All") },
            { value: "1", label: t("Active") },
            { value: "0", label: t("Pending") },
          ]}
          // value={filter?.status}
          size="sm"
          className="grow"
          onChange={handleChangeSelect}
        />
      </div>
      <div className="w-full lg:w-auto">
        <NumberInput
          // decimalSeparator="."
          // precision={2}
          key={`${filter.progress}`}
          placeholder={`${t("Progress")} (>=)`}
          label={`${t("Progress")} (>=)`}
          className="grow"
          onChange={handleChangeProgress}
          hideControls
          defaultValue={0}
          max={100}
          min={0}
          size="sm"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          value={isNil(filter.progress) ? "" : filter.progress}
        />
      </div>
      <div className="flex flex-col">
        <label style={{ color: "#212529" }} className="h-[25px] text-sm font-medium flex align-center justify-between">
          {t("Enrollment date (From date -to date)")}
        </label>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-1 w-full">
          <DatePickerInput
            className="w-full"
            maxDate={dayjs(new Date()).endOf("day").toDate()}
            placeholder={t("dd/mm/yyyy")}
            valueFormat="DD/MM/YYYY"
            decadeLabelFormat="DD/MM/YYYY"
            value={filter?.startDate}
            onChange={(e) => {
              handleChangeDate(e, true, null);
            }}
            classNames={{ label: "whitespace-nowrap" }}
            rightSection={
              filter.startDate && (
                <ActionIcon onClick={() => onRemoveStartDate()} variant="subtle">
                  <Icon name="close" size="12" />
                </ActionIcon>
              )
            }
          />
          <div className="pt-2.5">-</div>
          <DatePickerInput
            className="w-ful"
            minDate={dayjs(filter.startDate).startOf("day").toDate()}
            maxDate={dayjs(new Date()).endOf("day").toDate()}
            valueFormat="DD/MM/YYYY"
            decadeLabelFormat="DD/MM/YYYY"
            placeholder={t("dd/mm/yyyy")}
            value={filter.endDate}
            onChange={(e) => {
              handleChangeDate(e, null, true);
            }}
            classNames={{ label: "whitespace-pre" }}
            rightSection={
              filter.endDate && (
                <ActionIcon onClick={() => onRemoveEndDate()} variant="subtle">
                  <Icon name="close" size="12" />
                </ActionIcon>
              )
            }
          />
        </div>
      </div>
      <div className="mt-2 md:mt-6 pt-0.5  w-full md:w-auto">
        <Button onClick={handleSearch} className="w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <Icon name="search" size={24} />
            {t("Search")}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SearchArea;
