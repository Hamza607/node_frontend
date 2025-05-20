import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const navigate = useNavigate();
  let employee = {};
  const params = useLocation();
  employee = params.state;

  const handlesubmit = async (employeeData) => {
    try {
      if (employee) {
        const response = await axios.put(
          `http://localhost:3000/api/v1/employee/${employee?._id}`,
          employeeData
        );
        console.log("Response from API:", response.data);
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/v1/employee",
          employeeData
        );
        console.log("Response from API post:", response.data);
      }

      // You can show success message or do further actions here
    } catch (error) {
      console.error("Error submitting form data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || "",
    lastName: employee?.lastName || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    dateOfBirth: employee?.dateOfBirth || "",
    profilePicture: employee?.profilePicture || "",
    address: {
      street: employee?.address?.street || "",
      city: employee?.address?.city || "",
      state: employee?.address?.state || "",
      country: employee?.address?.country || "",
      zipCode: employee?.address?.zipCode || "",
    },
    gender: employee?.gender || "",
    maritalStatus: employee?.maritalStatus || "",
    department: employee?.department || "",
    position: employee?.position || "",
    salary: employee?.salary || "",
    skills: employee?.skills || [],
    experience: employee?.experience || [],
    education: employee?.education || [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [experienceForm, setExperienceForm] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    responsibilities: "",
    technologies: "",
  });
  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    currentlyStudying: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExperienceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addExperience = () => {
    if (
      experienceForm.companyName &&
      experienceForm.position &&
      experienceForm.startDate
    ) {
      const newExperience = {
        ...experienceForm,
        responsibilities: experienceForm.responsibilities
          .split("\n")
          .filter((r) => r.trim()),
        technologies: experienceForm.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      setFormData((prev) => ({
        ...prev,
        experience: [...prev.experience, newExperience],
      }));

      setExperienceForm({
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        responsibilities: "",
        technologies: "",
      });
    }
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addEducation = () => {
    if (
      educationForm.institution &&
      educationForm.degree &&
      educationForm.startYear
    ) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, educationForm],
      }));

      setEducationForm({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        currentlyStudying: false,
      });
    }
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlesubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-10 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {employee?._id ? "Edit Employee" : "Add New Employee"}
        </h1>
        <button
          onClick={() => navigate("/employeelist")}
          className="w-[200px] p-2 rounded-md text-white cursor-pointer bg-blue-700"
        >
          Employee List
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            profilePicture: e.target.files[0],
          }))
        }
      />
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.address.country}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.address.zipCode}
                onChange={handleAddressChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Employment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Skills
          </h2>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={handleSkillAdd}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
              >
                <span className="mr-2">{skill}</span>
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Work Experience
          </h2>

          {formData.experience.map((exp, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg relative"
            >
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <h3 className="font-medium text-lg">{exp.companyName}</h3>
              <p className="text-gray-600">{exp.position}</p>
              <p className="text-gray-500 text-sm">
                {new Date(exp.startDate).toLocaleDateString()} -{" "}
                {exp.currentlyWorking
                  ? "Present"
                  : new Date(exp.endDate).toLocaleDateString()}
              </p>
              {exp.responsibilities.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Responsibilities:</h4>
                  <ul className="list-disc list-inside">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
              {exp.technologies.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Add New Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={experienceForm.companyName}
                  onChange={handleExperienceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={experienceForm.position}
                  onChange={handleExperienceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={experienceForm.startDate}
                  onChange={handleExperienceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={experienceForm.endDate}
                  onChange={handleExperienceChange}
                  disabled={experienceForm.currentlyWorking}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyWorking"
                    name="currentlyWorking"
                    checked={experienceForm.currentlyWorking}
                    onChange={handleExperienceChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="currentlyWorking"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Currently working here
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  name="responsibilities"
                  value={experienceForm.responsibilities}
                  onChange={handleExperienceChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={experienceForm.technologies}
                  onChange={handleExperienceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Experience
            </button>
          </div>
        </div>

        {/* Education */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
            Education
          </h2>

          {formData.education.map((edu, index) => (
            <div
              key={index}
              className="mb-6 p-4 border border-gray-200 rounded-lg relative"
            >
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <h3 className="font-medium text-lg">{edu.institution}</h3>
              <p className="text-gray-600">
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </p>
              <p className="text-gray-500 text-sm">
                {edu.startYear} -{" "}
                {edu.currentlyStudying ? "Present" : edu.endYear}
              </p>
            </div>
          ))}

          <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Add Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  name="institution"
                  value={educationForm.institution}
                  onChange={handleEducationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={educationForm.degree}
                  onChange={handleEducationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={educationForm.fieldOfStudy}
                  onChange={handleEducationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Year
                </label>
                <input
                  type="number"
                  name="startYear"
                  value={educationForm.startYear}
                  onChange={handleEducationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Year
                </label>
                <input
                  type="number"
                  name="endYear"
                  value={educationForm.endYear}
                  onChange={handleEducationChange}
                  disabled={educationForm.currentlyStudying}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="currentlyStudying"
                    name="currentlyStudying"
                    checked={educationForm.currentlyStudying}
                    onChange={handleEducationChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="currentlyStudying"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Currently studying here
                  </label>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Education
            </button>
          </div>
        </div>

        {/* Form Submission */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {employee?._id ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
