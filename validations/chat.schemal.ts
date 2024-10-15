import yup from './yupGlobal'

export const RoomChatSchema = yup.object({
    name: (yup.string() as any).trim().hasHtmlTag("Group name cannot be blank and does not include html.").required("Group name cannot be blank and does not include html.").max(256, "Group name cannot exceed 256 characters"),
})
