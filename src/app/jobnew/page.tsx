"use client"
import axios from "axios";
import { useState } from "react"

export default function Jobnew(){
    const [company,setCompany] = useState("");
    const [jobtitle,setJobtitle] = useState("");
    const [jobDesc,setJobDesc] = useState("");

    const onSubmit = async () => {
        const res = await axios.post("/api/createjob",{jobtitle, jobdescription: jobDesc, company})
    }
    return(
        <div>
            <label>Comapny name</label>
            <input onChange={(e) => setCompany(e.target.value)} type="text" />
            <label>job name</label>
            <input onChange={(e) => setJobtitle(e.target.value)} type="text" />
            <label>Job desc</label>
            <input onChange={(e) => setJobDesc(e.target.value)} type="text" />
            <button onClick={onSubmit}>Submit</button>
        </div>
    )
}