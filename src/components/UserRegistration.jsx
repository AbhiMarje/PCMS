import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './FirebaseInit'
import { db } from './FirebaseInit'
import { doc, setDoc } from 'firebase/firestore'
import NavBar from './NavBar'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { ConnectWallet } from '@thirdweb-dev/react'

const UserRegistration = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [dob, setDob] = useState('')
    const [gender, setGender] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [aadhaar, setAadhaar] = useState('')
    const [station, setStation] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (name.trim().length !==0 || password.trim().length !==0 || email.trim().length !==0 || dob.trim().length !==0 
        || gender.trim().length !==0 || phone.trim().length !==0 || address.trim().length !==0 || aadhaar.trim().length !==0 || station.trim().length !==0) {

            const notification = toast.loading("Please wait...");
            await createUserWithEmailAndPassword(auth, email, password)
            .then( async (userCredential) => {
                    const user = userCredential.user
                    console.log(user)
                    await setDoc(doc(db, 'users', user.uid), {
                        uid: user.uid,
                        name: name,
                        email: email,
                        dob: dob,
                        gender: gender,
                        phone: phone,
                        address: address,
                        aadhaar: aadhaar,
                        station: station,
                        complaints: [],
                        metamaskId: "",
                        type: "user"
                    })

                    toast.success(`Resgistration successfull!`, {
                        id: notification,
                    });
                    navigate('/')
                })
            .catch((error) => {
                toast.error("Whoops, something went wrong!", {
                    id: notification,
                });
            })
        } else {
            alert('Please fill all fields')
        }
    }

    const handlePublicPageButton = () => {
        navigate("/publicPage")
    }

  return (
    <div>
         <nav className="navbar navbar-dark bg-primary">
            <h3 className=' ps-4 text-light' >User Registration</h3>
            <Button onClick={handlePublicPageButton}>Public Page</Button>
            <div className='pe-4'>
                <ConnectWallet accentColor='black' colorMode='light' /> 
            </div>
        </nav>
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
                <label htmlFor="gender" className="form-label d-flex justify-content-start">Gender</label>
                <input type="text" className="form-control" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="address" className="form-label d-flex justify-content-start">Address</label>
                <input type="text" className="form-control" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="aadhaar" className="form-label d-flex justify-content-start">Aadhaar Number</label>
                <input type="text" className="form-control" id="aadhaar" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="station" className="form-label d-flex justify-content-start">Nearest Police Station</label>
                <input type="text" className="form-control" id="station" value={station} onChange={(e) => setStation(e.target.value)} />
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

export default UserRegistration