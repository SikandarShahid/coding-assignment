import React, { forwardRef } from "react";
import "./TextInput.scss";
import { Field, ErrorMessage } from "formik";

const TextInput = forwardRef(
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
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`textInput ${containerClass} `}>
        {label && <label htmlFor={id}>{label}</label>}
        <div className="textInput_inputWrapper">
          {icon && <img src={icon} alt="icon" />}
          <Field
            name={name}
            ref={ref}
            type={type}
            id={id}
            className={error && touched[id] ? "textInput_error" : null}
            style={icon ? { paddingLeft: "2.5rem" } : {}}
            {...rest}
          />
        </div>
        <ErrorMessage name={name} component="span" className="error" />
      </div>
    );
  }
);

export default TextInput;
