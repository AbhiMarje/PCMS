import React, {useEffect, useState} from 'react';
import NavBar from './NavBar';
import { useContract, useContractWrite } from '@thirdweb-dev/react';
import toast from "react-hot-toast";
import Card from 'react-bootstrap/Card';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from './FirebaseInit';

const PublicPage = () => {
    
  const [inputId, setInputId] = useState("");
  const [user, setUser] = useState();
  const [allComplaints, setAllComplaints] = useState([]);
  const [searchedComplaint, setSearchedComplaint] = useState();
  const [selectedDropDown, setSelectedDropDown] = useState("checkComplaint");
  const { contract } = useContract("0x20Ad6764b9C021410F2CF518D2537FC2bBCfa336");
  const { mutateAsync: getComplaint } = useContractWrite(contract, "getComplaint");
  const { mutateAsync: getAllComplaints } = useContractWrite(contract, "getAllComplaints");

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

    const notification = toast.loading("Searching...")
    const data = await getComplaint({ args: [inputId] });
    console.log(data.receipt.events[0].args[0]);
    console.log(data.receipt.events[0].args[0].complaintRegisteredBy)
    setSearchedComplaint(data.receipt.events[0].args[0]);

    getUserData(data.receipt.events[0].args[0].complaintRegisteredBy)

    toast.success("Searched successfully!", {
        id: notification
    })
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
 
  useEffect(() => {
    // const getComplaintIds = async () => {
    //     try {    
    //         const data = await getAllComplaints([]);
    //         console.info("contract call success ", data.receipt.events);
    //     } catch(err) {
    //         console.log(err);
    //         return;
    //     }
    // }
    
    //   getComplaintIds();
  }, [])
  
  return (
    <>
        <NavBar title = {"Public Page"} hideWallet = {false}/>
        <div className='d-flex flex-column align-items-center w-100 mt-5 '>
            <section className='w-50 shadow p-3 bg-white rounded'>
                <select className="custom-select w-100 mb-3 p-2 text-dark bg-light" value={selectedDropDown} onChange={(e) => setSelectedDropDown(e.target.value)}>
                    <option value="checkComplaint">Check Complaint Details</option>
                    <option value="getAllComplaints">Get All Complaints</option>
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
                ) : selectedDropDown == "getAllComplaints" ? (
                    <div className='d-flex align-items-center flex-column'>
                        <button className='btn btn-primary pe-4 ps-4' onClick={getComplaints}>Search</button>
                    </div>
                ) : ""}
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
                        <span style={{fontWeight: "bold"}}>Status: </span> {searchedComplaint.isApproved ? "Approved" : !searchedComplaint.exists ? "Declined" : "Pending Approval"}
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
                                <span style={{fontWeight: "bold"}}>Status: </span> {complaint.isApproved ? "Approved" : !complaint.exists ? "Closed" : "Pending Approval"}
                            </Card.Text>
                        </div>
                    </div>
                : ""
            )
        })}
        </div>
        : ""}
    </>
  )
}

export default PublicPage