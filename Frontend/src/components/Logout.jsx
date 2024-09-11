import React from 'react';
import axios from 'axios';
import { useNavigate ,Link} from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/user/logout').then((res)=>{
                console.log(res);
            })

            navigate('/login');
        } catch (err) {
            console.error(err.response.data.msg);
        }
    };

    return (
        <div className="flex items-center lg:order-2 " onClick={handleLogout}>
        <Link
            to="/logout"
            className="text-gray-800 hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none border border-blue-800"
        >
            Log out
        </Link>
    </div>
    );
};

export default Logout;
