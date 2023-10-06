import React, { forwardRef, useEffect, useState } from "react";
import "./DatePicker.scss";
import { ErrorMessage, Field } from "formik";
import CalendarIcon from "../../assets/calendarIcon.svg";
import Modal from "../Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const DatePickerModal = ({
  isOpen,
  setIsOpen,
  handleSafe,
  defaultDate = "",
  endDatePicker = false,
  minDate,
  ...rest
}) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    setDate(
      defaultDate ? new Date(defaultDate) : endDatePicker ? null : new Date()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate]);

  const currentDayOfWeek = moment().day();
  const nextMonday = moment().add((8 - currentDayOfWeek) % 7, "days");
  const nextTuesday = moment().add((9 - currentDayOfWeek) % 7, "days");
  const nextWeek = moment().add(7, "days");

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="datePickerModal">
        <div className="datePickerModal_buttons">
          <button
            className={`${
              moment(date).isSame(moment(), "day")
                ? "datePickerModal_buttonActive"
                : ""
            }`}
            onClick={() => setDate(new Date())}
            disabled={minDate ? moment(minDate).isAfter(moment()) : false}
          >
            Today
          </button>
          {!endDatePicker ? (
            <>
              <button
                className={`${
                  moment(date).isSame(nextMonday, "day")
                    ? "datePickerModal_buttonActive"
                    : ""
                }`}
                onClick={() => setDate(new Date(nextMonday))}
              >
                Next Monday
              </button>
              <button
                className={`${
                  moment(date).isSame(nextTuesday, "day")
                    ? "datePickerModal_buttonActive"
                    : ""
                }`}
                onClick={() => setDate(new Date(nextTuesday))}
              >
                Next Tuesday
              </button>
              <button
                className={`${
                  moment(date).isSame(nextWeek, "day")
                    ? "datePickerModal_buttonActive"
                    : ""
                }`}
                onClick={() => setDate(new Date(nextWeek))}
              >
                After 1 week
              </button>
            </>
          ) : (
            <button
              className={`${!date ? "datePickerModal_buttonActive" : ""}`}
              onClick={() => setDate(null)}
            >
              No Date
            </button>
          )}
        </div>
        <DatePicker
          selected={date}
          dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
          onChange={(d) => setDate(d)}
          inline
          minDate={minDate}
          {...rest}
        />
        <div className="datePickerModal_footer">
          <div className="datePickerModal_footerDate">
            <img src={CalendarIcon} alt="calendar" />
            <span>
              {date
                ? moment(date).utc().local().format("DD MMM yyyy")
                : "No Date"}
            </span>
          </div>
          <div className="datePickerModal_footerBtns">
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={() => handleSafe(date.toUTCString())}>Save</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const DatePickerComponent = forwardRef(
  (
    {
      id,
      label,
      name,
      touched,
      containerClass = "",
      error,
      type = "text",
      setFieldValue,
      fieldValue,
      minDate = null,
      endDatePicker = false,
      onDateChange = () => {},
      ...rest
    },
    ref
  ) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSafe = (value) => {
      setFieldValue(name, value);
      setModalOpen(false);
      onDateChange();
    };

    return (
      <>
        <DatePickerModal
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          handleSafe={handleSafe}
          defaultDate={fieldValue}
          minDate={minDate ? new Date(minDate) : null}
          endDatePicker={endDatePicker}
        />
        <div className={`datePicker ${containerClass} `}>
          {label && <label htmlFor={id}>{label}</label>}
          <div className="datePicker_inputWrapper">
            <img src={CalendarIcon} alt="icon" className="datePicker_icon" />
            <Field
              name={name}
              ref={ref}
              type={type}
              id={id}
              className={error && touched[id] ? "datePicker_error" : null}
              {...rest}
              value={
                fieldValue
                  ? moment(fieldValue).isSame(moment(), "day")
                    ? "Today"
                    : moment(fieldValue).utc().local().format("DD MMM yyyy")
                  : ""
              }
              onChange={null}
              onClick={() => setModalOpen(true)}
              readOnly={true}
            />
          </div>
          <ErrorMessage name={name} component="span" className="error" />
        </div>
      </>
    );
  }
);

export default DatePickerComponent;
