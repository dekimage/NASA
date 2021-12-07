import { useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function openModal() {
    setIsShowing(true);
  }

  function closeModal() {
    setIsShowing(false);
  }

  return {
    isShowing,
    openModal,
    closeModal,
  };
};

export default useModal;
