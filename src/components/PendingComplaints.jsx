import React from 'react';
import Card from 'react-bootstrap/Card';

const PendingComplaints = ({pendingComplaintsList}) => {
  return (
    <>
        {
            pendingComplaintsList.map((pendingComplaint) => 
                    <div className='w-50' style={{ margin: '1rem' , color: "black"}} key = {pendingComplaint.id}>
                    <div className='w-100 shadow p-4 mb-1 bg-white rounded '>
                        <div className='w-100 d-flex justify-content-between'>
                            <Card.Title>{pendingComplaint.title}</Card.Title>
                            <div>
                                <span style={{fontWeight: "bold"}}>ID: {pendingComplaint.id}</span>
                            </div>
                        </div>
                        <Card.Subtitle className="mb-2 mt-1 text-muted">{pendingComplaint.description}</Card.Subtitle>
                        <Card.Text className='mt-4'>
                            <span style={{fontWeight: "bold"}}>Remarks: </span> {pendingComplaint.remarks}
                        </Card.Text>
                        <Card.Text>
                            <span style={{fontWeight: "bold"}}>Status: </span> {pendingComplaint.status}
                        </Card.Text>
                    </div>
                </div>
            )
        }
    </>
  )
}

export default PendingComplaints