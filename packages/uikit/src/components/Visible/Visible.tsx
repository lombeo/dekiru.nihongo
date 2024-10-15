import React from 'react'

interface VisibleProps {
  visible?: any
  rules?: any
  ruleOperation?: 'or' | 'and'
  children: any
  ruleOnly?: boolean
}
const Visible = (props: VisibleProps) => {
  // const { roles } = useProfileContext()

  const {
    visible = true,
    rules,
    children,
    ruleOperation = 'or',
    // ruleOnly = false,
  } = props

  if (!visible) return <></>
  if (!rules) return <>{children}</>
  // if (roles?.includes('admin') && !ruleOnly) {
  //   return <>{children}</>
  // }

  const getValid = () => {
    if (!Array.isArray(rules)) {
      return rules
    }
    if (ruleOperation == 'or') {
      const foundTrue = rules.find((x: boolean) => x == true)
      if (foundTrue) {
        return true
      } else {
        return false
      }
    }

    if (ruleOperation == 'and') {
      for (const x of rules) {
        if (x == false) {
          return false
        }
      }
    }
    return true
  }

  if (!getValid()) {
    return null
  }

  return <>{children}</>
}

export default Visible
