import { SaolaSize } from '@edn/types/base'
import {
  Tabs as TabsMantine,
  TabsProps as MantineTabsProps,
} from '@mantine/core'

export interface TabsProps extends MantineTabsProps {
  size?: SaolaSize
  weight?: string
}
const Tabs = (props: TabsProps) => {
  const { size, weight } = props
  const fontString = size ? `text-${size}` : ''
  const weightString = weight ? `font-${weight}` : ''
  const classString = [fontString, weightString].filter((x) => x).join(' ')
  return (
    <TabsMantine
      classNames={{
        tab: 'hover:text-blue-hover',
        tabLabel: classString,
      }}
      // styles={(theme) => ({
      //   tabControl: {
      //     fontSize: theme.fontSizes.md,
      //     padding: `0`,
      //     marginRight: '30px',
      //     color: `var(--color-primary-text)`,
      //     '&:last-of-type': {
      //       marginRight: '0',
      //     },
      //   },
      // })}
      {...props}
    />
  )
}

Tabs.Tab = TabsMantine.Tab
export default Tabs
