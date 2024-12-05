import { useContext, useState, useEffect } from "react";
import UserContext from "../../Hooks/UserContext";
import { Navigate } from "react-router-dom";
import axios from "../../config/api/axios";  // Ensure this is properly configured
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../Layouts/Loading";
import ErrorStrip from "../ErrorStrip";

const TeacherApproval = () => {
  const { user } = useContext(UserContext);
  const [newTeachers, setNewTeachers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getNewTeachers = async () => {
      try {
        if (!user.department) {
          setError("Department not found.");
          return;
        }
        console.log("Fetching teachers for department:", user.department);
        const response = await axios.get(`/teachers/unapproved/${user.department}`); // Make sure this matches your backend route
        setNewTeachers(response.data);
      } catch (err) {
        console.error("Error fetching new teachers:", err);
        setError("Failed to fetch new teachers");
      }
    };
    getNewTeachers();
  }, [user]);

  const handleApprove = async (e) => {
    const index = e.currentTarget.id;
    const teacher = newTeachers[index];

    if (!teacher) {
      toast.error("Teacher not found.");
      return;
    }

    teacher.role = "teacher";

    try {
      const response = await axios.patch(`/teachers/${teacher._id}`, { // Make sure this route exists in your backend
        id: teacher._id,
        role: teacher.role,
      });
      newTeachers.splice(index, 1);
      toast.success(response.data.message);
      setError(""); // Clear error message on success
    } catch (err) {
      console.error("Error approving teacher:", err);
      setError("Failed to approve teacher");
      toast.error(err.message);
    }
  };

  const handleDelete = async (e) => {
    const index = e.currentTarget.id;
    const teacherId = newTeachers[index]?._id;

    if (!teacherId) {
      toast.error("Teacher ID not found.");
      return;
    }

    try {
      const response = await axios.delete(`/teachers/${teacherId}`); // Ensure this matches your backend route
      newTeachers.splice(index, 1); // Remove teacher from the state
      toast.success(response.data.message, {
        icon: <FaTrash />,
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user || user.role !== "HOD") {
    return <Navigate to="/dash" />;
  }

  return (
    <main className="teacher__approval">
      <h2 className="mb-2 mt-3 whitespace-break-spaces text-4xl font-bold text-lightblue-950 underline decoration-inherit decoration-2 underline-offset-4 light:mt-0 light:text-slate-400 md:text-6xl">
        Approve Teacher
      </h2>
      <h3 className="text-2xl font-semibold">Department: {user.department}</h3>
      <form>
        {newTeachers.length ? (
          <div className="my-4 w-full overflow-auto rounded-md border-2 border-slate-900 light:border-slate-500 light:p-[1px]">
            <table className="w-full">
              <thead>
                <tr className="rounded-t-xl bg-slate-900 text-base text-slate-100">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Qualification</th>
                  <th className="p-2">Username</th>
                  <th className="p-2">Approve</th>
                  <th className="p-2">Reject</th>
                </tr>
              </thead>
              <tbody>
                {newTeachers.map((teacher, index) => (
                  <tr key={teacher._id}>
                    <td className="border-t-[1px] border-slate-400 p-2">{teacher.name}</td>
                    <td className="border-t-[1px] border-slate-400 p-2">{teacher.email}</td>
                    <td className="border-t-[1px] border-slate-400 p-2">{teacher.qualification}</td>
                    <td className="border-t-[1px] border-slate-400 p-2">{teacher.username}</td>
                    <td className="border-t-[1px] border-slate-400 p-0">
                      <button
                        type="button"
                        id={index}
                        onClick={handleApprove}
                        className="m-0 flex h-auto w-full justify-center bg-transparent py-3 text-xl text-slate-100 hover:bg-lightblue-900"
                      >
                        <FaPlus />
                      </button>
                    </td>
                    <td className="border-t-[1px] border-slate-400 p-0">
                      <button
                        className="m-0 flex h-auto w-full justify-center bg-transparent py-3 text-xl text-slate-100 hover:bg-red-600"
                        type="button"
                        id={index}
                        onClick={handleDelete}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Loading />
        )}
      </form>
      {error && <ErrorStrip error={error} />}
    </main>
  );
};

export default TeacherApproval;
