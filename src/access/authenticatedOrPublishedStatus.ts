import type { Access } from 'payload'

/** Public read only when `status` is published; admins see all. */
export const authenticatedOrPublishedStatus: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}
