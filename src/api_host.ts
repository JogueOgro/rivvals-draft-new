export const apiHost =
  process.env.NODE_ENV === 'development'
    ? 'localhost:5000'
    : process.env.NEXT_PUBLIC_API_HOST
