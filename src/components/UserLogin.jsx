import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from './FirebaseInit'
import { signInWithEmailAndPassword } from 'firebase/auth'
import NavBar from './NavBar'
import toast from 'react-hot-toast'

const UserLogin = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.trim().length !==0 || email.trim().length !==0) {

            const notification = toast.loading("Please wait...");
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                    const user = userCredential.user
                    toast.success(`Login successfull!`, {
                        id: notification,
                    });
                   
                    navigate('/fileComplaint', {state: {uid: user.uid}});
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

  return (
    <div>
       <NavBar title = {"User Login"} hideWallet = {true}/>
        <div className='vh-100 vw-100 d-flex justify-content-center'>
            <div className='w-25 mt-5'>
                <form>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label d-flex justify-content-start">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label d-flex justify-content-start">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <a href="/officerLogin" className="d-flex justify-content-start">Not an user? Login as an officer.</a>
                <a href="/userRegistration" className="d-flex mt-1 justify-content-start">New User? Create account.</a>
                <button type="submit" className="btn btn-primary mt-3" onClick={handleSubmit}>Login</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default UserLogin