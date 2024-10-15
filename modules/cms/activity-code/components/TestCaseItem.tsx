/*
 * Test case item
 * Input data: codeType, data = test case item data, onDelete, index, errors
 */
import { Collapse, Textarea, TextInput } from "@mantine/core";
import { AppIcon } from "@src/components/cms/core/Icons";
import { Button } from "components/cms";
import { Visible } from "components/cms/core/Visible";
import { ActivityCodeTypeEnum } from "constants/cms/activity-code/activity-code.constant";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

export const TestCaseItem = (props: any) => {
  const { codeType, data, onDelete, onEditTestCase, register, idx, errors, remove, disabled } = props;
  const [opened, setOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const { executeLimitTime } = data;
    setOpen(executeLimitTime == 0 ?? false);
  }, [data]);

  return (
    <div key={idx} className="border rounded-md shadow mb-4">
      <div className="flex gap-2 items-center text-sm p-3 cursor-pointer bg-[#eff6fc] rounded-md">
        <div className="flex-grow flex text-blue-500" onClick={() => setOpen(!opened)}>
          <AppIcon className="pt-1 text-blue-500" name={opened ? "chevron_up" : "chevron_down"} size="sm" />
          <span className="test-case-name ml-2 font-semibold">
            {t("Test case")} {idx + 1}{" "}
          </span>
        </div>
        {!disabled && (
          <div>
            {codeType == ActivityCodeTypeEnum.Code || codeType == ActivityCodeTypeEnum.Scratch ? (
              <Button
                className="mr-4"
                size="xs"
                preset="primary"
                color="cyan"
                isSquare={true}
                onClick={() => onEditTestCase(idx)}
              >
                <AppIcon name="edit" size="sm" />
              </Button>
            ) : (
              ""
            )}
            <Button
              disabled={disabled}
              size="xs"
              preset="primary"
              color="red"
              isSquare={true}
              onClick={() => remove(idx)}
            >
              <AppIcon name="delete" size="sm" />
            </Button>
          </div>
        )}
      </div>
      <Collapse in={opened} className="p-4">
        <Visible visible={codeType != ActivityCodeTypeEnum.OOP}>
          {codeType == ActivityCodeTypeEnum.Code || codeType == ActivityCodeTypeEnum.Scratch ? (
            <div>
              <div className="mb-2">
                <Textarea
                  styles={{ input: { overflowX: "hidden" } }}
                  readOnly
                  size="sm"
                  minRows={4}
                  label={t("Input")}
                  required
                  value={
                    data.input
                      ? data.input
                          .split(";#")
                          .map((item: any, index: number) => `agr ${index}: ${item}`)
                          .join("\n")
                      : null
                  }
                />
              </div>
              <div className="mb-2">
                <Textarea
                  styles={{ input: { overflowX: "hidden" } }}
                  readOnly
                  error={t(errors.listTestCase && (errors.listTestCase[idx]?.output?.message as any))}
                  size="sm"
                  label={t("Output")}
                  required
                  value={data.output}
                />
              </div>
              <div className="mb-2">
                <TextInput
                  readOnly
                  error={t(errors.listTestCase && (errors.listTestCase[idx]?.executeLimitTime?.message as any))}
                  size="sm"
                  min={0.1}
                  defaultValue={0}
                  step={0.1}
                  type="number"
                  required
                  label={t("Time limit (seconds)")}
                  {...register(`listTestCase.${idx}.executeLimitTime`)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
          {codeType == ActivityCodeTypeEnum.SQL ? (
            <div>
              <div className="mb-2">
                <Textarea
                  styles={{ input: { overflowX: "hidden" } }}
                  error={t(errors.listTestCase && (errors.listTestCase[idx]?.input?.message as any))}
                  size="sm"
                  label={t("Input")}
                  required
                  {...register(`listTestCase.${idx}.input`)}
                  readOnly={disabled}
                />
              </div>
              <div className="mb-2">
                <Textarea
                  styles={{ input: { overflowX: "hidden" } }}
                  error={t(errors.listTestCase && (errors.listTestCase[idx]?.output?.message as any))}
                  size="sm"
                  label={t("Output")}
                  required
                  {...register(`listTestCase.${idx}.output`)}
                  readOnly={disabled}
                />
              </div>
              <div className="mb-2">
                <TextInput
                  error={t(errors.listTestCase && (errors.listTestCase[idx]?.executeLimitTime?.message as any))}
                  size="sm"
                  min={0.1}
                  defaultValue={0.1}
                  step={0.1}
                  type="number"
                  required
                  label={t("Time limit (seconds)")}
                  {...register(`listTestCase.${idx}.executeLimitTime`)}
                  readOnly={disabled}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </Visible>
        <Visible visible={codeType == ActivityCodeTypeEnum.OOP}>
          <div className="mb-2">
            <TextInput
              error={t(errors.listTestCase && (errors.listTestCase[idx]?.title?.message as any))}
              size="sm"
              label={t("Title")}
              required
              {...register(`listTestCase.${idx}.title`)}
              readOnly={disabled}
            />
          </div>
          <div className="mb-2">
            <Textarea
              styles={{ input: { overflowX: "hidden" } }}
              error={t(errors.listTestCase && (errors.listTestCase[idx]?.content?.message as any))}
              size="sm"
              autosize
              minRows={4}
              maxRows={4}
              label={t("Test content")}
              required
              {...register(`listTestCase.${idx}.content`)}
              readOnly={disabled}
            />
          </div>
          <div className="mb-2">
            <TextInput
              error={t(errors.listTestCase && (errors.listTestCase[idx]?.output?.message as any))}
              size="sm"
              required
              label={t("Expected output")}
              {...register(`listTestCase.${idx}.output`)}
              readOnly={disabled}
            />
          </div>
          <TextInput
            error={t(errors.listTestCase && (errors.listTestCase[idx]?.errorMessage?.message as any))}
            size="sm"
            label={t("Error message")}
            {...register(`listTestCase.${idx}.errorMessage`)}
            readOnly={disabled}
          />
        </Visible>
      </Collapse>
    </div>
  );
};
