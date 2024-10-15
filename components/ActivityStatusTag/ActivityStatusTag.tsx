import { Badge } from '@edn/components';
import { useTranslation } from "next-i18next";

interface ActivityStatusTagProps {
  label?: string
  children?: any
}
const ActivityStatusTag = (props: ActivityStatusTagProps) => {
  const { label } = props
  const { t } = useTranslation();
  return (
    <Badge
      variant="filled"
      className="border-1 border-white py-3"
    >
      {label ? label : t("Ongoing")}

    </Badge>
  )
}

export default ActivityStatusTag
