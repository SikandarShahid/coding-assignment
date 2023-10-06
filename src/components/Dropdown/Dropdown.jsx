import React, { forwardRef, useEffect, useState } from "react";
import "./Dropdown.scss";
import { ErrorMessage, Field } from "formik";
import Modal from "../Modal";
import ArrowDownIcon from "../../assets/arrow-down.svg";
import { v4 } from "uuid";

const DropdownModal = ({
  isOpen,
  setIsOpen,
  options = [],
  handleOptionClick,
  fieldValue,
}) => {
  return (
    <Modal
      className="dropdownModalContainer"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      ariaHideApp={false}
    >
      <div className="dropdownModal">
        <div className="dropdownModal_options">
          {options.map((o) => (
            <div
              onClick={() => handleOptionClick(o.value)}
              className={`dropdownModal_option ${
                fieldValue === o.value ? "dropdownModal_optionActive" : ""
              }`}
              key={o.id}
            >
              {o.label}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

const Dropdown = forwardRef(
  (
    {
      id,
      label,
      name,
      touched,
      containerClass = "",
      error,
      type = "text",
      icon = null,
      options = [],
      setFieldValue,
      fieldValue,
      ...rest
    },
    ref
  ) => {
    const [updatedOptions, setUpdatedOptions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
      const tempOptions = options.map((d) => ({ ...d, id: v4() }));
      setUpdatedOptions(tempOptions);
    }, []);

    const handleOptionClick = (value) => {
      setFieldValue(name, value);
      setModalOpen(false);
    };

    return (
      <>
        <DropdownModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          options={updatedOptions}
          handleOptionClick={handleOptionClick}
          fieldValue={fieldValue}
        />
        <div className={`dropdown ${containerClass} `}>
          {label && <label htmlFor={id}>{label}</label>}
          <div
            className="dropdown_inputWrapper"
            onClick={() => setModalOpen(true)}
          >
            {icon && <img src={icon} alt="icon" className="dropdown_icon" />}
            <img
              src={ArrowDownIcon}
              alt="arrow-down"
              className="dropdown_arrow"
            />
            <Field
              name={name}
              ref={ref}
              type={type}
              id={id}
              className={error && touched[id] ? "dropdown_error" : null}
              style={icon ? { paddingLeft: "2.5rem" } : {}}
              {...rest}
              value={fieldValue}
              onChange={null}
            />
          </div>
          <ErrorMessage name={name} component="span" className="error" />
        </div>
      </>
    );
  }
);

export default Dropdown;
