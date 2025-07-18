"use client"
import axios from "axios";
import { useEffect, useState } from "react";

export default function Te(){
    const [data,setData] = useState("");
    useEffect(() => {
        const get = async () => {
            const res = await axios.post("/api/testing")
            setData(res.data.message)
        }
        get()
    },[])
    return(
        <div>
            {data}
        </div>
    )
}