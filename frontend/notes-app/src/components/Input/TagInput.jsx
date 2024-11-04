import React, { useState } from 'react'
import { MdAdd } from 'react-icons/md'

const TagInput = () => 
    {
        const [isChecked,setIsChecked] =useState(false);

        const handleCheckboxChange = () =>{
            setIsChecked(!isChecked)
        }
  return (
    <div>
        <label>
            <input type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}/> Completed
        </label>

    </div>
  )
}

export default TagInput