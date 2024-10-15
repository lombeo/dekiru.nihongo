import React, { memo, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import Popover from "@src/components/TagField/Popover";
import SelectItem from "@src/components/TagField/SelectItem";
import Fieldset from "@src/components/TagField/Fieldset";
import { isArray, isNil, isNumber, isString } from "lodash";
import { Button, Text } from "@edn/components";
import Icon from "@edn/font-icons/icon";
import useDebounce from "@src/hooks/useDebounce";
import { useTranslation } from "next-i18next";
import { Placement } from "@popperjs/core/lib/enums";
import clsx from "clsx";
import { Selector, X } from "tabler-icons-react";
import { v4 as uuidv4 } from "uuid";

export interface DataSource {
  data: any[];
  limit: number;
  total: number;
}

export interface SelectInfiniteProps extends React.PropsWithChildren<{}> {
  fetchOptions: (query: string, page: number) => Promise<DataSource | undefined>;
  value: any[] | null | undefined;
  getOptionLabel: (option: any) => React.ReactNode;
  onChange: (value: any) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string | null;
  debounceTimeout?: number;
  disabledDebounce?: boolean;
  placement?: Placement;
  id?: string;
  uniqueKey?: string; //default: id
  limitTag?: number;
  minHeight?: React.CSSProperties["minHeight"];
  maxHeight?: number;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: React.ReactNode;
}

const SelectInfinite = React.forwardRef<any, PropsWithChildren<SelectInfiniteProps>>((props, ref) => {
  const {
    placement = "bottom-start",
    value,
    fetchOptions,
    id,
    debounceTimeout = 300,
    uniqueKey = "id",
    getOptionLabel,
    limitTag = 3,
    multiple,
    disabled,
    required,
    label,
    onChange,
    error,
    helperText,
    placeholder,
  } = props;
  const { t } = useTranslation();
  const uid = useMemo(() => (id ? id : `SelectInfinite-${uuidv4()}`), [id]);
  const containerListItemRef = useRef<HTMLDivElement | null>(null);
  const refOptions = useRef<any[]>([]);
  const isChanging = useRef<boolean>(true);
  const didMountRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const activatorRef = useRef<any>(null);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [metaData, setMetaData] = useState({
    currentPage: 1,
    totalPage: 0,
    totalItems: 0,
  });

  React.useImperativeHandle(ref, () => ({
    refetch: handleQueryChange,
  }));

  const isSelected = useCallback(
    (option: any) => {
      if (isNil(value)) return false;
      if (isString(option) || isNumber(option)) {
        return value.some((e) => {
          if (isString(option) || isNumber(option)) {
            return e === option;
          }
          return e[uniqueKey] === option;
        });
      } else {
        if (isArray(value) && !!value.filter((e: any) => e[uniqueKey] === option[uniqueKey])?.[0]) return true;
        return value[uniqueKey] === option[uniqueKey];
      }
    },
    [value, uniqueKey]
  );

  const version = useRef(0);
  const queryDebounce = useDebounce(query, debounceTimeout);

  useEffect(() => {
    refOptions.current = options;
  });

  useEffect(() => {
    if (didMountRef.current && open) {
      handleQueryChange(1);
    } else {
      didMountRef.current = true;
    }
  }, [queryDebounce]);

  const handleQueryChange = useCallback(
    async (page = metaData.currentPage, append = false) => {
      version.current += 1;
      const currentVer = version.current;
      try {
        const res = await fetchOptions(queryDebounce, page);
        if (res?.data) {
          if (currentVer < version.current) return;
          isChanging.current = false;
          setOpen(true);
          setMetaData({
            currentPage: page,
            totalPage: Math.ceil(res.total / res.limit),
            totalItems: res.total,
          });
          setOptions((prev) => (append ? [...prev, ...res.data] : res.data));
          if (!append) {
            let wrapper = containerListItemRef.current?.querySelector(".InfiniteScroll-ListItem");
            if (wrapper) wrapper.scrollTop = 0;
          }
          setTimeout(() => {
            let listSuggestItem = containerListItemRef.current?.querySelectorAll(`[data-event='true']`);
            if (!append && listSuggestItem && listSuggestItem.length > 0 && res.data) {
              listSuggestItem.forEach((item) => {
                if (item.classList.contains("focused")) {
                  item.classList.remove("focused");
                }
              });
            }
          }, 10);
        }
      } catch (e) {}
    },
    [fetchOptions, metaData.currentPage, queryDebounce]
  );

  const handleNextPage = useCallback(async () => {
    await handleQueryChange(metaData.currentPage + 1, true);
  }, [handleQueryChange, metaData.currentPage]);

  const handleEventChangeQuery = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleFocusInput = useCallback(() => {
    setTimeout(() => {
      const refInput = document.getElementById(uid + "Input");
      refInput?.focus();
    }, 300);
  }, [uid]);

  const handleClose = useCallback(() => {
    version.current = 0;
    setOpen(false);
    setOptions([]);
    setMetaData({ currentPage: 1, totalPage: 0, totalItems: 0 });
    !multiple && setQuery("");
  }, [version]);

  const handleSelect = useCallback(
    (event: any, idSelected: any) => {
      // clearFocus();
      const options = refOptions.current;
      if (multiple) {
        if (value?.some((e: any) => e[uniqueKey] == idSelected)) {
          onChange(value.filter((e: any) => e[uniqueKey] != idSelected));
        } else {
          // eslint-disable-next-line eqeqeq
          const option = options.filter((e: any) => e[uniqueKey] == idSelected)?.[0] as any;
          if (!option) return;
          onChange([...(value || []), option]);
        }
        handleFocusInput();
      } else {
        setQuery("");
        const option = options.find((e: any) =>
          isString(e) || isNumber(e) ? e == idSelected : e[uniqueKey] == idSelected
        ) as any;
        if (!option) return;
        onChange(option);
        handleClose();
      }
    },
    [onChange, multiple, value, handleClose, handleFocusInput]
  );

  const handleBlur = useCallback(
    (event: any) => {
      if (event?.relatedTarget) {
        let relatedTarget = event.relatedTarget as HTMLElement;
        if (document.querySelectorAll(`[data-list="${uid}"]`)?.[0]?.contains(relatedTarget)) {
          return;
        }
      }
      setOpen(false);
      setIsFocused(false);
    },
    [uid]
  );

  const handleKeyDown = useCallback(
    async (event: React.KeyboardEvent<any>) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
          const parentNode = document.querySelector(`[data-list='${uid}']`);
          const itemFocus = parentNode?.querySelector(".focused");
          const listSuggestItem = parentNode?.querySelectorAll(`[data-event='true']`);
          if (listSuggestItem && itemFocus) {
            const sizeItems = listSuggestItem.length;
            for (let i = 0; i < sizeItems; i++) {
              const item = listSuggestItem[i];
              if (item.classList.contains("focused")) {
                item.classList.remove("focused");
                let indexFocus;
                if (event.key === "ArrowDown") {
                  indexFocus = i !== sizeItems - 1 ? i + 1 : 0;
                } else {
                  indexFocus = i !== 0 ? i - 1 : 0;
                }
                listSuggestItem[indexFocus].scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "start",
                });
                listSuggestItem[indexFocus].classList.add("focused");
                break;
              }
            }
          } else if (listSuggestItem && listSuggestItem.length > 0 && event.key === "ArrowDown") {
            listSuggestItem[0].classList.add("focused");
          }
          break;
        case "Enter":
          let tryTime = 1;
          do {
            tryTime++;
            await new Promise((resolve) => setTimeout(resolve, 5));
          } while (isChanging.current && tryTime < 300);
          setTimeout(() => {
            const optionFocus = document.querySelector(`[data-list='${uid}'] .focused`);
            const idFocus = optionFocus?.getAttribute("data-value");
            if (idFocus === "-1") {
              handleClose();
            } else handleSelect({}, idFocus);
          }, 10);
          break;
        default:
          break;
      }
    },
    [uid, query, handleSelect, handleClose]
  );

  const handleClick = useCallback(
    (e) => {
      const isClickBtnRight = document.getElementsByClassName("btn-right")?.[0]?.contains(e.target);
      if (isClickBtnRight) return;
      setOpen((prev) => {
        if (!prev) {
          handleQueryChange(1);
          setIsFocused(true);
        }
        handleFocusInput();
        return true;
      });
    },
    [handleQueryChange, handleFocusInput]
  );

  return (
    <StyledSelectInfinite>
      <label style={{ color: "#212529" }} aria-required className="text-base font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <InputRootContainer disabled={disabled} onClick={handleClick} ref={activatorRef}>
        {!multiple ? (
          <TagList>
            {!!value && <>{isArray(value) ? getOptionLabel(value[0]) : getOptionLabel(value)}</>}
            <div
              onClick={() => onChange(null)}
              className={clsx(
                "btn-right absolute right-0 top-0 bottom-0 flex items-center justify-center w-8 text-[#868e96] z-10",
                {
                  "hover:text-[#045fbb]": !isNil(value),
                }
              )}
            >
              {isNil(value) || value.length === 0 ? <Selector size="16px" /> : <X size="16px" />}
            </div>
          </TagList>
        ) : null}
        {multiple && !!value && value.length > 0 && (
          <TagList>
            {value.map((item, index) =>
              index > limitTag && !isFocused ? null : index === limitTag && !isFocused ? (
                <Button
                  color="dark"
                  variant="white"
                  className="bg-[#F1F3F5] text-[#495057] h-[26px]"
                  key={value.length - index}
                  radius="xs"
                  size="xs"
                  compact
                  uppercase
                >
                  +{value.length - index}
                </Button>
              ) : (
                <Button
                  color="dark"
                  variant="white"
                  className="bg-[#F1F3F5] pl-[16px] text-[#495057] h-[26px] cursor-default max-w-full"
                  key={item[uniqueKey]}
                  radius="xs"
                  size="xs"
                  compact
                  uppercase
                  rightIcon={
                    <div className="cursor-pointer" onClick={() => handleSelect(null, item[uniqueKey])}>
                      <Icon name="close" />
                    </div>
                  }
                >
                  {getOptionLabel(item)}
                </Button>
              )
            )}
          </TagList>
        )}
        <Fieldset focused={open} disabled={disabled} error={error} />
      </InputRootContainer>
      <Popover
        open={open}
        onClose={handleClose}
        reference={activatorRef}
        placement={placement}
        width={`${activatorRef.current?.clientWidth || 400}px`}
        data-list={uid}
      >
        <Input
          autoComplete={"off"}
          value={query}
          onChange={handleEventChangeQuery}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          id={uid + "Input"}
        />
        {options.length > 0 ? (
          <ListItem ref={containerListItemRef}>
            <InfiniteScroll
              dataLength={options.length}
              next={handleNextPage}
              hasMore={metaData.currentPage < metaData.totalPage - 1}
              loader={<div className="flex items-center justify-center p-y-2">{/*<CircularProgress />*/}Loading</div>}
              height={"auto"}
              style={{ maxHeight: "300px", overflow: "hidden auto" }}
              className="InfiniteScroll-ListItem"
            >
              {options.map((item) => (
                <SelectItem
                  checkbox={multiple}
                  selected={isSelected(item)}
                  onSelect={handleSelect}
                  value={isString(item) || isNumber(item) ? item : item[uniqueKey]}
                  key={isString(item) || isNumber(item) ? item : item[uniqueKey]}
                >
                  {getOptionLabel(item)}
                </SelectItem>
              ))}
            </InfiniteScroll>
          </ListItem>
        ) : (
          <Text className="px-6 text-gray-secondary">{t("No results found")}</Text>
        )}
      </Popover>
      <HelperText error={error}>{helperText}</HelperText>
    </StyledSelectInfinite>
  );
});
SelectInfinite.displayName = "SelectInfinite";
export default memo(SelectInfinite);

const HelperText = styled.p<{ error?: boolean }>`
  margin: 0;
  padding: 4px 12px 0;
  color: #fa5252;
`;

const ListItem = styled.div`
  .InfiniteScroll-ListItem {
    padding: 0 4px;
    box-sizing: border-box;
  }
`;

const Input = styled.input`
  resize: none;
  background: #fff;
  box-sizing: border-box;
  padding: 10px 12px;
  width: 100%;
  border: none;
  min-height: 40px;
  max-height: 60px;

  &:focus-visible {
    outline: none;
  }

  &::placeholder {
    font-size: 0.85rem;
  }
`;

const TagList = styled.div`
  padding: 8px 12px 6px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  min-height: 40px;
  max-height: 174px; //134-40
  position: relative;
  overflow: hidden auto;
`;

const InputRootContainer = styled.div<any>`
  position: relative;
  min-height: 42px;
  max-height: 214px;
  cursor: pointer;
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  background: ${({ disabled }) => (disabled ? "#F7F8F9" : "transparent")};
`;

const StyledSelectInfinite = styled.div`
  width: 100%;
  position: relative;
`;
