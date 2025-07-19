"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.post("/api/profile");
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border border-slate-700 shadow-xl p-6">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-20 w-20 rounded-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border border-slate-700 shadow-2xl">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-3xl font-bold text-white mb-2">
            👤 Profile
          </CardTitle>
          {user.profileImg && (
            <img
              src={user.profileImg}
              alt="Profile"
              className="w-24 h-24 rounded-full border border-slate-500 shadow-lg"
            />
          )}
        </CardHeader>
        <CardContent className="text-center text-white">
          <h2 className="text-lg mb-1">
            Username: <span className="font-semibold">{user.username}</span>
          </h2>
          <p className="text-slate-300">Email: {user.email}</p>

          {!user.resume && (
            <div className="mt-4">
              <p className="text-red-400 mb-2">You haven't uploaded a resume.</p>
              <Button onClick={() => router.push("/resume")} variant="secondary">
                Upload Resume
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
