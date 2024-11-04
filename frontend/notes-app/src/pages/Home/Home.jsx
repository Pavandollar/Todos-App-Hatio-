import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd, MdOutlineAlarmAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import  moment  from "moment";
import Toast from '../../components/ToastMessage/Toast';

const Home = () => 
  {

 const [openAddEditModal,setOpenAddEditModal] = useState({
  isShown: false,
  type: "add",
  data:null,
 });

const [showToastMsg,setShowToastMsg] = useState({
  isShown: false,
  message: "",
  type: "add",

});


 const [userInfo, setUserInfo ] = useState(null);
 const [allNotes, setgetAllNotes ] = useState([]);

 const [isSearch, setIsSearch] = useState(false);

 const navigate = useNavigate();

 //update notes
 const handleEdit = (noteDetails) => {
  setOpenAddEditModal({isShown: true, data: noteDetails, type: "edit"});
 };

//  Handle Close Toast
 const showToastMessage = (message, type) => {
     setShowToastMsg({
      isShown:true,
      message,
      type,
     });
 };

 const handleCloseToast = () => {
  setShowToastMsg({
   isShown:false,
   message:"",
  });
};



// Get-User
const getUserInfo = async () => { 
  try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
          setUserInfo(response.data.user);
      }
  } catch (error) {
      if (error.response) {
          
          if (error.response.status === 401) {
              localStorage.clear();
              navigate("/login");
          } else {
              console.error("An error occurred:", error.response.data); 
          }
      } else {
          console.error("Network error or other issue:", error); 
      }
  }
};


//Get all notes
const getAllNotes = async () => {

  try{
    const response = await axiosInstance.get("/get-all-notes");

    if(response.data && response.data.notes){
      setgetAllNotes(response.data.notes);
    }
  }
  catch(error){
    console.log("an unexpected error occured try again");

  }

};


//Delete Notes
const deleteNote = async (data) => {
  const noteId = data._id  
  try {
        const response = await axiosInstance.delete("/delete-note/" +noteId,);

        if (response.data && !response.data.error) {
          showToastMessage("Deleted the Note",'delete')
            getAllNotes();
            
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          console.log("Network error or other issue: or Unexpected Occur"); 
        }
    }
};

//Search Notes
const onSearchNote = async (query) => {
try{
const response = await axiosInstance.get("/search-notes", {
params: { query },
});

if(response.data && response.data.notes) {
    setIsSearch(true);
    setgetAllNotes(response.data.notes);
  }
 } 
catch(error){
 console.log(error);
}
}


const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes();
} 


const updateIsPinned = async (noteData) => {
  const noteId = noteData._id  
    try {
          const response = await axiosInstance.put("/update-note-pinned/" +noteId, {
              isPinned: !noteData.isPinned
          });
          if (response.data && response.data.note) {
              getAllNotes();
          }
      } catch (error) {
          console.log(error)
      }
}

// const updateIsPinned = async(noteData) => {
//   const noteId = noteData._id  
//     try {
//           const response = await axiosInstance.put("/update-note-pinned/" +noteId, {
//               "isPinned": !noteId.isPinned
//           });
//           if (response.data && response.data.note) {
//             showToastMessage("Updated the Notes")
//               getAllNotes();
//               onClose();
//           }
//       } catch (error) {
//          console.log
//           }
//       }
// }

useEffect(() => {
  const fetchData = async () => {
      try {
          await getAllNotes();
          await getUserInfo();
      } catch (error) {
          console.error(error);
      }
  };
  fetchData();

  return () => {};
}, []);


  return (
    <>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>


    <div className="container mx-auto">
      <div className="grid grid-cols-3 gap-4 mt-8">
      {allNotes.length === 0 ? (
       <p>No notes available</p>
           ) : (
         allNotes.map((item) => (
        <NoteCard 
            key={item._id}
            title={item.title}
            date={moment(item.createdOn).format('Do MMM YYYY')} 
            content={item.content}
            task="#Completed"
            isPinned={item.isPinned}
            onEdit={()=> handleEdit(item)}
            onDelete={()=> deleteNote(item)}
            onPinNote={()=> updateIsPinned(item)} 
        />
    ))
)}
    </div> 
    </div>

    <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary hover:bg-red-400 absolute right-10 bottom-10" onClick={() => {
      setOpenAddEditModal({
        isShown:true,type:"add",data:null
      })
    }}>
    
    
    <MdAdd class
    Name="text-[32px] text-white"/>
    </button>

    <Modal 
    isOpen={openAddEditModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay:{
        backgroundColor: "rgba(0,0,0,0.6)",
      },
    }}
    contentlabel=""
    className="w-[40%] max-h-3/4 bg-white  rounded-md mx-auto mt-14 p-5 overflow-scroll " >

    <AddEditNotes
         type={openAddEditModal.type}
         noteData={openAddEditModal.data}
         onClose={() => {
          setOpenAddEditModal({ isShown: false,type: "add",data: null});
         }}    
    getAllNotes={getAllNotes}
    showToastMessage={showToastMessage}
   />
    </Modal>

    <Toast 
    isShown ={showToastMsg.isShown}
    message={showToastMsg.message}
    type={showToastMsg.type}
    onClose={handleCloseToast} />
    </>
  );
};

export default Home