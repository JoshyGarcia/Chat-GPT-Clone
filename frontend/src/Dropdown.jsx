import React from 'react'
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid';


export const Dropdown = ({ label, value, options, onChange }) => {
    
    return (
        <div>
            <label >
            
            <p>{label}</p>

            <select value={value} onChange={onChange}>

                {options.map((option) => (

                <option key={nanoid()} value={option.value}>{option.label}</option>

                ))}

            </select>

            </label>
        </div>
     
   
    );
   
};