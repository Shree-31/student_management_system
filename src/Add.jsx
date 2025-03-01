
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Add() {
  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    subject: [],
    photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setValues({ ...values, gender: e.target.value });
  };

  const handleCourseChange = (e) => {
    const { value, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      subject: checked
        ? [...prevValues.subject, value]
        : prevValues.subject.filter((course) => course !== value),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, photo: file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.name || !values.phone || !values.email || !values.gender || !values.address || values.subject.length === 0) {
      setError("Please fill in all fields!");
      return;
    }

    if (!validatePhone(values.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (!validateEmail(values.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!values.address) {
      setError("Please enter an address.");
      return;
    }

    setError(null); // Clear error if all validations pass

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("address", values.address);
    formData.append("subject", JSON.stringify(values.subject));
    formData.append("photo", values.photo);

    try {
      await axios.post("http://localhost:5001/add-students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Student added successfully!");
      navigate("/"); // Redirect after success
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student.");
    }
  };

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-100 w-md-50 bg-white rounded p-3">
        <form onSubmit={handleSubmit}>
          <h2>Add Student</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-2">
            <label>Upload Photo</label>
            <input type="file" name="photo" className="form-control" onChange={handleFileChange} required />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            )}
          </div>

          <div className="mb-2">
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter Name" className="form-control" value={values.name} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label>Address</label>
            <textarea name="address" className="form-control" placeholder="Enter Address" value={values.address} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label>Gender</label>
            <div>
              <input type="radio" name="gender" value="Male" checked={values.gender === "Male"} onChange={handleGenderChange} required />
              <label className="mx-2">Male</label>

              <input type="radio" name="gender" value="Female" checked={values.gender === "Female"} onChange={handleGenderChange} required />
              <label className="mx-2">Female</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Preferred Courses</label>
            <div>
              <input type="checkbox" name="subject" value="Computer Science" onChange={handleCourseChange} />
              <label className="mx-2">Computer Science</label>

              <input type="checkbox" name="subject" value="Mechanical Engineering" onChange={handleCourseChange} />
              <label className="mx-2">Mechanical Engineering</label>

              <input type="checkbox" name="subject" value="Electronics & Communication" onChange={handleCourseChange} />
              <label className="mx-2">Electronics & Communication</label>

              <input type="checkbox" name="subject" value="Civil Engineering" onChange={handleCourseChange} />
              <label className="mx-2">Civil Engineering</label>

              <input type="checkbox" name="subject" value="Electrical Engineering" onChange={handleCourseChange} />
              <label className="mx-2">Electrical Engineering</label>
            </div>
          </div>

          <div className="mb-2">
            <label>Phone</label>
            <input type="text" name="phone" placeholder="Enter Phone Number" className="form-control" value={values.phone} onChange={handleChange} required maxLength={10} />
          </div>

          <div className="mb-2">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter Email" className="form-control" value={values.email} onChange={handleChange} required />
          </div>

          <button className="btn btn-success float-end" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;
