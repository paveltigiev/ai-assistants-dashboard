export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'init':
      return 'secondary'
    case 'active':
      return 'default'
    case 'blocked':
      return 'destructive'
    default:
      return 'default'
  }
}

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'init':
      return 'Новый'
    case 'active':
      return 'Активный'
    case 'blocked':
      return 'Заблокирован'
    default:
      return status
  }
}