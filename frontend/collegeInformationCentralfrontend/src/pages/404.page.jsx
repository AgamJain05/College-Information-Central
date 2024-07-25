import { Link } from "react-router-dom";
import { useContext } from "react";
import lightPageNotFoundImg from "../imgs/404-light.png";
import darkPageNotFoundImg from "../imgs/404-dark.png";
import lightFullLogo from "../imgs/full-logo-light.png";
import darkFullLogo from "../imgs/full-logo-dark.png";
import { ThemeContext } from "../App";
const PageNotFound = () => {

    let { theme } = useContext(ThemeContext);

    return (
        <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
            <img src={ theme == "light" ? darkPageNotFoundImg : lightPageNotFoundImg } className="select-none border-2 border-grey w-72 aspect-square object-cover rounded" />
            <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
            <p className="text-dark-grey text-xl leading-7 -mt-8">The page you are looking for does not exist
            <br />
            <br />
                <Link to="/" className="bg-black text-white py-4 px-5 rounded hover:bg-gray-800 transition-colors duration-300 m-2">
                    Home
                </Link>
            </p>
            <div className="mt-auto">
                <img src={ theme == "light" ? darkFullLogo : lightFullLogo } className="h-8 object-contain block mx-auto select-none" />
                <p className="mt-5 text-dark-grey">Read millions of stories around the college</p>
            </div>
        </section>
    );
}

export default PageNotFound;