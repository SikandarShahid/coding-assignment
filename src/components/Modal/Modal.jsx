import React, { useEffect } from "react";
import ReactModal from "react-modal";

const Modal = ({ isOpen, setIsOpen, children, ...rest }) => {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => (document.body.style.overflow = "hidden"), 200);
    } else {
      document.body.style.overflow = "unset";
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);
  return (
    <ReactModal
      closeTimeoutMS={200}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      shouldCloseOnOverlayClick={true}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: "100",
        },
        content: {
          position: "absolute",
          top: "50%",
          left: "50%",
          right: "unset",
          bottom: "unset",
          border: "none",
          transform: "translate(-50%, -50%)",
          backgroundColor: "transparent",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "0",
        },
      }}
      {...rest}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
