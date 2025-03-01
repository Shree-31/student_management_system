

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [preview, setPreview] = useState("");
  const [photo, setPhoto] = useState(null); 
  const [students, setStudents] = useState([]);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    subject: [],
    photo: null,
  });

  // Fetch student data
  useEffect(() => {
    axios
      .get(`http://localhost:5001/students/edit/${id}`)
      .then((res) => {
        if (res.data) {
          const student = res.data;
          setValues({
            name: student.name,
            phone: student.phone,
            email: student.email,
            gender: student.gender,
            address: student.address,
            subject: student.subject || [],
            photo: student.photo,
          });
          if (student.photo) {
            const url = student.photo;
            const cleanUrl = url.replace("http://localhost:5001", "");
            setPreview(`http://localhost:5001/uploads/${cleanUrl}`);
          }
        } else {
          console.error("Student not found");
        }
      })
      .catch((err) => console.error("Error fetching student:", err));
  }, [id]);

  // Handle input field changes
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Handle gender radio button selection
  const handleGenderChange = (e) => {
    setValues((prev) => ({ ...prev, gender: e.target.value }));
  };

  // Handle checkbox selection for Preferred Courses
  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    
    setValues((prevValues) => {
      const updatedSubjects = Array.isArray(prevValues.subject) ? prevValues.subject : []; // Ensure it's an array
  
      return {
        ...prevValues,
        subject: checked
          ? [...updatedSubjects, value]
          : updatedSubjects.filter((course) => course !== value),
      };
    });
  };
  
  

  // Handle file input change
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file)); // Show preview of selected image
    }
  };

  
  // Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(values.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
  
    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(values.email)) {
      alert("Please enter a valid email.");
      return;
    }
  
    // Ensure subject is always an array (even if it's empty)
    const subjects = Array.isArray(values.subject) ? values.subject : [];
  
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("gender", values.gender);
      formData.append("address", values.address);
      formData.append("subject", JSON.stringify(subjects));  // Ensure subject is a valid JSON array
  
      if (photo) {
        formData.append("photo", photo);
      }
  
      await axios.put(`http://localhost:5001/students/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      alert("Student updated successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error updating student:", err.response?.data || err);
    }
  };
  

  // Fetch all students (if needed for other purposes)
  useEffect(() => {
    axios
      .get("http://localhost:5001/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        alert("Failed to load students. Please check the backend.");
      });
  }, []);

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-100 w-md-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h2>Edit Student</h2>

          {/* Upload Image */}
          <div className="mb-2">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {preview && (
              <img
                src={preview} // Use the preview URL for the image preview
                alt="Preview"
                className="mt-2"
                accept="photo/*"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Name Input */}
          <div className="mb-2">
            <label>Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="mb-2">
            <label>Address</label>
            <textarea
              name="address"
              className="form-control"
              placeholder="Enter Address"
              value={values.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender Selection */}
          <div className="mb-2">
            <label>Gender</label>
            <div>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={values.gender === "Male"}
                onChange={handleGenderChange}
                required
              />
              <label className="mx-2">Male</label>

              <input
                type="radio"
                name="gender"
                value="Female"
                checked={values.gender === "Female"}
                onChange={handleGenderChange}
                required
              />
              <label className="mx-2">Female</label>
            </div>
          </div>

          {/* Preferred Courses (Multiple Checkboxes) */}
          <div className="mb-2">
            <label>Preferred Courses</label>
            <div>
              <input
                type="checkbox"
                name="subject"
                value="Computer Science"
                checked={values.subject.includes("Computer Science")}
                onChange={handleCourseChange}
              />
              <label className="mx-2">Computer Science</label>

              <input
                type="checkbox"
                name="subject"
                value="Mechanical Engineering"
                checked={values.subject.includes("Mechanical Engineering")}
                onChange={handleCourseChange}
              />
              <label className="mx-2">Mechanical Engineering</label>

              <input
                type="checkbox"
                name="subject"
                value="Electronics & Communication"
                checked={values.subject.includes("Electronics & Communication")}
                onChange={handleCourseChange}
              />
              <label className="mx-2">Electronics & Communication</label>

              <input
                type="checkbox"
                name="subject"
                value="Civil Engineering"
                checked={values.subject.includes("Civil Engineering")}
                onChange={handleCourseChange}
              />
              <label className="mx-2">Civil Engineering</label>

              <input
                type="checkbox"
                name="subject"
                value="Electrical Engineering"
                checked={values.subject.includes("Electrical Engineering")}
                onChange={handleCourseChange}
              />
              <label className="mx-2">Electrical Engineering</label>
            </div>
          </div>

          {/* Phone Input */}
          <div className="mb-2">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={values.phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
          </div>

          {/* Email Input */}
          <div className="mb-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button className="btn btn-success btn-right" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Edit;

