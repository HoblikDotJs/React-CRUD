import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [year, setYear] = useState("");
  const [class_, setClass] = useState("");
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    Axios.get("/list").then((res) => {
      setStudentList(res.data);
    });
  }, []);

  const submitReview = () => {
    Axios.post("/add", {
      firstName: firstName,
      lastName: lastName,
      year: year,
      class: class_,
    }).then((r) => {
      setStudentList([
        ...studentList,
        {
          firstName: firstName,
          lastName: lastName,
          year: year,
          class: class_,
          id: r.data,
        },
      ]);
    });
  };

  const deleteReview = (id) => {
    Axios.post("/delete", {
      id,
    });
    setStudentList(studentList.filter((student) => student.id !== id));
  };

  const updateReview = (v) => {
    v.edit = true;
    setStudentList([...studentList]);
  };

  const uploadChange = (v) => {
    v.edit = false;
    setStudentList([...studentList]);
    Axios.post("/update", {
      firstName: v.firstName,
      lastName: v.lastName,
      year: v.year,
      class: v.class,
      id: v.id,
    });
  };

  return (
    <div className="App">
      <h1> Students </h1>
      <div className="wrapper">
        <div className="form">
          <label> First Name: </label>
          <input
            id="firstNameInput"
            type="text"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></input>
          <label> Last name: </label>
          <input
            id="lastNameInput"
            type="text"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          ></input>
          <label> Year: </label>
          <input
            id="yearInput"
            type="text"
            name="review"
            onChange={(e) => {
              setYear(e.target.value);
            }}
          ></input>
          <label> Class: </label>
          <input
            id="classInput"
            type="text"
            name="review"
            onChange={(e) => {
              setClass(e.target.value);
            }}
          ></input>
          <button onClick={submitReview}> Submit </button>
        </div>
        {/*--------------------------------------------------------------------*/}
        {studentList.map((v) => {
          return (
            <div className="card">
              
              {!v.edit ? (
                <>
                  <p> First name: {v.firstName} </p>
                  <p> Last name: {v.lastName} </p> <p> Year: {v.year} </p>
                  <p> Class: {v.class} </p>
                  <button onClick={() => deleteReview(v.id)}> Delete </button>
                  <button onClick={() => updateReview(v)}> Update </button>
                </>
              ) : (
                <>
                  <p>
                    First name:
                    <input
                      type="text"
                      placeholder={v.firstName}
                      onChange={(e) => {
                        v.firstName = e.target.value;
                      }}
                    ></input>
                  </p>
                  <p>
                    Last name:
                    <input
                      type="text"
                      placeholder={v.lastName}
                      onChange={(e) => {
                        v.lastName = e.target.value;
                      }}
                    ></input>
                  </p>
                  <p>
                    Year:
                    <input
                      type="text"
                      placeholder={v.year}
                      onChange={(e) => {
                        v.year = e.target.value;
                      }}
                    ></input>
                  </p>
                  <p>
                    Class:
                    <input
                      type="text"
                      placeholder={v.class}
                      onChange={(e) => {
                        v.class = e.target.value;
                      }}
                    ></input>
                  </p>
                  <button onClick={() => uploadChange(v)}> Submit </button>
                </>
              )}
            </div>
          );
        })}
        {/*--------------------------------------------------------------------*/}
      </div>
    </div>
  );
}

export default App;
