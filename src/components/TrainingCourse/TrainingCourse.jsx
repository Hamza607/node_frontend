import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TrainingCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursePerPage] = useState(5);
  const [totalPagess, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:3000/api/v1/getCourse?page=${currentPage}&limit=${coursesPerPage}`;

      if (searchQuery) {
        url += `&title=${encodeURIComponent(searchQuery)}`;
      }
      if (startDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        url += `&startDate=${formattedStartDate}`;
      }
      if (endDate) {
        const formattedEndDate = endDate.toISOString().split("T")[0];
        url += `&endDate=${formattedEndDate}`;
      }

      const response = await axios.get(url);
      console.log("API Response:", response.data);

      if (response.data.success) {
        setCourses(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error(response.data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error(
        "Error fetching course:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    fetchCourse();
  };

  useEffect(() => {
    fetchCourse();
  }, [currentPage, searchQuery, coursesPerPage]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/deleteCourse/${id}`
      );
      toast.success("Course deleted successfully:");
      return response;
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete the course.");
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = totalPagess;

  const handleChange = (event) => {
    setCurrentPage(1);
    setCoursePerPage(Number(event.target.value));
  };

  // Add a function to handle date changes
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800 tracking-tight">
          <span className="inline-block align-middle mr-2">📘</span>
          <span className="inline-block align-middle underline decoration-slate-700 decoration-4 underline-offset-4">
            Training Courses
          </span>
        </h1>

        {false ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex justify-end items-center gap-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleFilter}
                className="bg-slate-600 cursor-pointer text-white rounded-md p-2  my-2 "
              >
                Apply Filter
              </button>

              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                onClick={() => navigate("/course-form")}
                className="bg-slate-600 cursor-pointer text-white rounded-md p-2  my-2 "
              >
                Create New Course
              </button>
            </div>
            <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <tr key={index}>
                          {Array(8)
                            .fill(0)
                            .map((_, i) => (
                              <td key={i} className="px-6 py-4 text-sm">
                                <Skeleton height={20} />
                              </td>
                            ))}
                        </tr>
                      ))
                  : courses.map((course) => (
                      <tr
                        key={course._id}
                        className="hover:bg-gray-100 border-b"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          <img
                            width={100}
                            className="h-[100px]"
                            src={`http://localhost:3000/uploads/${course?.imageUpload}`}
                            alt=""
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {course.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {course.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {course.duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          ${course.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {course.content_type}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              course.is_current_user_enrolled
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {course.is_current_user_enrolled ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex flex-wrap  gap-2">
                          <button
                            onClick={() => {
                              navigate("/course-form", { state: { course } });
                            }}
                            className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded-md transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                {courses.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div></div>
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => paginate(selected + 1)}
            containerClassName="flex justify-center items-center cursor-pointer  gap-1 mt-4"
            pageClassName="px-3 py-2 border rounded "
            activeClassName="bg-blue-500 text-white"
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="limit-select"
              className="text-sm font-medium w-[200px] text-gray-700"
            >
              Items per page
            </label>
            <select
              id="limit-select"
              value={coursesPerPage}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* {courses.length > 0 && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${
                      currentPage === number
                        ? "bg-blue-50 text-blue-600 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )} */}
      </div>
    </div>
  );
}
