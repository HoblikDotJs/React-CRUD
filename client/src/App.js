import "./App.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    year: "",
    class: "",
    id: "",
  });
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    //cannot use async in useEffect?
    Axios.get("http://localhost:8080/list").then(({ data }) => {
      setStudentList(data);
    });
  }, []);

  const submitStudent = async () => {
    const { firstName, lastName, year } = student;
    const { data } = await Axios.post("http://localhost:8080/add", {
      firstName,
      lastName,
      year,
      class: student.class,
    });
    setStudentList([
      ...studentList,
      {
        ...student,
        id: data,
      },
    ]);
  };

  const deleteStudent = (id) => {
    Axios.post("http://localhost:8080/delete", {
      id,
    });
    setStudentList(studentList.filter((student) => student.id !== id));
  };

  const updateStudent = (v) => {
    // UI
    v.edit = true;
    setStudentList([...studentList]);
  };

  const uploadChange = (v) => {
    v.edit = false;
    setStudentList([...studentList]);
    const { firstName, lastName, year, id } = v;
    Axios.post("http://localhost:8080/update", {
      firstName: firstName,
      lastName: lastName,
      year: year,
      class: v.class, // cannot destructure object because of "class"
      id: id,
    });
  };

  const manageInputs = ({ name, value }) => {
    setStudent({ ...student, [name]: value });
  };

  return (
    <div className="App">
      <h1> Students </h1>
      <div className="wrapper">
        <div className="form">
          <label> First Name: </label>
          <input
            type="text"
            name="firstName"
            onChange={({ target }) => {
              manageInputs(target);
            }}
          ></input>
          <label> Last name: </label>
          <input
            type="text"
            name="lastName"
            onChange={({ target }) => {
              manageInputs(target);
            }}
          ></input>
          <label> Year: </label>
          <input
            type="text"
            name="year"
            onChange={({ target }) => {
              manageInputs(target);
            }}
          ></input>
          <label> Class: </label>
          <input
            type="text"
            name="class"
            onChange={({ target }) => {
              manageInputs(target);
            }}
          ></input>
          <button onClick={submitStudent}> Submit </button>
        </div>
        {/*-------------------- Student list --------------------*/}
        {studentList.map((v) => {
          return (
            <div key={v.id} className="card">
              {!v.edit ? (
                <>
                  <p> First name: {v.firstName} </p>
                  <p> Last name: {v.lastName} </p> <p> Year: {v.year} </p>
                  <p> Class: {v.class} </p>
                  <button onClick={() => deleteStudent(v.id)}> Delete </button>
                  <button onClick={() => updateStudent(v)}> Update </button>
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
