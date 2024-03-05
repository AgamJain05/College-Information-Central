import InputBox from "../components/InputBox";
import AnimationWrapper from "../common/pageanimation";
const UserAuthForm = ({ type }) => {
    return (
        <AnimationWrapper>
        <section className="h-screen flex items-center justify-center">
            <form className="w-[80%] max-w-[400px] mx-auto">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == "sign-in" ? "Welcome Back" : "join us today!"}
                </h1>
                {type == "sign-up" ?
                    <InputBox
                        name="username"
                        type="text"
                        placeholder="Full Name"
                        icon="fi-rr-user"
                    /> : ""}

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
                <button className="btn-dark center mt-14" type="submit">
                    {type.replace("-", " ")}
                </button>

                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" /> </div>
                    <button className="btn-dark mx-auto block">
    {type.replace("-", " ")} with Google
</button>


                <div>
                    {type == "sign-in" ?
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
        
    )
}

export default UserAuthForm;