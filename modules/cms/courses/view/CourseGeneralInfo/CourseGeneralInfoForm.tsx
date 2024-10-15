import { MultiSelect, Select, TextInput } from "components/cms";
import { useState } from "react";

interface CourseGeneralInfoFormProps {
  formManager: any;
  catagorySelections: any[];
  languageSelections: any[];
  tagSelections: string[];
}

export const CourseGeneralInfoForm = ({
  formManager,
  catagorySelections,
  languageSelections,
  tagSelections,
}: CourseGeneralInfoFormProps) => {
  const [tags, setTags] = useState<any>([]);

  return (
    <>
      <TextInput
        onChange={(event) => formManager.setFieldValue("title", event.currentTarget.value)}
        error={formManager.errors.title && "Please specify valid title"}
        value={formManager.values.title}
        placeholder="Course name"
        classNames={{
          input: "h-12 rounded text-2xl ",
        }}
      />

      <div className="grid grid-cols-2 gap-7 mt-4">
        <div className="col-span-1">
          <div>
            <Select
              onChange={(event) => formManager.setFieldValue("categoryId", parseInt(event!))}
              error={formManager.errors.categoryId && "Please specify category"}
              value={formManager.values.categoryId.toString()}
              placeholder="Select Category"
              classNames={{
                input: "h-12 rounded",
              }}
              data={catagorySelections}
            />
          </div>
        </div>
        <div className="col-span-1">
          <div>
            <Select
              error={formManager.errors.languageId && "Please specify language"}
              onChange={(event) => formManager.setFieldValue("languageId", parseInt(event!))}
              value={formManager.values.languageId.toString()}
              classNames={{
                input: "h-12 rounded",
              }}
              placeholder="Status"
              data={languageSelections}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 ">
        <MultiSelect
          data={tags}
          value={tagSelections}
          placeholder="Enter tags"
          onChange={(event: any) => formManager.setFieldValue("tags", event)}
          classNames={{
            input: "h-12 rounded overflow-auto",
            dropdown: "hidden min-h-12",
            values: "pt-2",
            value: "h-6 rounded",
          }}
          searchable
          creatable
          getCreateLabel={(query: any) => `+ Create ${query}`}
          onCreate={(query: any) => {
            setTags((current: any) => [...current, query]);
            return query;
          }}
        />
      </div>
    </>
  );
};
