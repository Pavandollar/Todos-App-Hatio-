import React, { useState, useEffect } from 'react'
// import TagInput from '../../components/Input/TagInput'
import { MdClose } from 'react-icons/md'
import axiosInstance from '../../utils/axiosInstance';


const AddEditNotes = ({noteData, type, getAllNotes, onClose, showToastMessage }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    if (type === 'edit' && noteData) {
      setTitle(noteData.title);  
      setContent(noteData.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [type, noteData]); 
  

  const addNewNote = async () => {
      try {
          const response = await axiosInstance.post("/add-note", {
              title,
              content,
          });
          if (response.data && response.data.note) {
            showToastMessage(" note added Succesfully")
              getAllNotes();
              onClose();
          }
      } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message);
          }
      }
  };

  const editNote = async () => {
    const noteId = noteData._id  
    try {
          const response = await axiosInstance.put("/edit-note/" +noteId, {
              title,
              content,
          });
          if (response.data && response.data.note) {
            showToastMessage("Updated the Notes")
              getAllNotes();
              onClose();
          }
      } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message);
          }
      }
  };

  const handleAddNote = () => {
      if (!title) {
          setError("Please enter the title");
          return;
      }
      if (!content) {
          setError("Please enter the content");
          return;
      }

      setError("");

      if (type === 'edit') {
          editNote();
      } else {
          addNewNote();
      }
  };

  return (
     
    <div className="relative ">
        <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-600" onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
    </button>
    <div className="flex flex-col gap-2">
        <label className="input-label text-green text-1xl">TITLE</label>
        <input type="text" 
        className="text-1xl 
        text-slate-950  bg-white outline-none" 
        placeholder="Your Title Please"
        value={title}
        onChange={({target}) => setTitle(target.value)}
        />
          </div>

     <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">PROJECT DESCRIPTION</label>
        <textarea className="text-ts text-slate-950 bg-white outline-none bbg-slate-50 p-2 rounded" 
         placeholder="content"
         rows={10}
         value={content}
        onChange={({target}) => setContent(target.value)}
         />
    
    <div className="mt-3  ">
        <label className=" input-label ">Task</label>
    </div>

 
     </div>
     <button className="btn-primary font-medium mt-5 p-3" onClick={handleAddNote}>
                {type === 'edit' ? 'Update' : 'Add'}
            </button>
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
    </div>
  )
}

export default AddEditNotes



// const AddEditNotes = ({type,noteData,getAllNotes, onClose}) => 
//     {
//        const [title, setTitle] = useState("")
//        const [content,setContent] = useState("")
       

//       const [error, setError] = useState(null);
    

//      const adddNewNote = async () => {
//       try{
//          const response = await axiosInstance.post("/add-note", {
//           title,
//           content,
//          });
//            if(response.data && response.data.note) {
//               getAllNotes()
//               onClose()
//            }
//       }
//       catch(error){
//       if(error.response && error.response.data && error.response.data.message){
//         serError(error.response.data.message);
//       }
//       }
//      };
//      const editNote = async () => {};

    


//       const handleAddNote = () => {
//         if(!title)
//         {
//           setError("please Enter the title");
//           return;
//         }
//         if(!content)
//           {
//             setError("please Enter the content");
//             return;
//           }
         
//            setError("");
      
//            if(type === 'edit')
//             {
//             editNote()
//            }else
//            {
//             addNewNote()
//            }
      
//           }