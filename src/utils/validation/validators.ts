export const requiredValidator = (errorText: string) => (value: string) => {
  value = typeof value === "string" ? value.trim() : value;
  return value ? null : errorText;
};

export const passwordValidator = (errorText: string) => (value: string) => {
  value = typeof value === "string" ? value.trim() : value;
  const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/; // >= 8characters, 1 upper letter, 1 lower letter, number, special character
  return pattern.test(value) ? null : errorText;
}

export const atLeastOneLetter = (errorText: string) => (value: string) => {
  value = typeof value === "string" ? value.trim() : value;

  const pattern = /^[^a-zA-Z]*$/;
  const containsLetter = /[a-zA-Z]/.test(value);

  if (pattern.test(value) || !containsLetter) {
    return errorText;
  }

  return null;
};
