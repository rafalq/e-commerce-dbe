export const patterns = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: {
    noSpace: /^\S*$/,
    digit: /^(?=.*[0-9]).*$/,
    lowercase: /^(?=.*[a-z]).*$/,
    uppercase: /^(?=.*[A-Z]).*$/,
    symbol: /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/,
    length: /^.{4,12}$/,
  },
};
