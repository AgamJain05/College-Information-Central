
import {useContext} from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag ,tagsIndex }) => {

    let { blog , blog:{tags} ,setBlog} = useContext(EditorContext);
    const handleTagDelete = (e) => {
        tags = tags.filter((t) => t !== tag)
        setBlog({...blog, tags });
    }
    const addEditTable = (e) => {
        e.target.setAttribute("contentEditable", "true")
        e.target.focus();
    }
    const handleTagEdit = (e) => {
        if(e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            let currentTag = e.target.innerText;
            
                tags[tagsIndex] = currentTag;
                setBlog({...blog, tags });
                e.target.setAttribute("contentEditable", "false")
            
        }
    }
    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full">
            <p className="outline-none" onKeyDown={handleTagEdit} onClick={addEditTable}>{tag}</p> 
            <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2" onClick={handleTagDelete}>
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}
export default Tag;