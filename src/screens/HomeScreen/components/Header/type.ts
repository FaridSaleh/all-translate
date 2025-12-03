export interface HeaderProps {
  title?: string
  headerLeft?: 'default' | 'conversationView' | 'none'
  headerRight?: 'default' | 'close'
}

export interface HeaderLeftProps {
  headerLeft: HeaderProps['headerLeft']
  isFree: boolean
}

export interface HeaderRightProps {
  headerRight: HeaderProps['headerRight']
}
