import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/FileComplaintStyles.css'
import PendingComplaints from './PendingComplaints';
import { useContract, useContractRead, useContractWrite, useAddress } from "@thirdweb-dev/react";
import NavBar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './FirebaseInit';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from 'react-hot-toast';

const FileComplaint = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const address = useAddress();
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
        uid:"",
        complaints: []
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place, setPlace] = useState("");

    const { contract } = useContract("0x20Ad6764b9C021410F2CF518D2537FC2bBCfa336");
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title.trim().length != 0 || description.trim().length != 0 || date.trim().length != 0 
        || time.trim().length != 0 || place.trim().length != 0) {

        const notification = toast.loading("Filing Complaint");
        try {

            await fileComplaint({ args: [title, description, date, time, place, new Date().toLocaleString()] });
            setTitle("");
            setDescription("");
            setDate("");
            setPlace("");
            setTime("");

            await updateDoc(doc(db, `users/${userId}`), {
                complaints: [...userLoginDetails.complaints, parseInt(nextId._hex, 16)],
                metamaskId: address
            })
            toast.success(`Complaint Filed! Note Your ComplaintId:${nextId}`, {
                id: notification,
            });
        } catch (err) {
            toast.error("Whoops, something went wrong!", {
                id: notification,
            });
            console.error("contract call failure", err.message);
        }

        } else {
            toast.error("Please fill all the fields");
        }
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