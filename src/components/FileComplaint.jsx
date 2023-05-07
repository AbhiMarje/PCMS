import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/FileComplaintStyles.css'
import PendingComplaints from './PendingComplaints';
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import NavBar from './NavBar';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { db } from './FirebaseInit';
import { doc, getDoc } from "firebase/firestore";

const FileComplaint = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userLoginDetails, setUserLoginDetails] = useState({
        aadhaar: "",
        address:"",
        dob:"",
        email:"",
        gender:"",
        name:"",
        phone:"",
        station:"",
        uid:""
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place, setPlace] = useState("");

    const { contract } = useContract("0x0548DCc6e4E513008cBb62E93FD7EE3a63B470E3");
    const { data: nextId } = useContractRead(contract, "nextId")
    const { mutateAsync: fileComplaint } = useContractWrite(contract, "fileComplaint");

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


    useEffect(() => {
        if (!location.state || !location.state.uid) {
            navigate("/");
            return;
        }
        setUserId(location.state.uid);
    }, []);

    useEffect(() => {

        const setUserDetails = async () => {

            if(!userId) return;

            try {
                const docSnap = await getDoc(doc(db, `users/${userId}`));
                setUserLoginDetails(docSnap.data());
            } catch(err) {
                console.log(err.message);
            }
        }
        setUserDetails();

    }, [userId]);


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userLoginDetails.name);
    }


    return (
        <>
            <NavBar title={"File Complaint"} />
            <div className='mainDiv'>
                <Form className='formDiv'>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" value={userLoginDetails.name} disabled={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={userLoginDetails.email} disabled={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="phone" value={userLoginDetails.phone} disabled={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" value={userLoginDetails.address} disabled={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicStation">
                        <Form.Label>Station</Form.Label>
                        <Form.Control type="text" value={userLoginDetails.station} disabled={true} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} onChange={(e) => { setDate(e.target.value) }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicTime">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="time" value={time} onChange={(e) => { setTime(e.target.value) }} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPlace">
                        <Form.Label>Place</Form.Label>
                        <Form.Control type="text" placeholder='Enter place' value={place} onChange={(e) => { setPlace(e.target.value) }} />
                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                        Submit
                    </Button>
                </Form>

                <div className='pendingApprovalDiv'>
                    Pending Complaints
                    <PendingComplaints pendingComplaintsList={pendingComplaintsList} />
                </div>
            </div>
        </>
    )
}

export default FileComplaint