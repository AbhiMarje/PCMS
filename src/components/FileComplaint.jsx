import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import '../styles/FileComplaintStyles.css';
import { useContract, useContractRead, useContractWrite, useAddress } from "@thirdweb-dev/react";
import NavBar from './NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './FirebaseInit';
import { doc, getDoc, updateDoc, getDocs, query, where, collection } from "firebase/firestore";
import toast from 'react-hot-toast';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ConnectWallet } from '@thirdweb-dev/react';

const FileComplaint = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const address = useAddress();
    const [userId, setUserId] = useState("");
    const [userLoginDetails, setUserLoginDetails] = useState({
        aadhaar: "",
        address: "",
        dob: "",
        email: "",
        gender: "",
        name: "",
        phone: "",
        station: "",
        uid: "",
        complaints: []
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [place, setPlace] = useState("");
    const { contract } = useContract("0x1322FA1E68c949939EDaF562762F474D75B7584e");
    const { data: nextId } = useContractRead(contract, "nextId");
    const { mutateAsync: fileComplaint } = useContractWrite(contract, "fileComplaint");
    const [filedComplaintsIds, setFiledComplaintsIds] = useState([]);
    const [selectedDropDown, setSelectedDropDown] = useState("--Select ID--");
    const [searchedComplaint, setSearchedComplaint] = useState();
    const { mutateAsync: getComplaint } = useContractWrite(contract, "getComplaint");
    const [user, setUser] = useState();
    const [isSaveButtonClicked, setIsSaveButtonClicked] = useState(false);

    useEffect(() => {

        if (location.state === null || location.state.uid.trim().length === 0) {
            navigate("/");
            return;
        }
        setUserId(location.state.uid);

        const getUserDetails = async () => {

            const details = await getDoc(doc(db, `users/${location.state.uid}`));

            setFiledComplaintsIds(details.data().complaints);
        }

        getUserDetails();
    }, [isSaveButtonClicked]);

    useEffect(() => {

        const setUserDetails = async () => {

            if (!userId) return;

            try {
                const docSnap = await getDoc(doc(db, `users/${userId}`));
                setUserLoginDetails(docSnap.data());
            } catch (err) {
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

                setIsSaveButtonClicked(!isSaveButtonClicked);
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

    const getUserData = async (address) => {

        try {
            const user = query(collection(db, 'users'), where('metamaskId', '==', address));
            const querySnapshot = await getDocs(user);
            querySnapshot.forEach((doc) => {
                setUser(doc.data());
            });
            
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        setSearchedComplaint()

        if(selectedDropDown === "--Select ID--") return;

        const notification = toast.loading("Searching...")
        const data = await getComplaint({ args: [selectedDropDown] });
        setSearchedComplaint(data.receipt.events[0].args[0]);

        getUserData(data.receipt.events[0].args[0].complaintRegisteredBy)

        toast.success("Searched successfully!", {
            id: notification
        })

    }

    const handleResolutionButton = () => {
        navigate("/resolution", {state: {uid: location.state.uid}});
    }

    const handlePublicPageButton = () => {
        navigate("/publicPage");
    }


    return (
        <>
            <nav className="navbar navbar-dark bg-primary">
                <h3 className=' ps-4 text-light' >File Complaint</h3>
                <div style={{flex: 'auto', paddingLeft: '10px'}}>
                <Button onClick={handleResolutionButton}>Update Complaint</Button>
                <Button onClick={handlePublicPageButton}>Public Page</Button>
                </div>
                <div className='pe-4'>
                    <ConnectWallet accentColor='black' colorMode='light' /> 
                </div>
            </nav>
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
                    <div className='d-flex flex-column align-items-center w-100 mt-5 '>
                        <section className='w-75 shadow p-3 bg-white rounded'>
                            <div>
                                <select className="custom-select w-100 mb-3 p-2 text-dark bg-light" value={selectedDropDown} onChange={(e) => setSelectedDropDown(e.target.value)}>
                                    <option value="checkComplaint">--Select ID--</option>
                                    {filedComplaintsIds.map((filedComplaintId, i) => {
                                        return <>
                                            <option key={i} value={filedComplaintId}>{filedComplaintId}</option>
                                        </>
                                    })}
                                </select>
                                <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                            </div>
                        </section>
                    </div>
                    {searchedComplaint && user ?
                        <div className='d-flex flex-column align-items-center mt-5'>
                            <h3>Complaint Details</h3>
                            <div className='w-75' style={{ margin: '1rem', color: "black" }}>
                                <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                                    <div className='w-100 d-flex justify-content-between'>
                                        <Card.Title>{searchedComplaint.title}</Card.Title>
                                        <div>
                                            <span style={{ fontWeight: "bold" }}>ID: {parseInt(searchedComplaint.id._hex, 16)}</span>
                                        </div>
                                    </div>
                                    <Card.Subtitle className="mb-2 mt-1 text-muted">{searchedComplaint.description}</Card.Subtitle>
                                    <div className='mt-4 d-flex flex-column'>
                                        <span>Filed By:&nbsp;&nbsp;<span className='fw-light'>{user.name}</span></span>
                                        <span>Gender:&nbsp;&nbsp;<span className='fw-light'>{user.gender}</span></span>
                                        <span>Phone No.:&nbsp;&nbsp;<span className='fw-light'>{user.phone}</span></span>
                                        <span>Email:&nbsp;&nbsp;<span className='fw-light'>{user.email}</span></span>
                                        <span>DOB:&nbsp;&nbsp;<span className='fw-light'>{user.dob}</span></span>
                                        <span>Aadhaar:&nbsp;&nbsp;<span className='fw-light'>{user.aadhaar}</span></span>
                                        <span>Address:&nbsp;&nbsp;<span className='fw-light'>{user.address}</span></span>
                                        <span>Incident Date & time:&nbsp;&nbsp;<span className='fw-light'>{searchedComplaint.date}&nbsp;&nbsp;{searchedComplaint.time}</span></span>
                                        <span>Incident Place:&nbsp;&nbsp;<span className='fw-light'>{searchedComplaint.place}</span></span>
                                        <span>Filed Date & time:&nbsp;&nbsp;<span className='fw-light'>{searchedComplaint.complaintFiledDate}</span></span>
                                    </div>
                                    <Card.Text className='mt-4'>
                                        <span style={{ fontWeight: "bold" }}>Remarks: </span>
                                        <div>
                                            <div>
                                                {searchedComplaint.exists ? (
                                                    searchedComplaint.resolutionRemark.map((remark, index) => {
                                                        return (
                                                            <div key={index} className='d-flex flex-row justify-content-between mt-2'>
                                                                <span className='fw-light'>{remark}</span>
                                                                <span className='fw-lighter me-4'>{searchedComplaint.resolutionDates[index]}</span>
                                                            </div>
                                                        )
                                                    })
                                                ) : (
                                                    <span>Approval remark:&nbsp;&nbsp;<span className='fw-light'>{searchedComplaint.approvalRemark}</span></span>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Text>
                                    <Card.Text>
                                        <span style={{ fontWeight: "bold" }}>Status: </span> {searchedComplaint.isResolved ? "Closed" : searchedComplaint.isApproved ? "Approved" : !searchedComplaint.exists ? "Declined" : "Pending Approval"}
                                    </Card.Text>
                                </div>
                            </div>
                        </div>
                        : ""}
                </div>
            </div>
        </>
    )
}

export default FileComplaint