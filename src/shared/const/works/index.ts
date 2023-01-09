import { GetWorks, WorkType } from '../../types'

export const DEFAULT_WORKS_VALUE: GetWorks = {
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0
}

export const DEFAULT_WORK_VALUE: WorkType = {
  id: '',
  title: '',
  description: '',
  platform: '',
  stack: '',
  firstThumbnail: {
    url: '',
    width: 0,
    height: 0
  },
  secondThumbnail: {
    url: '',
    width: 0,
    height: 0
  }
}
