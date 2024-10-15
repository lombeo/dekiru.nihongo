import { Tabs } from '@mantine/core'
import { SaolaOptionProps } from '@edn/types/base'
import React from 'react'
import { useTranslation } from "next-i18next";

interface ActivityStatusMenuProps {
  data: SaolaOptionProps[]
  onChange?: any
  active?: any
}

const ActivityStatusMenu = (props: ActivityStatusMenuProps) => {
  const { t } = useTranslation();
  const { data, active, onChange } = props

  const onChangeTab = (index: any) => {
    onChange && onChange(data[index].value)
  }

  const current = data.findIndex((x: any) => x.value == active)
  const tabIndex = current > -1 ? current : 0
  {/*fixtab*/ }
  const Label = ({ tab }: any) => {
    if (tab.value == tabIndex) {
      return <span>{t(tab.label)}</span>
    }
    return <span>{t(tab.label)}</span>
  }
  return (
    <Tabs
      // className="mt-5 bg-white"
      value={tabIndex.toString()}
      onTabChange={onChangeTab}
    >
      <Tabs.List>
        {data.map((x: any) => (
          <Tabs.Tab className='mr-4 pt-3 pb-3 text-base' key={x.value} value={x.value}><Label tab={x} /></Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  )
}

export default ActivityStatusMenu
