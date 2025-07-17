"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null); // null to indicate "not loaded"

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.post("/api/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    getUser(); // ✅ call the function
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Username: {user.username}</h2>
      <p>Email: {user.email}</p>
      <img
        src={user.profileImg}
        alt="Profile"
        className="w-20 h-20 rounded-full mt-2"
      />
    </div>
  );
}
