import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

// context
import { UserProvider, useUser } from "./Hooks/UserContext";

// components
import Loading from "./Components/Layouts/Loading";
// layouts
import AppLayout from "./Components/Layouts/AppLayout";
import Layout from "./Components/Layouts/Layout";
import Dash from "./Components/Layouts/Dash";
import ErrorElement from "./Components/Layouts/ErrorElement";
import AttendanceLayout from "./Components/Layouts/AttendanceLayout";
import InternalLayout from "./Components/Layouts/InternalLayout";
import RegisterLayout from "./Components/Layouts/RegisterLayout";

// queries
import Paper from "./Components/Queries/Paper";
import Notes from "./Components/Queries/Notes";
import StudentsList from "./Components/Queries/StudentsList";
import Profile from "./Components/Queries/Profile";

// forms
import TeacherForm from "./Components/Forms/TeacherForm";
import StudentForm from "./Components/Forms/StudentForm";
import NotesForm from "./Components/Forms/NotesForm";
import TimeScheduleForm from "./Components/Forms/TimeScheduleForm";
import Login from "./Components/Forms/Login";

// lazy loading user-specific components
const TeacherApproval = lazy(() => import("./Components/Queries/TeacherApproval"));
const PaperForm = lazy(() => import("./Components/Forms/PaperForm"));
const JoinPaper = lazy(() => import("./Components/Forms/JoinPaper"));

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user } = useUser();
  return user ? element : <Navigate to="/" />;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppLayout />} errorElement={<ErrorElement />}>
        <Route index element={<Login />} />
        <Route path="/register" element={<RegisterLayout />}>
          <Route path="reg_teacher" element={<TeacherForm />} />
          <Route path="reg_student" element={<StudentForm />} />
        </Route>
        <Route path="/dash" element={<Layout />} errorElement={<ErrorElement />}>
          <Route index element={<ProtectedRoute element={<Dash />} />} />
          <Route path="paper" element={<ProtectedRoute element={<Paper />} />} />
          <Route path="paper/:paper" element={<ProtectedRoute element={<Notes />} />} />
          <Route path="paper/:paper/add" element={<ProtectedRoute element={<NotesForm />} />} />
          <Route path="paper/:paper/:note/edit" element={<ProtectedRoute element={<NotesForm />} />} />
          <Route path="paper/:paper/students" element={<ProtectedRoute element={<StudentsList />} />} />
          <Route path="attendance" element={<ProtectedRoute element={<AttendanceLayout />} />} />
          <Route path="internal" element={<ProtectedRoute element={<InternalLayout />} />} />
          <Route path="time_schedule" element={<ProtectedRoute element={<TimeScheduleForm />} />} />
          <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="approve_teacher" element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute element={<TeacherApproval />} />
            </Suspense>
          } />
          <Route path="add_paper" element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute element={<PaperForm />} />
            </Suspense>
          } />
          <Route path="join_paper" element={
            <Suspense fallback={<Loading />}>
              <ProtectedRoute element={<JoinPaper />} />
            </Suspense>
          } />
        </Route>
      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer
        className="toast"
        toastClassName="toast-rounded"
        bodyClassName="toast-body"
        // progressClassName="toast-progress"
        position="bottom-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        hideProgressBar={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </UserProvider>
  );
}

export default App;
