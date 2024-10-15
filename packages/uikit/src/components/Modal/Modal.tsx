import React from "react";
import { Modal as ModalMantine, ModalProps } from "@mantine/core";

export interface AppModalProps extends ModalProps {
  footer?: any;
}
const Modal = (props: AppModalProps) => {
  const { footer, children, classNames } = props;
  if (footer) {
    return (
      <>
        <ModalMantine
          {...props}
          classNames={{
            header: "px-7 pt-5",
            content: "p-0",
            root: "z-[300]",
            ...classNames,
          }}
        >
          <div className="px-7">{children}</div>
          <div className="p-6 mt-4 border-t border-gray-600 bg-theme-lighter-alt">{footer}</div>
        </ModalMantine>
      </>
    );
  }
  return (
    <>
      <ModalMantine
        {...props}
        classNames={{
          root: "z-[400]",
          ...classNames,
        }}
      />
    </>
  );
};

export default Modal;
