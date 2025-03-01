import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/students")
        .then((res) => {
            const activeStudents = res.data.filter((students) => students.isDelete !== 1);
            setData(activeStudents);
        })
        .catch((err) => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5001/students")
        .then((response) => {
            console.log("Fetched students:", response.data);
            setStudents(response.data);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            alert("Failed to load students. Please check the backend.");
        });
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    window.location.reload(); 
    
    if (confirmDelete) {
        try {
            await axios.put(`http://localhost:5001/students/delete/${id}`, { isDelete: 1 });
            const res = await axios.get("http://localhost:5001/students");
            setData(res.data);  // Ensure state is updated
        } catch (err) {
            console.error("Error updating student deletion:", err);
        }
    }
};

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Student List</h2>

      
      <div className="d-flex justify-content-end mb-3">
        <Link to="/add" className="btn btn-success">Create+</Link>
      </div>

      {/* Responsive Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover text-center ">
          <thead className="table-dark  w-100vw" >
            <tr>
              <th>S.No</th>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Address</th>        
              <th>Subject</th>  
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student?.id}</td>

                  {/* Image Preview */}
                  <td>
                    {student.photo ? (
                      <img
                        src={`http://localhost:5001/uploads/${student.photo}`}
                        alt="Student"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "No Photo"
                    )}
                  </td>

                  <td>{student?.name}</td>
                  <td>{student?.phone}</td>
                  <td>{student?.email}</td>
                  <td>{student?.gender}</td>
                  <td>{student?.address}</td> 
                  <td>{student?.subject}</td>  

                  {/* Action Buttons */}
                  <td>
                    <div className="d-flex flex-wrap justify-content-center gap-1">
                      <Link to={`/read/${student.id}`} className="btn btn-sm btn-info">Read</Link>
                      <Link to={`/edit/${student.id}`} className="btn btn-sm btn-primary">Edit</Link>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No Students Found</td> {/* Updated colspan */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
