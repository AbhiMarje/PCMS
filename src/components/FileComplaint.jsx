import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import '../styles/FileComplaintStyles.css'
import PendingComplaints from './PendingComplaints';

const FileComplaint = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place, setPlace] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginDetails.name);
    }

    const loginDetails = {
        aadhaar : "123456",
        address : "harugeri",
        dob: "2001-01-20",
        email: "abhi@gmail.com",
        gender: "m",
        name : "abhi",
        phone: "123456789",
        station: "harugeri",
    }

    const pendingComplaintsList = [
        {
            id: "1",
            status: "pending",
            title: "Title",
            description: "Description",
            remarks: "xyz",
        },
        {
            id: "2",
            status: "pending",
            title: "Title",
            description: "Description",
            remarks: "xyz",
        },
        {
            id: "3",
            status: "pending",
            title: "Title",
            description: "Description",
            remarks: "xyz",
        }
    ]

  return (
    <>
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand href="#home">
                File Complaint  
            </Navbar.Brand>
            </Container>
        </Navbar>

        <div className='mainDiv'>
            <Form className='formDiv'>
                <Form.Group className="mb-3" controlId="formBasicTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter Title" value = {title} onChange = {(e) => setTitle(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter Description" value = {description} onChange = {(e) => setDescription(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value = {date} onChange={(e) => {setDate(e.target.value)}}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicTime">
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="time" value = {time} onChange={(e) => {setTime(e.target.value)}}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPlace">
                    <Form.Label>Place</Form.Label>
                    <Form.Control type="text" placeholder='Enter place' value = {place} onChange={(e) => {setPlace(e.target.value)}}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value = {loginDetails.name} disabled = {true}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value = {loginDetails.email} disabled = {true}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicStation">
                    <Form.Label>Station</Form.Label>
                    <Form.Control type="text" value = {loginDetails.station} disabled = {true}/>
                </Form.Group>
                
                <Button variant="primary" type = "submit" onClick={(e) => handleSubmit(e)}>
                    Submit
                </Button> 
            </Form>

            <div className='pendingApprovalDiv'>
                Pending Complaints
                <PendingComplaints pendingComplaintsList = {pendingComplaintsList}/>
            </div>
        </div>
    </>
  )
}

export default FileComplaint