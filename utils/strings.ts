export const areStringsEqualCaseInsensitive = (str1: string, str2: string) => {
  if (
    !str1 ||
    !str2 ||
    str1.length !== str2.length ||
    typeof str1 !== "string" ||
    typeof str2 !== "string"
  ) {
    return false;
  }

  return str1.toLowerCase() === str2.toLowerCase();
};
