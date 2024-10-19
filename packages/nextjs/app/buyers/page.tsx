"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  createdAt: string;
  name: string;
  eoa: string;
  email: string;
}

export default function page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session?.user?.email, "CONSOLE >>> EMIA");
    console.log(status, "STATUS");
    if (status === "authenticated" && session?.user?.email) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("/api/buyers");
          const data = await response.data;
          const filteredData = data.filter((ele: User) => ele.email !== session?.user?.email);
          setUsers(filteredData);
        } catch (err) {
          setError("Failed to fetch users");
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [session, status]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProposal = async (userId: string) => {
    try {
      const response = await axios.post(`/api/${session?.user?.email}/sell`, {
        sellerId: userId,
      });
      console.log("res", response.data);

      const incrementResponse = await axios.post("http://localhost:4000/api/increment");
      console.log("so response", incrementResponse);
      const tradeId = await incrementResponse.data.newRoomId;
      const roomId = response.data;
      router.push(`/chat/${roomId}/${tradeId}`);
    } catch (error) {
      console.error("error", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="container border-x border-solid border-x-neutral-300 min-h-screen bg-white mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Buyer&apos;s Corner</h1>
      <div className="grid px-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white shadow-md rounded-2xl p-6">
            <h1 className="font-semibold text-2xl text-black">{user.name}</h1>
            <div className="flex flex-col gap-1 text-neutral-500 text-sm">
              <p>email: {user.email}</p>
              <p>EOA: {user.eoa ? `${user.eoa.slice(0, 6)}....${user.eoa.slice(-4)}` : ""}</p>
              <p>Joined on: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>{" "}
            <div className="w-full flex items-end justify-end">
              <button
                onClick={() => handleProposal(user.id)}
                className="bg-[--theme] hover:bg-[--light-theme] px-4 font-semibold text-black py-1.5 rounded-lg"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
