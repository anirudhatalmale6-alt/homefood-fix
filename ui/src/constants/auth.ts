/** Match server `PASSWORD_REGEX` (homefood-server validation). */
export const PASSWORD_HINT =
  '8–64 characters with uppercase, lowercase, number, and a special character.'

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/
