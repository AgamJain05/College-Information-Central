import { Navigate } from "react-router-dom";
import { Usercontext } from "../App"
import { useContext } from "react";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { useState } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/loader.component";


const blogstructure = {
    title: "",
    banner: "",
    content: "",
    tags: [],
    des: "",
    auther: {personal_info:{}}
}

export const EditorContext = createContext();


const Editor = ()=> {
    let { blog_id } = useParams();

    let {userAuth:{access_token}} = useContext(Usercontext);
    const [blog, setBlog] = useState(blogstructure);
    const [editorState, setEditorState] = useState("editor");
    const [textEditor , setTextEditor] = useState({isReady: false});
    const [ loading, setLoading ] = useState(true);

    

    useEffect(() => {

      if(!blog_id){
          return setLoading(false);
      }

      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: 'edit' })
      .then(( { data: { blog }} ) => {
          setBlog(blog);
          setLoading(false);
      })
      .catch(err => {
          setBlog(null);
          setLoading(false);
      })

  }, [])

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
        { 
            access_token === null ? <Navigate to="/signin" /> 
            : 
            loading ? <Loader /> :
            editorState == "editor" ? <BlogEditor /> : <PublishForm /> 
        }
    </EditorContext.Provider>
)
}

export default Editor