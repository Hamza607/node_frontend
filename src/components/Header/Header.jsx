import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  return (
    <>
      <nav className=" px-6 py-4 shadow">
        <div className="flex items-center justify-between">
          <div
            className="text-2xl font-bold text-blue-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            BackendMaster
          </div>
          <div className="hidden md:flex space-x-10">
            <Link to="#features" className="hover:text-blue-400 transition">
              Features
            </Link>
            <Link to="#courses" className="hover:text-blue-400 transition">
              Courses
            </Link>
            <Link to="/employee" className="hover:text-blue-400 transition">
              Add Employee
            </Link>
            <Link to="/employeelist" className="hover:text-blue-400 transition">
              Employee List
            </Link>
            <Link to="/todocard" className="hover:text-blue-400 transition">
              Add List
            </Link>
          </div>

          {token ? (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-medium transition"
            >
              Log In
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
