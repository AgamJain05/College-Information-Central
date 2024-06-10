import InputBox from "../components/InputBox";
import { useContext } from "react";
import AnimationWrapper from "../common/pageanimation";
import { Toaster, toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { authWithGoogle } from "../common/firebase";
import {storeInSession} from "../common/session";
import { Usercontext} from "../App";

import { set } from "mongoose";
const UserAuthForm = ({ type }) => {
   
    let {userAuth: {access_token} , setUserAuth} = useContext(Usercontext);
    console.log(access_token);
    const userAuthThroughServer = async (serverroute, formData) => {
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverroute, formData)
        .then(({data}) => {
            storeInSession("user", JSON.stringify(data));
            
            setUserAuth(data);
            
        })
        .catch(({response}) => {
            toast.error(response.data.error);
        });
            
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        let serverroute = type === "sign-in" ? "/signin" : "/signup";
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        let form = new FormData(formElement);
        let formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        let { fullname, email, password } = formData;
        // Form Validation
        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("Full Name must be at least 3 characters long");
            }
        }
        if (!email.length) {
            return toast.error("Enter Email");

        }
        if (!emailRegex.test(email)) {
            return toast.error("Invalid Email");

        }
        if (!password || password.length < 8) {
            return toast.error("Password must be at least 8 characters long");

        }
        if (!passwordRegex.test(password)) {
            return toast.error("Password must contain at least one uppercase, one lowercase, one number and one special character");

        }
        userAuthThroughServer(serverroute, formData);

        
    };
    const handleGoogleAuth = (e) => {
        e.preventDefault();
        authWithGoogle()
        .then((user) => {
            console.log(user);
            let serverroute = "/google-auth";
            let formData = {
                access_token: user.accessToken
            }
            console.log(formData);
            
            userAuthThroughServer(serverroute, formData);
        })
        .catch((err) => {
            toast.error('Trouble signing in with Google');
            return console.log(err);
        });
    }
    return (
        access_token ?
        <Navigate to="/" /> 
        :
        <AnimationWrapper>
            <section className="h-screen flex items-center justify-center">
                <Toaster />
                <form id="formElement" className="w-[80%] max-w-[400px] mx-auto" >
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type === "sign-in" ? "Welcome Back" : "join us today!"}
                    </h1>
                    {type === "sign-up" &&
                        <InputBox
                            name="fullname"
                            type="text"
                            id={"username"}
                            placeholder="Full Name"
                            icon="fi-rr-user"
                        />
                    }

                    <InputBox
                        name="email"
                        type="email"
                        id="email"
                        placeholder="Email"
                        icon="fi-rr-envelope"
                    />
                    <InputBox
                        name="password"
                        type="password"
                        id="password"
                        placeholder="Password"
                        icon="fi-rr-key"
                    />
                    <button className="btn-dark center mt-14"
                        type="submit" onClick={handleSubmit}>
                        {type.replace("-", " ")}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button className="btn-dark mx-auto block" onClick={handleGoogleAuth}>
                        {type.replace("-", " ")} with Google
                    </button>


                    <div>
                        {type === "sign-in" ?
                            <p className="text-center mt-4">
                                Don't have an account?
                                <a href="/signup" className="text-blue-500 underline"> Join us here</a>
                            </p> :
                            <p className="text-center mt-4">
                                Already have an account?
                                <a href="/signin" className="text-blue-500 underline"> Sign In here</a>
                            </p>}
                    </div>
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;
