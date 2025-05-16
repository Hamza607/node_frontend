import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/employee/${id}`
        );
        setEmployee(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch employee data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-content, .print-content * {
        visibility: visible;
      }
      .print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
        margin: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  `;

  if (loading)
    return <div className="text-center py-12">Loading employee profile...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!employee)
    return <div className="text-center py-12">Employee not found</div>;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <style>{printStyles}</style>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => window.print()}
            className="bg-gray-800 cursor-pointer text-white hover:bg-gray-700 
         font-medium py-2 px-5 rounded-lg shadow-md hover:shadow-lg 
         transition duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-4 0h-4"
              />
            </svg>
            Print
          </button>
        </div>
        <div className="print-content">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-linear-to-b from-teal-400 to-white h-32"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex items-end -mt-16">
                <div className="bg-white p-1 rounded-full shadow-lg">
                  <div className="bg-gray-200 w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
                    {employee.firstName.charAt(0)}
                    {employee.lastName.charAt(0)}
                  </div>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-xl text-gray-600">{employee.position}</p>
                  <p className="text-gray-500">
                    {employee.department} Department
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-800">{employee.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-gray-800">{employee.phone || "N/A"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </h3>
                    <p className="text-gray-800">
                      {formatDate(employee.dateOfBirth)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Gender
                    </h3>
                    <p className="text-gray-800">{employee.gender || "N/A"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Marital Status
                    </h3>
                    <p className="text-gray-800">
                      {employee.maritalStatus || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Address
                </h2>

                <div className="space-y-2">
                  <p className="text-gray-800">
                    {employee.address?.street || "N/A"}
                  </p>
                  <p className="text-gray-800">
                    {employee.address?.city}, {employee.address?.state}{" "}
                    {employee.address?.zipCode}
                  </p>
                  <p className="text-gray-800">{employee.address?.country}</p>
                </div>
              </div>

              {/* Skills */}
              {employee.skills && employee.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                    Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Professional Info */}
            <div className="lg:col-span-2">
              {/* Employment Details */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Employment Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Joining Date
                    </h3>
                    <p className="text-gray-800">
                      {formatDate(employee.joiningDate)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Position
                    </h3>
                    <p className="text-gray-800">{employee.position}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Department
                    </h3>
                    <p className="text-gray-800">{employee.department}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Salary
                    </h3>
                    <p className="text-gray-800">
                      {employee.salary
                        ? `$${employee.salary.toLocaleString()}`
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p className="text-gray-800">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          employee.isActive ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      {employee.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Work Experience
                </h2>

                {employee.experience && employee.experience.length > 0 ? (
                  <div className="space-y-6">
                    {employee.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-500 pl-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {exp.companyName}
                            </h3>
                            <p className="text-gray-600">{exp.position}</p>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {formatDate(exp.startDate)} -{" "}
                            {exp.currentlyWorking
                              ? "Present"
                              : formatDate(exp.endDate)}
                          </div>
                        </div>

                        {exp.responsibilities &&
                          exp.responsibilities.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-500">
                                Responsibilities:
                              </h4>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {exp.responsibilities.map((resp, i) => (
                                  <li key={i} className="text-gray-700">
                                    {resp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-500">
                              Technologies:
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {exp.technologies.map((tech, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No work experience recorded</p>
                )}
              </div>

              {/* Education */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Education
                </h2>

                {employee.education && employee.education.length > 0 ? (
                  <div className="space-y-6">
                    {employee.education.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-blue-500 pl-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {edu.institution}
                            </h3>
                            <p className="text-gray-600">
                              {edu.degree}{" "}
                              {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {edu.startYear} -{" "}
                            {edu.currentlyStudying ? "Present" : edu.endYear}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No education information recorded
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;
