import React from 'react';
import Card from 'react-bootstrap/Card';

const PendingComplaints = ({pendingComplaintsList}) => {
  return (
    <>
        {
            pendingComplaintsList.map((pendingComplaint) => 
                    <Card style={{ width: '30rem', margin: '2rem' , color: "black"}} key = {pendingComplaint.id}>
                    <Card.Body>
                        <Card.Title>{pendingComplaint.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{pendingComplaint.description}</Card.Subtitle>
                        <Card.Text>
                            <span style={{fontWeight: "bold"}}>ID: </span> {pendingComplaint.id}
                        </Card.Text>
                        <Card.Text>
                            <span style={{fontWeight: "bold"}}>Status: </span> {pendingComplaint.status}
                        </Card.Text>
                        <Card.Text>
                            <span style={{fontWeight: "bold"}}>Remarks: </span> {pendingComplaint.remarks}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )
        }
    </>
  )
}

export default PendingComplaints