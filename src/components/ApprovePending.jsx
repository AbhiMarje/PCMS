import React, { useState, useEffect } from 'react'
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import Card from 'react-bootstrap/Card';
import { ConnectWallet } from "@thirdweb-dev/react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from './FirebaseInit';
import NavBar from './NavBar';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const ApprovePending = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [inputId, setInputId] = useState("")
    const [searchedComplaint, setSearchedComplaint] = useState()
    const [allPendingComplaints, setAllPendingComplaints] = useState([[]])
    const [user, setUser] = useState()
    const { contract } = useContract("0x1322FA1E68c949939EDaF562762F474D75B7584e");
    const { mutateAsync: getComplaint } = useContractWrite(contract, "getComplaint")
    const { mutateAsync: getAllPendingApprovalComplaints } = useContractWrite(contract, "getAllPendingApprovalComplaints")
    const { mutateAsync: approveComplaint } = useContractWrite(contract, "approveComplaint")
    const { mutateAsync: discardComplaint } = useContractWrite(contract, "discardComplaint")

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
    
    const getPendingApprovalIds = async () => {

        setAllPendingComplaints([[]])
        const notification = toast.loading("Fetching pending approval complaints, Please wait...")

        try {

            const data = await getAllPendingApprovalComplaints([]);
            for (let i = 0; i < data.receipt.events.length; i++) {
                if (data.receipt.events[i].args) {
                    console.log(data.receipt.events[i].args[0]);
                    setAllPendingComplaints(old => [ ...old, data.receipt.events[i].args[0]]);
                }
            }

            toast.success("Fetched pending approval complaints successfully!", {
                id: notification
            })

        } catch (err) {
            toast.error("Fetching pending approval complaints Failed!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
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

    const handleFetch = () => {
        setAllPendingComplaints([])
        getPendingApprovalIds()

    }

    const handleSearch = async (e) => {
        e.preventDefault();

        setSearchedComplaint()

        const notification = toast.loading("Searching...")
        const data = await getComplaint({ args: [inputId] });
        setSearchedComplaint(data.receipt.events[0].args[0]);

        getUserData(data.receipt.events[0].args[0].complaintRegisteredBy)

        toast.success("Searched successfully!", {
            id: notification
        })

    }

    const handleApprove = async () => {

        const notification = toast.loading("Approving...");
        try {
            
            const officerDetails = prompt("Please enter your phone number or email address");
            await approveComplaint({ args: [parseInt(searchedComplaint.id._hex, 16), officerDetails, new Date().toLocaleString()] });
            toast.success("Complaint approved successfully!", {
                id: notification
            })
            setSearchedComplaint([])

        } catch (error) {
            console.error(error)
            toast.error(error.reason, {
                id: notification
            })
            setSearchedComplaint([])
        }
    }

    const handleDecline = async () => {
        const notification = toast.loading("Declining...");
        try {

            const remark = prompt("Please enter reason for declining the complaint");
            await discardComplaint({ args: [parseInt(searchedComplaint.id._hex, 16), remark] });
            toast.success("Complaint declined successfully!", {
                id: notification
            })
            setSearchedComplaint([])

        } catch (error) {
            console.error(error)
            toast.error(error.reason, {
                id: notification
            })
            setSearchedComplaint([])
        }
    }

    const handleResolutionButton = () => {
        navigate("/resolution",  {state: {uid: location.state.uid}});
    }

    const handlePublicPageButton = () => {
        navigate("/publicPage");
    }

    const handleLogout = () => {

        const notification = toast.loading("Logging Out");
        const auth = getAuth();
        signOut(auth).then(() => {
            navigate("/");
            toast.success("Logged out successfully!", {
                id: notification
            })
        }).catch((error) => {
            
            toast.error("Something went wrong!");
        });
    }

    useEffect(() => {

        if (location.state === null || location.state.uid.trim().length === 0) {
            navigate("/");
            return;
        }

        const getUserDetails = async () => {

           const tempUserData = await getDoc(doc(db, `users/${location.state.uid}`));
           if(tempUserData.exists()) {
                navigate("/fileCompaint", {state:{uid: location.state.uid}});
           } 
        }

        getUserDetails();
    }, [])  

  return (
    <div>
        <nav className="navbar navbar-dark bg-primary">
            <h3 className=' ps-4 text-light' >Approve Pending</h3>
            <div style={{flex: 'auto', paddingLeft: '10px'}}>
            <Button onClick = {handleResolutionButton}>Resolution</Button>
            <Button onClick = {handlePublicPageButton}>Public Page</Button>
            </div>
            <div className='d-flex flex-direction-row'>
                <button className="btn btn-light my-2 my-sm-0 me-3" onClick={handleFetch}>Fetch complaints</button>
                <div className='pe-4'>
                <ConnectWallet accentColor='black' colorMode='light' />
                </div>
            </div>
            <div className='pe-4'>
                <button type="button" class="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
         </nav>
        <div className='d-flex flex-column align-items-center w-100 mt-5 '>
            <section className='w-50 shadow p-3 mb-5 bg-white rounded'>
                <form className='d-flex align-items-center flex-column'>
                    <div className="mb-3 w-100">
                        <div className='w-100'>
                            <label htmlFor="name" className="w-100 form-label d-flex justify-content-start">Check Complaint Details</label>
                        </div>
                        <input type="text" className="form-control" id="name" placeholder="Enter Complaint ID" value={inputId} onChange={(e) => setInputId(e.target.value)} />
                    </div>
                    <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                </form>
            </section>
        </div>
        {searchedComplaint && searchedComplaint.exists && user ?  
        <div className='d-flex flex-column align-items-center'>
            <h3>Complaint Details</h3>
            <div className='w-50' style={{ margin: '1rem' , color: "black"}}>
                <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                    <div className='w-100 d-flex justify-content-between'>
                        <Card.Title>{searchedComplaint.title}</Card.Title>
                        <div>
                            <span style={{fontWeight: "bold"}}>ID: {parseInt(searchedComplaint.id._hex, 16)}</span>
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
                        <span style={{fontWeight: "bold"}}>Remarks: </span>
                        <div>
                            <div className='d-flex flex-row justify-content-between mt-2'>
                                <span className='fw-light'>{searchedComplaint.resolutionRemark[0]}</span>
                                <span className='fw-lighter me-4'>{searchedComplaint.resolutionDates[0]}</span>
                            </div>
                        </div>
                    </Card.Text>
                    <Card.Text>
                        <span style={{fontWeight: "bold"}}>Status: </span> {searchedComplaint.isResolved ? "Closed" : searchedComplaint.isApproved ? "Approved" : !searchedComplaint.exists ? "Declined" : "Pending Approval"}
                    </Card.Text>
                    <div className='d-flex'>
                        <button className='btn btn-primary flex-fill me-2' onClick={handleApprove}>Approve</button>
                        <button className='btn btn-danger flex-fill' onClick={handleDecline}>Decline</button>
                    </div>
                </div>
            </div>
        </div>
        : ""}
        {allPendingComplaints.length > 1 ? 
        <div className='d-flex flex-column align-items-center'>
        <h3>Pending Complaint</h3>
        {allPendingComplaints.map((pendingComplaint, index) => {
            return (
                pendingComplaint.length > 1 ? 
                    <div className='w-50' style={{ margin: '1rem' , color: "black"}}  key={index}>
                        <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                            <div className='w-100 d-flex justify-content-between'>
                                <Card.Title>{pendingComplaint.title}</Card.Title>
                                <div>
                                    <span style={{fontWeight: "bold"}}>ID: {parseInt(pendingComplaint.id._hex, 16)}</span>
                                </div>
                            </div>
                            <Card.Subtitle className="mb-2 mt-1 text-muted">{pendingComplaint.description}</Card.Subtitle>
                            <Card.Text className='mt-4'>
                                <span style={{fontWeight: "bold"}}>Remarks: </span>
                                <div>
                                    {pendingComplaint.resolutionRemark.map((remark, index) => {
                                        return (
                                            <div key={index} className='d-flex flex-row justify-content-between mt-2'>
                                                <span className='fw-light'>{remark}</span>
                                                <span className='fw-lighter me-4'>{pendingComplaint.resolutionDates[index]}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card.Text>
                            <Card.Text>
                                <span style={{fontWeight: "bold"}}>Status: </span> {pendingComplaint.isResolved? "Closed" : pendingComplaint.isApproved ? "Approved" : !pendingComplaint.exists ? "Declined" : "Pending Approval"}
                            </Card.Text>
                        </div>
                    </div>
                : ""
            )
        })}
        </div>
        : ""}
    </div>
  )
}

export default ApprovePending