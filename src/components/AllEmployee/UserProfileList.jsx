import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function UserProfileList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/employee");
      setEmployees(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/employee/${id}`
      );
      fetchEmployees();
      return response;
    } catch (error) {}
  };
  if (loading)
    return <div className="text-center py-8">Loading employees...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (employees.length === 0)
    return <div className="text-center py-8">No employees found</div>;
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Employee Directory</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  {employee.firstName.charAt(0)}
                  {employee.lastName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl first-letter:uppercase font-semibold">
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <p className="text-gray-600">{employee.position}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Email:</span> {employee.email}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Phone:</span> {employee.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Department:</span>{" "}
                  {employee.department}
                </p>
              </div>

              {employee.skills && employee.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-1">Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* {employee.experience && employee.experience.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Experience:</h3>
                  <ul className="space-y-3">
                    {employee.experience.map((exp, index) => (
                      <li
                        key={index}
                        className="border-l-2 border-blue-500 pl-3"
                      >
                        <h4 className="font-medium">{exp.companyName}</h4>
                        <p className="text-gray-600">{exp.position}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(exp.startDate).toLocaleDateString()} -{" "}
                          {exp.currentlyWorking
                            ? "Present"
                            : new Date(exp.endDate).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {employee.education && employee.education.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Education:</h3>
                  <ul className="space-y-2">
                    {employee.education.map((edu, index) => (
                      <li key={index}>
                        <h4 className="font-medium">{edu.institution}</h4>
                        <p className="text-gray-600">{edu.degree}</p>
                        <p className="text-sm text-gray-500">
                          {edu.startYear} -{" "}
                          {edu.currentlyStudying ? "Present" : edu.endYear}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
              <div className="flex gap-4 items-center">
                <Link
                  to={`/employees/${employee._id}`}
                  className="text-blue-600 hover:underline"
                >
                  <IoIosEye fontSize={20} />
                </Link>
                <div>
                  <p
                    onClick={() => navigate("/employee", { state: employee })}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    <MdEdit fontSize={20} />
                  </p>
                </div>
                <div>
                  <p
                    onClick={() => handleDelete(employee._id)}
                    className="text-red-600 cursor-pointer hover:underline"
                  >
                    <FaTrash fontSize={14} />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
