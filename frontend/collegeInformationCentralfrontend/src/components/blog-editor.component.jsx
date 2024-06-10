import { Link } from 'react-router-dom';
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/pageanimation";
import defaultBanner from "../imgs/blog banner.png";
import { EditorContext } from '../pages/editor.pages';
import { useContext } from 'react';
import EditorJS from '@editorjs/editorjs';
import { useEffect } from "react";
import Tools from './tools.components';
import toast, { Toaster } from 'react-hot-toast';

import axios from 'axios';
import { Usercontext } from '../App';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';


const BlogEditor = () => {

    

    let {blog ,blog:{title ,des, content, banner , tags}, setBlog ,textEditor ,setTextEditor ,setEditorState} = useContext(EditorContext);
    let {userAuth:{access_token}} = useContext(Usercontext);  
    let { blog_id } = useParams();
    let navigate = useNavigate();
    const handleFileChange = (e) => {
        console.log(e)
    };

    useEffect(() => {
        if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holderId: "texteditor",
                data: Array.isArray(content) ? content[0] : content,
                placeholder: "Start writing your blog here",
                tools: Tools
            }))
        }
        
    }, []);
const handleOnKeyDown = (e) => {
    console.log(e)
    if (e.key === 13) {
        e.preventDefault();
    }
}
const handleTitlechange = (e) => {
    let input = e.target
    input.style.height  = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({...blog, title: input.value});
}

const handlePublishButton = () => {
    if(!title.length) {
        return toast.error("Title is required");
    }
    if(textEditor.isReady) {

        textEditor.save().then((outputData) => {
            if(outputData.blocks.length){
                setBlog({...blog, content: outputData});
                setEditorState("publish");
            }
            else{
                return toast.error("Write something in your blog to publish it.");
            }
            
        })
        .catch((error) => {
            console.log("Saving failed: ", error);
        });
    }
}

const handleSaveDraft = (e) => {
    if(e.target.className.includes("disable")) {
        return;
      };
    if(!title.length){
        console.log('title is empty');
        return toast.error("Write Blog Title before saving as a draft");
      }
     
      let loadingToast = toast.loading("Saving Draft ...");
  
      e.target.classList.add('disable')
      
      if(textEditor.isReady) {
        
        textEditor.save().then((content) => {
            let blogObj = {
                title, banner, des, tags, content , draft: true
              };
              axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(() => {
                  e.target.classList.remove('disable')
                  toast.dismiss(loadingToast);
                  toast.success("Saved as Draft");
          
                  setTimeout(() => {
                    navigate("/")
                  }, 500);
                  
                })
                .catch(({ response }) => {
                  e.target.classList.remove('disable')
                  toast.dismiss(loadingToast);
                  return toast.error(response.data.error);
                  
              })
        })
      }

      
  
      
}
    return (
        <>
            <Toaster />
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo} />
                </Link>
                <p className=" text-black line-clamp-1 w-full"> 
                { title.length ?  title : "Untitled" }
                </p>
                <div className="flex gap-4 ml-auto"> 
                    <button className="btn-dark py-2" onClick={handlePublishButton}>
                        Publish
                    </button>
                    <button className="btn-light py-2" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper> 
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner">
                                <img src={defaultBanner} className="z-20" />
                                <input 
                                    id="uploadBanner"
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                        <textarea defaultValue={title} placeholder="Blog Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40" onKeyDown={handleOnKeyDown} onChange={handleTitlechange}></textarea>

                        <div id="texteditor" className="font-gelasio">

                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor;