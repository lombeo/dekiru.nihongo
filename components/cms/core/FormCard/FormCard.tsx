import { Card } from "@mantine/core";
import { PropsWithChildren } from "react";

interface RowProps {
  spacing?: number;
  children: any;
}

interface FormCardProps {
  label?: any;
}

const Row = (props: PropsWithChildren<RowProps>) => {
  const { spacing, children } = props;
  return <div className={`px-5 py-4 relative min-h-fit space-y-${spacing}`}>{children}</div>;
};

const FormCard = (props: PropsWithChildren<FormCardProps & any>) => {
  const { label } = props;
  return (
    <div>
      <div className="font-semibold">{label}</div>
      <Card {...props}>
        <div className="divide-y ">{props.children}</div>
      </Card>
    </div>
  );
};

FormCard.Row = Row;

export default FormCard;
