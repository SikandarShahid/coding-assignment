import React, { useEffect, useRef, useState } from "react";
import "./AddEmployee.scss";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import TextInput from "../../components/TextInput";
import DatePicker from "../../components/DatePicker";
import Dropdown from "../../components/Dropdown";
import PersonIcon from "../../assets/personIcon.svg";
import BreifcaseIcon from "../../assets/breifcaseIcon.svg";
import RightArrow from "../../assets/right-arrow.svg";
import useIndexedDB from "../../hooks/useIndexedDB";
import Loader from "../../components/Loader";

const initialValues = {
  name: "",
  role: "",
  startDate: "",
  endDate: "",
};

const Schema = Yup.object().shape({
  name: Yup.string().required("Employee name is required"),
  role: Yup.string().required("Employee Role is required."),
  startDate: Yup.string().required("Start Date is required."),
});

const AddEmployee = () => {
  const formikRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();
  const { addRecord, getRecord, deleteRecord, updateRecord } = useIndexedDB(
    "Employee",
    "EmployeeList"
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formikRef.current && !id) {
      formikRef.current.setFieldValue("startDate", new Date().toUTCString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikRef.current]);

  useEffect(() => {
    if (id) {
      loadRecord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikRef.current]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      const res = await getRecord(parseInt(id));
      formikRef.current.setValues(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (id) {
        await updateRecord(values);
      } else {
        await addRecord(values);
      }
      navigate("/");
    } catch (err) {
      console.log("err", err);
    }
  };

  const onFromDateChange = () => {
    const values = formikRef.current?.values;
    if (
      values["endDate"] &&
      moment(values["endDate"]).utc().isAfter(moment(values["startDate"]).utc())
    ) {
      formikRef.current.setFieldValue("endDate", null);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecord(parseInt(id));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar
        isDelete={id}
        handleDelete={handleDelete}
        title={id ? "Edit Employee Details" : "Add Employee Details"}
      />
      <div className="addEmployee">
        <Formik
          initialValues={initialValues}
          validationSchema={Schema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          innerRef={formikRef}
        >
          {(formik) => {
            const { errors, touched } = formik;
            return loading ? (
              <Loader />
            ) : (
              <Form className="container">
                <div className="addEmployee_inputs">
                  <TextInput
                    placeholder="Employee name"
                    icon={PersonIcon}
                    id="name"
                    name="name"
                    touched={touched}
                    error={errors.name}
                  />
                  <Dropdown
                    placeholder="Select role"
                    icon={BreifcaseIcon}
                    id="role"
                    name="role"
                    touched={touched}
                    error={errors.role}
                    setFieldValue={formikRef.current?.setFieldValue}
                    fieldValue={formikRef.current?.values["role"]}
                    options={[
                      {
                        label: "Product Designer",
                        value: "Product Designer",
                      },
                      {
                        label: "Flutter Developer",
                        value: "Flutter Developer",
                      },
                      {
                        label: "QA Tester",
                        value: "QA Tester",
                      },
                      {
                        label: "Product Owner",
                        value: "Product Owner",
                      },
                    ]}
                  />
                  <div className="addEmployee_datePickers">
                    <DatePicker
                      placeholder="From"
                      id="startDate"
                      name="startDate"
                      touched={touched}
                      error={errors.startDate}
                      setFieldValue={formikRef.current?.setFieldValue}
                      fieldValue={formikRef.current?.values["startDate"]}
                      onDateChange={onFromDateChange}
                      autoComplete="off"
                    />
                    <img src={RightArrow} alt="right-arrow" />
                    <DatePicker
                      placeholder="No Date"
                      id="endDate"
                      name="endDate"
                      touched={touched}
                      error={errors.endDate}
                      setFieldValue={formikRef.current?.setFieldValue}
                      fieldValue={formikRef.current?.values["endDate"]}
                      minDate={formikRef.current?.values["startDate"]}
                      endDatePicker
                    />
                  </div>
                </div>
                <footer>
                  <button type="button" onClick={() => navigate("/")}>
                    {" "}
                    Cancel
                  </button>
                  <button type="submit"> Save</button>
                </footer>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default AddEmployee;
