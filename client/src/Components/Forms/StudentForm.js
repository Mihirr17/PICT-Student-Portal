import { useState } from "react";
import axios from "../../config/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorStrip from "../ErrorStrip";

const StudentForm = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    setStudent({
      ...student,
      [e.target.id]: e.target.value,
    });
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const reqData = JSON.stringify(student);
      const response = await axios.post("students", reqData);
      navigate("../");
      toast.success(response.data.message);
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form className="scrollWidth w-full  font-medium tracking-wide accent-lightblue-600">
      <label className="block" htmlFor="name">
        Name:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        type="text"
        required
        id="name"
        value={student.name}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="email">
        Email:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        type="text"
        required
        id="email"
        value={student.email}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="course">
        Course:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        type="text"
        required
        id="course"
        value={student.course}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="username">
        Username:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        type="text"
        id="username"
        required
        value={student.username}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="password">
        Password:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        type="password"
        id="password"
        value={student.password}
        onChange={(e) => handleFormChange(e)}
        required
      />
      <button
        type="submit"
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-lightblue-900 bg-slate-800 p-1 font-bold tracking-wide text-slate-200 hover:bg-lightblue-900 focus:bg-lightblue-900 light:border-lightblue-300 light:bg-lightblue-600 light:text-slate-50 light:hover:bg-slate-900 "
        onClick={(e) => addStudent(e)}
      >
        Register
      </button>
      {error ? <ErrorStrip error={error} /> : ""}
    </form>
  );
};

export default StudentForm;
