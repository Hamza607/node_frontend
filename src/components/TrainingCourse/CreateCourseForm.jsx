import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CreateCourseForm() {
  const location = useLocation();
  console.log("🚀 ~ CreateCourseForm ~ location:", location?.state?.course);
  const navigate = useNavigate();
  const courseToUpdate = location?.state?.course || null;
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (courseToUpdate) {
      setFormData({ ...courseToUpdate });

      // Set image preview URL if an existing image is present
      if (courseToUpdate.imageUpload) {
        setImage(`http://localhost:3000/uploads/${courseToUpdate.imageUpload}`);
      }
    }
  }, [courseToUpdate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    benefits: "",
    content_type: "",
    avg_training_review: 0,
    is_free: false,
    is_paid: false,
    available_as_one_time_purchase: true,
    available_in_subscription: true,
    is_share_on: true,
    status: "",
  });
  useEffect(() => {
    if (courseToUpdate) {
      setFormData({
        ...courseToUpdate,
      });
    }
  }, [courseToUpdate]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";

    if (!formData.price.trim()) {
      newErrors.price = "Price is required.";
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a valid non-negative number.";
    }

    if (formData.avg_training_review < 0 || formData.avg_training_review > 5) {
      newErrors.avg_training_review = "Average review must be between 0 and 5.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const data = new FormData();
      // for (let key in formData) {
      //   data.append(key, formData[key]);
      // }

      for (let key in formData) {
        const value = formData[key];

        if (
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "")
        ) {
          continue; // skip appending null or empty fields
        }

        data.append(key, value);
      }
      if (image) {
        data.append("image", image);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      if (courseToUpdate) {
        const res = await axios.put(
          `http://localhost:3000/api/v1/updateCourse/${courseToUpdate._id}`,
          data,
          config
        );
        if (res.data.success) {
          toast.success("Course updated successfully!");
          navigate("/training-course");
        } else {
          toast.error("Something went wrong while updating.");
        }
      } else {
        const res = await axios.post(
          "http://localhost:3000/api/v1/createCourse",
          data,
          config
        );
        if (res.data.success) {
          toast.success("Course created successfully!");
          setFormData({
            title: "",
            description: "",
            duration: "",
            price: "",
            benefits: "",
            content_type: "",
            avg_training_review: 0,
            is_free: false,
            is_paid: false,
            available_as_one_time_purchase: true,
            available_in_subscription: true,
            is_share_on: true,
            status: "",
          });
          navigate("/training-course");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response.statusText);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        📘 {location?.state?.course ? "Update Course" : "Create New Course"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Course Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
              }
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {image && typeof image === "string" ? (
            <img
              src={image}
              alt="Course Preview"
              className="mt-2 max-h-48 object-contain rounded-md border"
            />
          ) : image instanceof File ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Course Preview"
              className="mt-2 max-h-48 object-contain rounded-md border"
            />
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 8 Weeks"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.duration && (
            <p className="text-red-600 text-sm">{errors.duration}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price ($)
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.price && (
            <p className="text-red-600 text-sm">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content Type
          </label>
          <select
            name="content_type"
            value={formData.content_type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Basic">Basic</option>
            <option value="Premium">Premium</option>
            <option value="Content Creator">Content Creator</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Benefits
          </label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Avg Review
          </label>
          <input
            type="number"
            name="avg_training_review"
            value={formData.avg_training_review}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="5"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.avg_training_review && (
            <p className="text-red-600 text-sm">{errors.avg_training_review}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Published">Published</option>
            <option value="Unpublish">Unpublish</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_free"
            checked={formData.is_free}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Is Free</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_paid"
            checked={formData.is_paid}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Is Paid</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available_as_one_time_purchase"
            checked={formData.available_as_one_time_purchase}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Available for One-time Purchase
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="available_in_subscription"
            checked={formData.available_in_subscription}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Available in Subscription
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_share_on"
            checked={formData.is_share_on}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Share Enabled</label>
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {courseToUpdate ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
