import React, { useState } from 'react'

const SignUp = () => {
    const [userData, setuserData] = useState({ name: '', email: '', password: '' });
    async function handleSubmit() {
        let data = await fetch('http://localhost:3000/api/v1/users', {
            method: "POST",
            body: JSON.stringify(userData),
            headers: {
                'Content-Type': "application/json"
            }
        })

        let res = await data.json();

        if (res.stauts == 200) {
            localStorage.setItem('user', JSON.stringify(res.user));
        }
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log(res);
    }
    return (
        <>
            <h1>SIGN UP</h1>
            <input type="text" placeholder='name' onChange={(e) => {
                return setuserData((prev) => {
                    return { ...prev, name: e.target.value }
                })
            }} />
            <br />
            <br />
            <input type="text" placeholder='email' onChange={(e) => {
                return setuserData((prev) => {
                    return { ...prev, email: e.target.value }
                })
            }} />
            <br />
            <br />
            <input type="text" placeholder='password' onChange={(e) => {
                return setuserData((prev) => {
                    return { ...prev, password: e.target.value }
                })
            }} />
            <br />
            <br />
            <button onClick={handleSubmit}>Submit</button>
        </>
    )
}

export default SignUp