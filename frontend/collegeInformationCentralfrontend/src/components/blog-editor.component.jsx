import { Link, useNavigate, useParams } from "react-router-dom";
import AnimationWrapper from "../common/pageanimation"
import lightLogo from "../imgs/logo-light.png";
import darkLogo from "../imgs/logo-dark.png";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { ThemeContext } from "../App";
import Tools from './tools.components';
import axios from "axios";
import { Usercontext } from "../App";
// import { ThemeContext, UserContext } from "../App";

const BlogEditor = () => {

    let { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext)

    let { userAuth: { access_token } } = useContext(Usercontext)
    // let { theme } = useContext(ThemeContext);
    let { blog_id } = useParams();

    let navigate = useNavigate();
    let { theme } = useContext(ThemeContext);
   

    // useEffect

    useEffect(() => {
        if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: Tools,
                placeholder: "Let's write an awesome story"
            }))
        }
    }, [])
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select an image to upload.");
            return;
        }
    

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "casstvuv");
        data.append("cloud_name", "dh05cgeok");
        data.append("folder", "college");
    
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dh05cgeok/image/upload`, {
                method: "POST",
                body: data
            });
    
            const cloudData = await res.json();
            toast.success("Image Uploaded Successfully");
            setBlog(prevBlog => ({ ...prevBlog, banner: cloudData.url }));
        } catch (error) {
            toast.error("Image Upload Failed");
        }
    };

    // const handleBannerUpload = (e) => {
    //     let img = e.target.files[0];

    //     if(img){

    //         let loadingToast = toast.loading("Uploading...")

    //         uploadImage(img).then((url) => {
    //             if(url){

    //                 toast.dismiss(loadingToast);
    //                 toast.success("Uploaded 👍");

    //                 setBlog({ ...blog, banner: url })

    //             }
    //         })
    //         .catch(err => {
    //             toast.dismiss(loadingToast);
    //             return toast.error(err);
    //         })
    //     }
    // }

    const handleTitleKeyDown = (e) => {
        if(e.keyCode == 13) { // enter key
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = 'auto';
        input.style.height = input.scrollHeight + "px";

        setBlog({ ...blog, title: input.value })
    }

    // const handleError = (e) => {
    //     let img = e.target;

    //     img.src = theme == "light" ? lightBanner : darkBanner;
    // }

    const handlePublishEvent = () => {
        
        if(!banner.length){
            return toast.error("Upload a blog banner to publish it")
        }

        if(!title.length){
            return toast.error("Write blog title to publish it")
        }

        if(textEditor.isReady){
            textEditor.save().then(data => {
                if(data.blocks.length){
                    setBlog({ ...blog, content: data });
                    setEditorState("publish")
                } else{
                    return toast.error("Write something in your blog to publish it")
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }

    }

    const handleSaveDraft = (e) => {

        if(e.target.className.includes("disable")) {
            return;
        }

        if(!title.length){
            return toast.error("Write blog title before saving it as a draft")
        }

        let loadingToast = toast.loading("Saving Draft....");

        e.target.classList.add('disable');

        if(textEditor.isReady){
            textEditor.save().then(content => {

                let blogObj = {
                    title, banner, des, content, tags, draft: true
                }

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                .then(() => {
                    
                    e.target.classList.remove('disable');
        
                    toast.dismiss(loadingToast);
                    toast.success("Saved 👍");
        
                    setTimeout(() => {
                        navigate("/dashboard/blogs?tab=draft")
                    }, 500);
        
                })
                .catch(( { response } ) => {
                    e.target.classList.remove('disable');
                    toast.dismiss(loadingToast);
        
                    return toast.error(response.data.error)
                })

            })
        }
    }
    const handleError = (e) => {
        let img = e.target;

        img.src = theme == "light" ? lightBanner : darkBanner;
    }
    return (
        <>
            <nav className="navbar">
            <Link to="/" className="flex-none w-10">
                    <img src={ theme == "light" ? darkLogo : lightLogo } />
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    { title.length ? title : "New Blog" }
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className="btn-dark py-2"
                        onClick={handlePublishEvent}
                    >
                        Publish
                    </button>
                    <button className="btn-light py-2"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                         

                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img 
                                    src={banner}
                                    className="z-20"
                                    onError={handleError}
                                    // onError={handleError}
                                />
                                <input 
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>

                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;








// import { Link } from 'react-router-dom';
// import logo from "../imgs/logo.png";
// import AnimationWrapper from "../common/pageanimation";
// import defaultBanner from "../imgs/blog banner.png";
// import { EditorContext } from '../pages/editor.pages';
// import { useContext } from 'react';
// import EditorJS from '@editorjs/editorjs';
// import { useEffect } from "react";
// import Tools from './tools.components';
// import toast, { Toaster } from 'react-hot-toast';
// import axios from 'axios';
// import { Usercontext } from '../App';
// import { useNavigate } from "react-router-dom";
// import { useParams } from 'react-router-dom';
// import { useState } from 'react';


// const BlogEditor = () => {

    
    
    
//     let {blog ,blog:{title ,des, content, banner , tags}, setBlog ,textEditor ,setTextEditor ,setEditorState} = useContext(EditorContext);
//     let {userAuth:{access_token}} = useContext(Usercontext);  
//     let { blog_id } = useParams();
//     let navigate = useNavigate();
    
//     const [image, setImage] = useState(null);
//     const [url, setUrl] = useState('');
//     // const handleFileChange = (e) => {
//     //     console.log(e)
//     // };

//     useEffect(() => {
//         if(!textEditor.isReady){
//             setTextEditor(new EditorJS({
//                 holderId: "texteditor",
//                 data: Array.isArray(content) ? content[0] : content,
//                 placeholder: "Start writing your blog here",
//                 tools: Tools
//             }))
//         }
        
//     }, []);

  
//     const handleBannerUpload = async () => {
//       const data = new FormData();
//       data.append("file", image);
//       data.append("upload_preset", "dh05cgeok");
//       data.append("cloud_name", "dbyoondqs");
  
//       try {
//         if(image === null){
//           return toast.error("Please Upload image")
//         }
  
//         const res = await fetch('https://api.cloudinary.com/v1_1/dbyoondqs/image/upload',{
//           method : "POST",
//           body : data
//         })
  
//         const cloudData = await res.json();
//     toast.success("Image Uploaded Successfully");
//     setBlog(prevBlog => ({ ...prevBlog, banner: cloudData.url }));
//   } catch (error) {
//     toast.error("Image Upload Failed");
//   }
// };
  
//     console.log(url)
   
// const handleOnKeyDown = (e) => {
//     console.log(e)
//     if (e.key === 13) {
//         e.preventDefault();
//     }
// }
// const handleTitlechange = (e) => {
//     let input = e.target
//     input.style.height  = "auto";
//     input.style.height = input.scrollHeight + "px";

//     setBlog({...blog, title: input.value});
// }

// const handlePublishButton = () => {
//     if(!title.length) {
//         return toast.error("Title is required");
//     }
//     if(textEditor.isReady) {

//         textEditor.save().then((outputData) => {
//             if(outputData.blocks.length){
//                 setBlog({...blog, content: outputData});
//                 setEditorState("publish");
//             }
//             else{
//                 return toast.error("Write something in your blog to publish it.");
//             }
            
//         })
//         .catch((error) => {
//             console.log("Saving failed: ", error);
//         });
//     }
// }

// const handleSaveDraft = (e) => {
//     if(e.target.className.includes("disable")) {
//         return;
//       };
//     if(!title.length){
//         console.log('title is empty');
//         return toast.error("Write Blog Title before saving as a draft");
//       }
     
//       let loadingToast = toast.loading("Saving Draft ...");
  
//       e.target.classList.add('disable')
      
//       if(textEditor.isReady) {
        
//         textEditor.save().then((content) => {
//             let blogObj = {
//                 title, banner, des, tags, content , draft: true
//               };
//               axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
//                 headers: {
//                     'Authorization': `Bearer ${access_token}`
//                 }
//             })
//                 .then(() => {
//                   e.target.classList.remove('disable')
//                   toast.dismiss(loadingToast);
//                   toast.success("Saved as Draft");
          
//                   setTimeout(() => {
//                     navigate("/")
//                   }, 500);
                  
//                 })
//                 .catch(({ response }) => {
//                   e.target.classList.remove('disable')
//                   toast.dismiss(loadingToast);
//                   return toast.error(response.data.error);
                  
//               })
//         })
//       }

      
  
      
// }
//     return (
//         <>
//             <Toaster />
//             <nav className="navbar">
//                 <Link to="/" className="flex-none w-10">
//                     <img src={logo} />
//                 </Link>
//                 <p className=" text-black line-clamp-1 w-full"> 
//                 { title.length ?  title : "Untitled" }
//                 </p>
//                 <div className="flex gap-4 ml-auto"> 
//                     <button className="btn-dark py-2" onClick={handlePublishButton}>
//                         Publish
//                     </button>
//                     <button className="btn-light py-2" onClick={handleSaveDraft}>
//                         Save Draft
//                     </button>
//                 </div>
//             </nav>

//             <AnimationWrapper> 
//                 <section>
//                 <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
//                         <label htmlFor="uploadBanner">
//                             <img src={banner} className="z-20" onError={(e) => e.target.src = 'defaultImageURL'} />
//                             <input
//                                 id="uploadBanner"
//                                 type="file"
//                                 accept=".png, .jpg, .jpeg"
//                                 hidden
//                                 onChange={handleBannerUpload}
//                             />
//                         </label>
//                     </div>
//                         <textarea defaultValue={title} placeholder="Blog Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40" onKeyDown={handleOnKeyDown} onChange={handleTitlechange}></textarea>

//                         <div id="texteditor" className="font-gelasio">

//                         </div>
//                     </div>
//                 </section>
//             </AnimationWrapper>
//         </>
//     )
// }

// export default BlogEditor;



// const uploadImage = async (img) => {
    //     let formData = new FormData();
    //     formData.append('image', img);
    //     formData.append("upload-preset", "casstvuv");
    //     formData.append("cloud_name", "dh05cgeok");
    //     try {
    //         const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/upload", formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         return response.data.url;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // };
    

// const uploadImage = async (img) => {
//     let formData = new FormData();
//     formData.append("image", img);
//     formData.append("upload-preset", "casstvuv");
//     formData.append("cloud_name", "dh05cgeok");

//     try {
//         const response = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url", formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         return response.data.imageUrl;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };


 // const handleBannerUpload = (e) => {
    //     let img = e.target.files[0];
    
    //     if (img) {
    //         let loadingToast = toast.loading("Uploading...");
    
    //         uploadImage(img).then((url) => {
    //             if (url) {
    //                 toast.dismiss(loadingToast);
    //                 toast.success("Uploaded 👍");
    
    //                 setBlog({ ...blog, banner: url });
    //             }
    //         }).catch(err => {
    //             toast.dismiss(loadingToast);
    //             return toast.error(err.message);
    //         });
    //     }
    // };