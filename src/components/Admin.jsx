import React, { useState, useEffect  } from 'react'
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import Card from 'react-bootstrap/Card';
import { ConnectWallet } from "@thirdweb-dev/react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from './FirebaseInit';
import NavBar from './NavBar';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [inputId, setInputId] = useState("")
    const [searchedComplaint, setSearchedComplaint] = useState()
    const [allComplaints, setAllComplaints] = useState([[]])
    const [allPendingComplaints, setAllPendingComplaints] = useState([[]])
    const [allPendingResolutionComplaints, setAllPendingResolutionComplaints] = useState([[]])
    const [allResolvedComplaints, setAllResolvedComplaints] = useState([[]])
    const [user, setUser] = useState();
    const [officer, setofficer] = useState("")
    const [selectedDropDown, setSelectedDropDown] = useState("checkComplaint")
    const { contract } = useContract("0x1322FA1E68c949939EDaF562762F474D75B7584e");
    const { mutateAsync: getComplaint } = useContractWrite(contract, "getComplaint")
    const { mutateAsync: getAllComplaints } = useContractWrite(contract, "getAllComplaints")
    const { mutateAsync: getAllPendingApprovalComplaints } = useContractWrite(contract, "getAllPendingApprovalComplaints")
    const { mutateAsync: getAllPendingResolutionComplaints } = useContractWrite(contract, "getAllPendingResolutionComplaints")
    const { mutateAsync: getAllResolvedComplaints } = useContractWrite(contract, "getAllResolvedComplaints")
    const { mutateAsync: approveComplaint } = useContractWrite(contract, "approveComplaint")
    const { mutateAsync: discardComplaint } = useContractWrite(contract, "discardComplaint")
    const { mutateAsync: setOfficerAddress } = useContractWrite(contract, "setOfficerAddress")

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

    const addOfficer = async (e) => {
        e.preventDefault();

        if (officer) {

            const notification = toast.loading("Adding new officer, Please wait...")

            try {
                await setOfficerAddress({ args: [officer] });
                toast.success("Added new officer successfully", {
                    id: notification
                });

            } catch (err) {
                console.error("contract call failure", err);
                toast.error("Failed to add new officer", {
                    id: notification
                });
            }

        } else {
            toast.error("Please add officer metamask address");
        }
      }

    const getComplaints = async () => {

        setAllComplaints([[]])
        const notification = toast.loading("Fetching all complaints, Please wait...")

        try {

            const data = await getAllComplaints([]);
            for (let i = 0; i < data.receipt.events.length; i++) {
                if (data.receipt.events[i].args) {
                    console.log(data.receipt.events[i].args[0]);
                    setAllComplaints(old => [ ...old, data.receipt.events[i].args[0]]);
                }
            }

            if (!data.receipt.events[0] || !data.receipt.events[0].args) {
                toast.error("No all complaints found!", {
                    id: notification
                })
            } else {
                toast.success("Fetched all complaints successfully!", {
                    id: notification
                })
            }

        } catch (err) {
            toast.error("Fetching all complaints Failed!", {
                id: notification
            })
            console.error("contract call failure", err);
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

            if (!data.receipt.events[0] || !data.receipt.events[0].args) {
                toast.error("No pending approval complaints found!", {
                    id: notification
                })
            } else {
                toast.success("Fetched pending approval complaints successfully!", {
                    id: notification
                })
            }

        } catch (err) {
            toast.error("Fetching pending approval complaints Failed!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const getPendingResolutionIds = async () => {

        setAllPendingResolutionComplaints([[]])
        const notification = toast.loading("Fetching pending resolution complaints, Please wait...")

        try {

            const data = await getAllPendingResolutionComplaints([]);
            for (let i = 0; i < data.receipt.events.length; i++) {
                if (data.receipt.events[i].args) {
                    console.log(data.receipt.events[i].args[0]);
                    setAllPendingResolutionComplaints(old => [ ...old, data.receipt.events[i].args[0]]);
                }
            }

            if (!data.receipt.events[0] || !data.receipt.events[0].args) {
                toast.error("No pending resolution complaints found!", {
                    id: notification
                })
            } else {
                toast.success("Fetched pending resolution complaints successfully!", {
                    id: notification
                })
            }

        } catch (err) {
            toast.error("Fetching pending resoluiton complaints Failed!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const getResolvedIds = async () => {

        setAllResolvedComplaints([[]])
        const notification = toast.loading("Fetching resolved complaints, Please wait...")

        try {

            const data = await getAllResolvedComplaints([]);
            for (let i = 0; i < data.receipt.events.length; i++) {
                if (data.receipt.events[i].args) {
                    console.log(data.receipt.events[i].args[0]);
                    setAllResolvedComplaints(old => [ ...old, data.receipt.events[i].args[0]]);
                }
            }
        
            if (!data.receipt.events[0] || !data.receipt.events[0].args) {
                toast.error("No resolved complaints found!", {
                    id: notification
                })
            } else {
                toast.success("Fetched resolved complaints successfully!", {
                    id: notification
                })
            }

        } catch (err) {
            toast.error("Fetching resolved complaints Failed!", {
                id: notification
            })
            console.error("contract call failure", err);
        }
    }

    const getPendingApprovalComplaints = () => {
        setAllPendingComplaints([])
        getPendingApprovalIds()

    }

    const getPendingResolutionComplaints = () => {
        setAllPendingResolutionComplaints([])
        getPendingResolutionIds()

    }

    const getResolvedComplaints = () => {
        setAllResolvedComplaints([])
        getResolvedIds()

    }

    const handleSearch = async (e) => {
        e.preventDefault();

        setSearchedComplaint()

        const notification = toast.loading("Searching...")
        const data = await getComplaint({ args: [inputId] });
        console.log(data);
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

    const handleAdminPageButton = () => {
        navigate("/approvePending", {state: {uid: location.state.uid}});
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
            <h3 className=' ps-4 text-light' >Admin Page</h3>
            <div style={{flex: 'auto', paddingLeft: '10px'}}>
            <Button onClick = {handleAdminPageButton}>Approve Complaints</Button>
            <Button onClick = {handleResolutionButton}>Add Resolution</Button>
            <Button onClick = {handlePublicPageButton}>Public Page</Button>
            </div>
            <div className='pe-4'>
                <ConnectWallet accentColor='black' colorMode='light' /> 
            </div>
         </nav>
        <div className='d-flex flex-column align-items-center w-100 mt-5 '>
            <section className='w-50 shadow p-3 bg-white rounded'>
                <select className="custom-select w-100 mb-3 p-2 text-dark bg-light" value={selectedDropDown} onChange={(e) => setSelectedDropDown(e.target.value)}>
                    <option value="checkComplaint">Check Complaint Details</option>
                    <option value="addOfficer">Add Officer</option>
                    <option value="getAllComplaints">Get All Complaints</option>
                    <option value="getPendingApprovalComplaints">Get Pending Approval Complaints</option>
                    <option value="getPendingResolutionComplaints">Get Pending Resolution Complaints</option>
                    <option value="getResolvedComplaints">Get Resolved Complaints</option>
                </select>
                {selectedDropDown == "checkComplaint" ? (
                    <form className='d-flex align-items-center flex-column'>
                        <div className="mb-3 w-100">
                            <div className='w-100'>
                                <label htmlFor="name" className="w-100 form-label d-flex justify-content-start">Check Complaint Details</label>
                            </div>
                            <input type="text" className="form-control" id="name" placeholder="Enter Complaint ID" value={inputId} onChange={(e) => setInputId(e.target.value)} />
                        </div>
                        <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                    </form>
                ) : selectedDropDown == "addOfficer" ? (
                    <form className='d-flex align-items-center flex-column'>
                        <div className="mb-3 w-100">
                            <div className='w-100'>
                                <label htmlFor="name" className="w-100 form-label d-flex justify-content-start">Add Officer Address</label>
                            </div>
                            <input type="text" className="form-control" id="name" placeholder="Enter officer metamask address" value={officer} onChange={(e) => setofficer(e.target.value)} />
                        </div>
                        <button className='btn btn-primary pe-4 ps-4' onClick={addOfficer}>Add</button>
                    </form>
                ) : selectedDropDown == "getAllComplaints" ? (
                    <div className='d-flex align-items-center flex-column'>
                        <button className='btn btn-primary pe-4 ps-4' onClick={getComplaints}>Search</button>
                    </div>
                ) : selectedDropDown == "getPendingApprovalComplaints" ? (
                    <div className='d-flex align-items-center flex-column'>
                        <button className='btn btn-primary pe-4 ps-4' onClick={getPendingApprovalComplaints}>Search</button>
                    </div>
                ) : selectedDropDown == "getPendingResolutionComplaints" ? (
                    <div className='d-flex align-items-center flex-column'>
                        <button className='btn btn-primary pe-4 ps-4' onClick={getPendingResolutionComplaints}>Search</button>
                    </div>
                ) : (
                    <div className='d-flex align-items-center flex-column'>
                        <button className='btn btn-primary pe-4 ps-4' onClick={getResolvedComplaints}>Search</button>
                    </div>
                )}
            </section>
        </div>
        {searchedComplaint && user ?  
        <div className='d-flex flex-column align-items-center mt-5'>
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
                        <span style={{fontWeight: "bold"}}>Status: </span> {searchedComplaint.isResolved ? "Closed" : searchedComplaint.isApproved ? "Approved" : !searchedComplaint.exists ? "Declined" : "Pending Approval"}
                    </Card.Text>
                    {searchedComplaint.isApproved ? "" : (
                    <div className='d-flex'>
                            <button className='btn btn-primary flex-fill me-2' onClick={handleApprove}>Approve</button>
                            <button className='btn btn-danger flex-fill' onClick={handleDecline}>Decline</button>
                    </div>
                    )}
                </div>
            </div>
        </div>
        : ""}
        {allComplaints.length > 1 ? 
        <div className='d-flex flex-column align-items-center mt-5'>
        <h3>All Complaint</h3>
        {allComplaints.map((complaint, index) => {
            return (
                complaint.length > 1 ? 
                    <div className='w-50' style={{ margin: '1rem' , color: "black"}}  key={index}>
                        <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                            <div className='w-100 d-flex justify-content-between'>
                                <Card.Title>{complaint.title}</Card.Title>
                                <div>
                                    <span style={{fontWeight: "bold"}}>ID: {parseInt(complaint.id._hex, 16)}</span>
                                </div>
                            </div>
                            <Card.Subtitle className="mb-2 mt-1 text-muted">{complaint.description}</Card.Subtitle>
                            <Card.Text className='mt-4'>
                                <span style={{fontWeight: "bold"}}>Remarks: </span>
                                <div>
                                    {complaint.resolutionRemark.map((remark, index) => {
                                        return (
                                            <div key={index} className='d-flex flex-row justify-content-between mt-2'>
                                                <span className='fw-light'>{remark}</span>
                                                <span className='fw-lighter me-4'>{complaint.resolutionDates[index]}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card.Text>
                            <Card.Text>
                                <span style={{fontWeight: "bold"}}>Status: </span> {complaint.isResolved ? "Closed" : complaint.isApproved ? "Approved" : "Pending Approval"}
                            </Card.Text>
                        </div>
                    </div>
                : ""
            )
        })}
        </div>
        : ""}
        {allPendingComplaints.length > 1 ? 
        <div className='d-flex flex-column align-items-center mt-5'>
        <h3>Pending Approval Complaint</h3>
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
        {allPendingResolutionComplaints.length > 1 ? 
        <div className='d-flex flex-column align-items-center mt-5'>
        <h3>Pending Resolution Complaint</h3>
        {allPendingResolutionComplaints.map((pendingComplaint, index) => {
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
                                <span style={{fontWeight: "bold"}}>Status: </span> {pendingComplaint.isResolved ? "Resolved" : !pendingComplaint.exists ? "Closed" : "Pending Resolution"}
                            </Card.Text>
                        </div>
                    </div>
                : ""
            )
        })}
        </div>
        : ""}
        {allResolvedComplaints.length > 1 ? 
        <div className='d-flex flex-column align-items-center mt-5'>
        <h3>Resolved Complaint</h3>
        {allResolvedComplaints.map((resolvedComplaint, index) => {
            return (
                resolvedComplaint.length > 1 ? 
                    <div className='w-50' style={{ margin: '1rem' , color: "black"}}  key={index}>
                        <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                            <div className='w-100 d-flex justify-content-between'>
                                <Card.Title>{resolvedComplaint.title}</Card.Title>
                                <div>
                                    <span style={{fontWeight: "bold"}}>ID: {parseInt(resolvedComplaint.id._hex, 16)}</span>
                                </div>
                            </div>
                            <Card.Subtitle className="mb-2 mt-1 text-muted">{resolvedComplaint.description}</Card.Subtitle>
                            <Card.Text className='mt-4'>
                                <span style={{fontWeight: "bold"}}>Remarks: </span>
                                <div>
                                    {resolvedComplaint.resolutionRemark.map((remark, index) => {
                                        return (
                                            <div key={index} className='d-flex flex-row justify-content-between mt-2'>
                                                <span className='fw-light'>{remark}</span>
                                                <span className='fw-lighter me-4'>{resolvedComplaint.resolutionDates[index]}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card.Text>
                            <Card.Text>
                                <span style={{fontWeight: "bold"}}>Status: </span> {resolvedComplaint.isResolved ? "Resolved" : !resolvedComplaint.exists ? "Closed" : "Pending Resolution"}
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

export default Admin