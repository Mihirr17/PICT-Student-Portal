import { useState } from "react";
import axios from "../../config/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorStrip from "../ErrorStrip";

// Teacher Registration Form
const TeacherForm = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    qualification: "",
    department: "",
    role: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    setTeacher({
      ...teacher,
      [e.target.name]: e.target.value,
    });
  };

  //TODO Add more departments
  const addTeacher = async (e) => {
    e.preventDefault();
    try {
      const reqData = JSON.stringify(teacher);
      const response = await axios.post("teachers/", reqData);
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
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-[1.5px] focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400 "
        type="text"
        name="name"
        required
        id="name"
        value={teacher.name}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="email">
        Email:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400 "
        type="text"
        required
        id="email"
        name="email"
        value={teacher.email}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="qualification">
        Qualification:
      </label>
      <input
        className="mb-4 block h-10  w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400 "
        type="text"
        required
        name="qualification"
        id="qualification"
        value={teacher.qualification}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="department">
        Department:
      </label>
      <select
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-[1.5px] focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
        placeholder="select department"
        name="department"
        id="department"
        value={teacher.department}
        required
        onChange={(e) => handleFormChange(e)}
      >
        <option defaultValue hidden>
          Select Department
        </option>

        <option
          className="min-h-[2rem] bg-lightblue-500 font-semibold leading-8 text-slate-100"
          value="Computer"
        >
          Computer
        </option>
      </select>
      <label className="block" htmlFor="username">
        Username:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400 "
        name="username"
        type="text"
        required
        id="username"
        value={teacher.username}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="password">
        Password:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400 "
        type="password"
        name="password"
        id="password"
        value={teacher.password}
        required
        onChange={(e) => handleFormChange(e)}
      />
      <button
        type="submit"
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-lightblue-900 bg-slate-800 p-1 font-bold tracking-wide text-slate-200 hover:bg-lightblue-900 focus:bg-lightblue-900 light:border-lightblue-300 light:bg-lightblue-600 light:text-slate-50 light:hover:bg-slate-900 "
        onClick={(e) => addTeacher(e)}
      >
        Register
      </button>
      {error ? <ErrorStrip error={error} /> : ""}
    </form>
  );
};

export default TeacherForm;
