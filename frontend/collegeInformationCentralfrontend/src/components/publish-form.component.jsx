import { useContext } from "react"
import AnimationWrapper from "../common/pageanimation"
import toast, { Toaster } from 'react-hot-toast';
import { EditorContext } from "../pages/editor.pages"
import Tag from "./tags.component"
import { Usercontext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
const PublishForm = () => {
  let characterLimit = 100;
  let tagLimit = 5;
  let { blog_id } = useParams();
  let { blog , blog: { banner, title, tags, des , content}, setEditorState, setBlog } = useContext(EditorContext);
  let {userAuth :{ access_token} } = useContext(Usercontext);
  let navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  }

  const handleBlogTitleChange = (e) => {
    let input = e.target.value;
    setBlog({ ...blog, title: input });
  }

  const handleBlogDesChange = (e) => {
    setBlog({ ...blog, des: e.target.value });
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
        e.preventDefault();
        let tag = e.target.value;
        console.log(tag)
        if (tags.length < tagLimit) {
            if (!tags.includes(tag) && tag.length) {
                setBlog({ ...blog, tags: [...tags, tag] });
            }
        }
        e.target.value = "";
    }
  };
  const publishBlog = (e) => {

    if(e.target.className.includes("disable")) {
      return;
    };
    if(!title.length){
      return toast.error("Blog Title is required");
    }
    if(!des.length || des.length > characterLimit){
      return toast.error("Description is required and should be atleast 100 characters long");
    }
    if(!tags.length){
      return toast.error("Tags are required");
    }
    let loadingToast = toast.loading("Publishing ...");

    e.target.classList.add('disable')

    let blogObj = {
      title, banner, des, tags, content , draft: false
    };

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
      headers: {
          'Authorization': `Bearer ${access_token}`
      }
  })
      .then(() => {
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        toast.success("Blog Published");

        setTimeout(() => {
          navigate("/")
        }, 500);
        
      })
      .catch(({ response }) => {
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast);
        return toast.error(response.data.error);
        
    })

  }

  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleCloseEvent}>
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-19 bg-grey mt-4 overflow-hidden">
            <img src={banner} alt="banner" />
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
            {title}
          </h1>
          <p className="line-clamp-2 font font-gelasio  text-xl leading-7 mt-4">
            {des}
          </p>
        </div>

        <div className="border-grey lg:border-1 lg:pl-8">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p> 
          <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4" onChange={handleBlogTitleChange} />
          <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>

          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className="h-40 resize-none leading-7 input-box pl-4"
            onChange={handleBlogDesChange}
          />

          <p className="text-dark-grey mt-2 mb-1 text-right">{characterLimit - des.length} Characters left</p>
          <p className="text-dark-grey mb-2 mt-9 ">
            Topics-(Helps in searching your blog and ranking of your post)
          </p>
          <div className="relative input-box p1-2 py-2 pb-4">
            <input type="text" placeholder="Topic"
              className="sticky input-box bg-white top-left-0 pl-4 mb-3 focus:bg-white" 
              onKeyDown={handleKeyDown} />
           { tags.map((tag, i) => {
            return <Tag tag={tag} tagsIndex={i} key={i} />
             })
           }
           
          </div>
          <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - tags.length} Tags left</p>
          <button className="btn-dark px-8" onClick={publishBlog}>
            Publish
          </button>
        </div>

        
      </section>
    </AnimationWrapper >
  )
}

export default PublishForm