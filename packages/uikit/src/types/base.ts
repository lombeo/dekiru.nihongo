export type SaolaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SaolaNumberSize = SaolaSize | number
export type SaolaSizes = Record<SaolaSize, number>
export type SaolaPosition =
  | 'static'
  | 'fixed'
  | 'absolute'
  | 'relative'
  | 'sticky'

export type SaolaBackgroundSize = 'auto' | 'cover' | 'contain'
export type SaolaBackgroundPosition =
  | 'bottom'
  | 'center'
  | 'left'
  | 'left-bottom'
  | 'left-top'
  | 'bg-right'
  | 'bg-right-bottom'
  | 'bg-right-top'
  | 'bg-top'

export type SaolaBorderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type SaolaBorderRadius = SaolaBorderSize | 'full' | 'none'

export type SaolaBorderStyle =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'hidden'
  | 'none'

export interface SaolaBreakpointProps {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export interface SaolaBaseProps {
  className?: string
}

export interface SaolaSpaceProps {
  m?: number
  mt?: number
  mr?: number
  mb?: number
  ml?: number
  mx?: number
  my?: number
  p?: number
  pt?: number
  pr?: number
  pb?: number
  pl?: number
  px?: number
  py?: number
}

export interface SaolaColorProps {
  color?: string
  bg?: string
}

export interface SaolaTypographyProps {
  fontSize?: SaolaSize | number

  fontWeight?: string
}

export interface SaolaPositionProps {
  position?: SaolaPosition
  zIndex?: number
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface SaolaBorderProps {
  border?: SaolaBorderSize
  borderWidth?: number
  borderStyle?: SaolaBorderStyle
  borderColor?: string
  borderRadius?: SaolaBorderRadius
  borderTop?: number
  borderTopWidth?: number
  borderTopStyle?: SaolaBorderStyle
  borderTopColor?: string
  borderTopLeftRadius?: SaolaBorderRadius
  borderTopRightRadius?: SaolaBorderRadius
  borderRight?: number
  borderRightWidth?: number
  borderRightStyle?: SaolaBorderStyle
  borderRightColor?: string
  borderBottom?: number
  borderBottomWidth?: number
  borderBottomStyle?: SaolaBorderStyle
  borderBottomColor?: string
  borderBottomLeftRadius?: SaolaBorderRadius
  borderBottomRightRadius?: SaolaBorderRadius
  borderLeft?: number
  borderLeftWidth?: number
  borderLeftStyle?: SaolaBorderStyle
  borderLeftColor?: string
  borderX?: string
  borderY?: string
}

export interface SaolaBackgroundProps {
  backgroundImage?: string
  backgroundSize?: SaolaBackgroundSize
}

export interface SaolaOptionProps {
  label: string
  value: string | number
}
