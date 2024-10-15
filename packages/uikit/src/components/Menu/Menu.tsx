import { Menu as MenuMantine, MenuProps } from '@mantine/core'
import React from 'react'

const Menu = (props: MenuProps) => {

  return <MenuMantine {...props} classNames={{
    label: 'your-label-class',
    item: 'py-1',
    itemIcon: 'your-itemIcon-class',
    itemLabel: 'py-1',
    arrow: 'your-arrow-class',
  }} />
}

Menu.Item = MenuMantine.Item
Menu.Label = MenuMantine.Label
export default Menu
