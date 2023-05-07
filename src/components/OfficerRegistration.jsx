import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './FirebaseInit'
import { db } from './FirebaseInit'
import { doc, setDoc } from 'firebase/firestore'
import NavBar from './NavBar'

const OfficerRegistration = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [dob, setDob] = useState('')
    const [phone, setPhone] = useState('')
    const [post, setPost] = useState('')
    const [station, setStation] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (name.trim().length !==0 || password.trim().length !==0 || email.trim().length !==0 || dob.trim().length !==0 
        || phone.trim().length !==0 || post.trim().length !==0 || station.trim().length !==0) {

            await createUserWithEmailAndPassword(auth, email, password)
            .then( async (userCredential) => {
                    const officer = userCredential.user
                    console.log(officer)
                    await setDoc(doc(db, 'officers', officer.uid), {
                        uid: officer.uid,
                        type: "officer",
                        name: name,
                        email: email,
                        dob: dob,
                        phone: phone,
                        post: post,
                        station: station
                    })
                    alert('Registration Successful')
                })
            .catch((error) => {
                    alert(error.message)
                })
        } else {
            alert('Please fill all fields')
        }
    }

  return (
    <div>
        <NavBar />
        <div className='vh-100 vw-100 d-flex justify-content-center'>
        <div className='w-25 mt-5 '>
            <form>
            <div className="mb-3">
                <label htmlFor="name" className="form-label d-flex justify-content-start">Full Name</label>
                <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="phone" className="form-label d-flex justify-content-start">Phone No.</label>
                <input type="number" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="dob" className="form-label d-flex justify-content-start">DOB</label>
                <input type="date" className="form-control" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="station" className="form-label d-flex justify-content-start">Station</label>
                <input type="text" className="form-control" id="station" value={station} onChange={(e) => setStation(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="post" className="form-label d-flex justify-content-start">Post</label>
                <input type="text" className="form-control" id="post" value={post} onChange={(e) => setPost(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label d-flex justify-content-start">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label d-flex justify-content-start">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    </div>
    </div>
  )
}

export default OfficerRegistration