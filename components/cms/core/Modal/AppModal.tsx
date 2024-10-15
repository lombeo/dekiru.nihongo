import { Modal as MantineModal, ModalProps } from "@mantine/core"
import styles from "./AppModal.module.css"

export interface AppModalProps extends ModalProps {
    modalSize? : 'xs'|'sm'|'md'|'lg'|'xl',
}

export const Modal = (props: AppModalProps) => {
    const {modalSize, ...rest} = props;
    let defaultClasses:any
    if(!props.size){
        defaultClasses= {
            modal: styles.modal + ' '+ (modalSize?styles[modalSize]:""),
            title: styles.title,
            header:styles.header,
            body:styles.body,
        }
    }
    return <MantineModal {...rest} classNames={defaultClasses} />
}