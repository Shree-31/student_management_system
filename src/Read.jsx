import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function Read() {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5001/students")
        .then((res) => {
            const activeStudents = res.data.filter((student) => student.isDelete !== 1);
            setData(activeStudents);
        })
        .catch((err) => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5001/students")
        .then((response) => {
            setStudents(response.data);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            alert("Failed to load students. Please check the backend.");
        });
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    
    if (confirmDelete) {
        try {
            await axios.put(`http://localhost:5001/students/delete/${id}`, { isDelete: 1 });
            const res = await axios.get("http://localhost:5001/students");
            setData(res.data);
        } catch (err) {
            console.error("Error updating student deletion:", err);
        }
    }
  };

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Student List</h2>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/add" className="btn btn-success">Create+</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover text-center">
          <thead className="table-dark">
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
                  <td>
                    <div className="d-flex flex-wrap justify-content-center gap-1">
                      <button className="btn btn-sm btn-info" onClick={() => handleShowModal(student)}>Read</button>
                      <Link to={`/edit/${student.id}`} className="btn btn-sm btn-primary">Edit</Link>
                      <button onClick={() => handleDelete(student.id)} className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">No Students Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying student details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div>
              <p><strong>ID:</strong> {selectedStudent.id}</p>
              <p><strong>Name:</strong> {selectedStudent.name}</p>
              <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
              <p><strong>Gender:</strong> {selectedStudent.gender}</p>
              <p><strong>Address:</strong> {selectedStudent.address}</p>
              <p><strong>Subject:</strong> {selectedStudent.subject}</p>
              {selectedStudent.photo && (
                <img
                  src={`http://localhost:5001/uploads/${selectedStudent.photo}`}
                  alt="Student"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Read;