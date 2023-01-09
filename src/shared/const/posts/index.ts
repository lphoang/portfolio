import { GetPosts, PostType } from '../../types'

export const DEFAULT_POSTS_VALUE: GetPosts = {
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0
}

export const DEFAULT_POST_VALUE: PostType = {
    id: '',
    title: '',
    body: '',
    thumbnail: {
        url: '',
        width: 0,
        height: 0
    },
    description: ''
}
