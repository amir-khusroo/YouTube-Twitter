import React, { useState } from 'react';
import axios from "axios"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Login = ({ authToken, setAuthToken }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleOnChange = (event) => {
        setFormData((currData) => {
            return { ...currData, [event.target.name]: event.target.value }
        })
    }
    const navigate=useNavigate();
    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            axios.post("/api/user/login", formData).then((resp)=>{
                console.log(resp.data.data)
                localStorage.setItem('accessToken', resp.data.data.accessToken);
                setAuthToken(resp.data.data.accessToken);
            })
            navigate('/post');
        }
        catch (err) {
            if(err & err.status==401){
                console.log("Unauthorized")
            }
            console.log(err)
        }
        setFormData({
            email: "",
            password: "",
        })
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            name='email'
                            value={formData.email}
                            onChange={handleOnChange}
                            placeholder="Email or Username"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleOnChange}
                            placeholder="Password"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="mt-6 text-center text-2xl">
                        <a
                            href="#"
                            className="text-indigo-600 hover:underline text-sm"
                        >
                            New User registration
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
