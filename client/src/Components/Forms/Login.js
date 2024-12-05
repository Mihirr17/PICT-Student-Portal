import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";
import { FaUniversity } from "react-icons/fa";
import { PiStudentThin, PiUserThin, PiSpinnerGapBold } from "react-icons/pi";
import CircleDesign from "../Layouts/CircleDesign";
import ErrorStrip from "../ErrorStrip";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [message, setMessage] = useState("");

  const slowLoadingIndicator = () => {
    setTimeout(() => {
      setMessage(
        "NOTE: Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request. This will cause a delay in the response of the first request after a period of inactivity while the instance spins up."
      );
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userType === "") {
      setError({
        response: {
          data: "Select User Type",
        },
      });
    } else {
      setButtonText("Loading...");
      slowLoadingIndicator();
      try {
        const response = await axios.post(`/auth/login/${userType}`, {
          username,
          password,
        }, { withCredentials: true }); // Ensure credentials are sent

        await setUser({ ...response.data, userType });
        localStorage.setItem(
          "userDetails",
          JSON.stringify({ ...response.data, userType })
        );
      } catch (err) {
        setError(err);
        setButtonText("Login");
      }
    }
  };

  useEffect(() => {
    // Check if the user is logged in based on the session
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/check", { withCredentials: true });
        if (response.data.authenticated) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Handle errors if needed
      }
    };
    checkAuth();
    setUserType("");
    setMessage("");
  }, [setUserType, setMessage, setUser]);

  return (
    <>
      {!user?._id ? (
        <main className="relative z-0 flex h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-400 to-slate-300 text-slate-950 light:from-slate-800 light:to-slate-950 light:text-slate-300">
          {message && !error && (
            <header className="absolute top-0 w-full bg-lightblue-500/50 p-2 text-xs light:bg-slate-700/50 lg:text-base">
              {message}
            </header>
          )}
          <CircleDesign />
          <section className="z-0 mb-4 flex items-center gap-2 whitespace-nowrap text-6xl md:text-8xl lg:gap-4">
            <FaUniversity />
            <h1 className="font-spectral font-semibold text-slate-900 light:text-slate-300">
              PICT
            </h1>
          </section>
          <section className="z-0 w-[65%] justify-self-center rounded-lg bg-slate-100 opacity-80 hover:opacity-100 focus:opacity-100 light:bg-[#060913] sm:w-[min(50%,360px)] md:w-[min(40%,360px)] xl:w-[min(23%,360px)]">
            <form
              className="tracking-wide placeholder:text-slate-200 light:placeholder:text-lightblue-200"
              onSubmit={(e) => handleLogin(e)}
            >
              <section className="flex flex-col items-center justify-start">
                <div className="flex w-full text-lg">
                  <label
                    className="radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tl-lg p-4 light:border-l-[1.5px] light:border-t-[1.5px] light:border-solid light:border-lightblue-900"
                    htmlFor="teacher"
                  >
                    Teacher
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="teacher"
                      id="teacher"
                      name="userType"
                      onClick={() => setUserType("teacher")}
                    />
                  </label>
                  <label
                    className="radio relative flex w-1/2 cursor-pointer flex-col items-center rounded-tr-lg p-4 light:border-r-[1.5px] light:border-t-[1.5px] light:border-solid light:border-lightblue-900"
                    htmlFor="student"
                  >
                    Student
                    <input
                      className="absolute opacity-0"
                      type="radio"
                      value="student"
                      id="student"
                      name="userType"
                      onClick={() => setUserType("student")}
                    />
                  </label>
                </div>
                <div className="flex w-full justify-center p-1 pt-0 text-8xl light:border-x-[1.5px] light:border-solid light:border-lightblue-900 md:p-3 md:pt-0">
                  {userType === "student" ? (
                    <PiStudentThin className="animate-slide rounded-full border-2 border-slate-900 p-1 font-light light:border-slate-300 md:p-2" />
                  ) : userType === "teacher" ? (
                    <PiUserThin className="animate-slide rounded-full border-2 border-slate-900 p-1 font-light light:border-slate-300 md:p-2" />
                  ) : (
                    <FaUniversity className="animate-fadeIn rounded-full border-2 border-slate-900 p-1 font-light light:border-slate-300 md:p-2" />
                  )}
                </div>
              </section>
              <section className="rounded-b-lg px-4 pb-4 light:border-x-[1.5px] light:border-b-[1.5px] light:border-solid light:border-lightblue-900">
                <input
                  className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
                  placeholder="username"
                  id="username"
                  type="text"
                  required
                  autoComplete="off"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-lightblue-900 light:border-slate-200 light:caret-inherit light:focus:border-lightblue-400 light:active:border-lightblue-400"
                  placeholder="password"
                  id="password"
                  type="password"
                  required
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="mb-1 flex h-10 w-full items-center justify-center gap-1 rounded-md border-[1.5px] border-solid border-lightblue-900 bg-slate-800 p-1 font-bold tracking-wide text-slate-200 hover:bg-lightblue-900 focus:bg-lightblue-900 disabled:cursor-wait light:border-lightblue-300 light:bg-lightblue-600 light:text-slate-50 light:hover:bg-slate-900 light:focus:bg-slate-900 lg:mb-2"
                  type="submit"
                  value="Login"
                  disabled={buttonText !== "Login"}
                >
                  {!(buttonText === "Login") && (
                    <PiSpinnerGapBold className="animate-spin" />
                  )}
                  {buttonText}
                </button>
                {error ? <ErrorStrip error={error} /> : ""}
                <p className="inline text-slate-600 light:text-lightblue-200">
                  Click to{" "}
                </p>
                <button
                  type="button"
                  className="font-semibold text-lightblue-600 decoration-2 hover:underline focus:underline light:text-lightblue-400"
                  onClick={() => navigate("./register/reg_student")}
                >
                  Register
                </button>
              </section>
            </form>
          </section>
        </main>
      ) : (
        <Navigate to="./dash" />
      )}
    </>
  );
};

export default Login;
