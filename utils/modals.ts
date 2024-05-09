export const isClerkModalOpen = () => {
  return document.getElementsByClassName("cl-modalBackdrop").length > 0;
};

export const isRadixModalOpen = () => {
  return document.getElementsByClassName("radix-modalBackdrop").length > 0;
};
