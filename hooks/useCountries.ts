import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import { selectCountries, setCountries } from "@src/store/slices/applicationSlice";
import { VIETNAM_COUNTRY_ID } from "@src/config";
import CodingService from "@src/services/Coding/CodingService";
import { useTranslation } from "next-i18next";

export const useGetStateLabel = () => {
  const countries = useSelector(selectCountries);
  return useCallback(
    (stateId: any) => {
      if (!stateId) return null;
      return countries?.find((item) => item.id == stateId)?.name;
    },
    [countries]
  );
};

const useCountries = (countryId?: any) => {
  const { t } = useTranslation();
  const countries = useSelector(selectCountries);
  const dispatch = useDispatch();

  const stateVNOptions = useMemo(() => {
    return (
      countries
        ?.filter((e) => e.parentId == VIETNAM_COUNTRY_ID)
        ?.map((e) => ({ label: e.name, value: _.toString(e.id) })) || []
    );
  }, [countries]);

  const stateVNOptionsWithAll = useMemo(
    () => [{ value: "0", label: t("All provinces") }, ...stateVNOptions],
    [stateVNOptions]
  );

  const stateOptions = useMemo(() => {
    if (!countryId) return [];
    return (
      countries?.filter((e) => e.parentId == countryId)?.map((e) => ({ label: e.name, value: _.toString(e.id) })) || []
    );
  }, [countries, countryId]);

  const countriesOptions = useMemo(() => {
    return countries?.filter((e) => !e.parentId)?.map((e) => ({ label: e.name, value: _.toString(e.id) })) || [];
  }, [countries]);

  const fetchData = async () => {
    if (countries) return;
    const res = await CodingService.userGetAllCountry();
    const data = res?.data?.data;
    if (data) {
      dispatch(setCountries(data));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    countriesOptions,
    stateVNOptions,
    stateVNOptionsWithAll,
    stateOptions,
    countries,
  };
};

export default useCountries;
