// import { useState } from "react"
// const InputBox = ({ name, type, id, value, placeholder, icon }) => {
//   const [passwordVisible, setPasswordVisible] = useState(false)
//   return (
//     <div className="relative w-[100%] mb-4">
//       <input
//         name={name}
//         type={type == "password" ? passwordVisible ? "text" : "password" : type}
//         placeholder={placeholder}
//         defaultValue={value}
//         id={id}


//         className="input-box"
//       />
//       <i className={"fi " + icon + " input-icon"}></i>
//       {
//         type == "password" ?
//           <i className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
//             onClick={() => setPasswordVisible(currentVal => !currentVal)}>
//           </i> : ""
//       }
//     </div>
//   )

// }
// export default InputBox


import { useState, useEffect } from "react";

const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [mouseY, setMouseY] = useState(0);

    const handleMouseMove = (event) => {
        setMouseY(event.clientY);
    };

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const rotationRange = 8;
    const rotationAngle = (mouseY / window.innerHeight) * rotationRange - rotationRange / 2;

    return (
        <div className="relative w-[100%] mb-4">
            <input
                name={name}
                type={type === "password" ? (passwordVisible ? "text" : "password") : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                disabled={disable}
                className="input-box pr-12" // Add padding to the right for the icon
            />

            <i className={"fi " + icon + " input-icon"}></i>

            {type === "password" && (
                <>
                    <i
                        className={
                            "fi fi-rr-eye" +
                            (!passwordVisible ? "-crossed" : "") +
                            " input-icon left-[auto] right-4 cursor-pointer"
                        }
                        onClick={() => setPasswordVisible((currentVal) => !currentVal)}
                    ></i>
                    <div
                        className={`beam absolute top-1/2 right-0 transform translate-y-[-50%] ${
                            passwordVisible ? "on" : ""
                        }`}
                        style={{ transform: `translate(0%, -50%) rotate(${-rotationAngle}deg)` }}
                    ></div>
                </>
            )}
        </div>
    );
};

export default InputBox;
