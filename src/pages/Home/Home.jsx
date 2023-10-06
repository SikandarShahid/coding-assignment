import React, { useEffect, useState } from "react";
import "./Home.scss";
import moment from "moment";
import Navbar from "../../components/Navbar";
import NoDataAvatar from "../../assets/NoDataAvatar.png";
import PlusIcon from "../../assets/PlusIcon.svg";
import { useNavigate } from "react-router-dom";
import useIndexedDB from "../../hooks/useIndexedDB";
import Loader from "../../components/Loader";
import SwipeableItem from "../../components/SwipeableItem";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getAllRecords, deleteRecord } = useIndexedDB(
    "Employee",
    "EmployeeList"
  );

  useEffect(() => {
    loadAllRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllRecords = async () => {
    try {
      const res = await getAllRecords();
      setData(res);
      setLoading(false);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecord(parseInt(id));
      const tempData = [...data];
      setData(tempData.filter((d) => d.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar title="Employee List" />
      <div className="home">
        <div className="container">
          {loading && <Loader />}
          {!loading &&
            (data?.length > 0 ? (
              <>
                <div className="home_main">
                  {data.filter((d) => !d.endDate).length > 0 && (
                    <div className="home_employeeList">
                      <div className="home_employeeListHeader">
                        Current employees
                      </div>
                      {data.map(
                        (e) =>
                          !e.endDate && (
                            <SwipeableItem
                              key={e.id}
                              id={e.id}
                              title={e.name}
                              subTitle={e.role}
                              date={`From ${moment(e.startDate)
                                .utc()
                                .local()
                                .format("DD MMM yyyy")}`}
                              handleDelete={handleDelete}
                            />
                          )
                      )}
                    </div>
                  )}
                  {data.filter((d) => d.endDate).length > 0 && (
                    <div className="home_employeeList">
                      <div className="home_employeeListHeader">
                        Previous employees
                      </div>
                      {data.map(
                        (e) =>
                          e.endDate && (
                            <SwipeableItem
                              key={e.id}
                              id={e.id}
                              title={e.name}
                              subTitle={e.role}
                              date={`${moment(e.startDate)
                                .utc()
                                .local()
                                .format("DD MMM yyyy")} - 
                     ${moment(e.endDate).utc().local().format("DD MMM yyyy")}`}
                              handleDelete={handleDelete}
                            />
                          )
                      )}
                    </div>
                  )}
                </div>
                <footer className="home_footer">Swipe left to delete</footer>
              </>
            ) : (
              <div className="home_noData">
                <img src={NoDataAvatar} alt="no-data" />
                <p>No employee records found</p>
              </div>
            ))}

          <button
            onClick={() => navigate("/add-employee")}
            className="home_addButton"
          >
            <img src={PlusIcon} alt="add" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
