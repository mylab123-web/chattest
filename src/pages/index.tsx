import Navbar from "@/app/navbar";
import RoomCard from "@/app/roomCard";
import Link from "next/link";
import axios from "axios";

import "../app/globals.css";
import { useEffect, useState } from "react";
import RoomType from "@/app/types/RoomType";
import { HOST } from "@/app/config";

interface Response {
  data: RoomType[];
  message: string;
  status: number;
}

export default function Home() {
  const [data, setData] = useState<RoomType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data }: { data: Response } = await axios.get(
          `http://${HOST}/api/rooms/`
        );

        setData(data.data);
      } catch (error) {
        alert("Error :" + error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="bg-neutral-950">
        <Navbar />

        <div className="flex bg-neutral-950 p-4">
          <Link
            href="create"
            className="px-8 py-3 bg-emerald-500 font-semibold rounded "
          >
            CREATE ROOM
          </Link>
        </div>

        <h1 className="text-white font-semibold m-4 text-3xl">Online Rooms</h1>

        <main className=" min-h-screen bg-neutral-950 p-2 ">
          <ul>
            {data.length > 0 ? (
              data.map((v) => <RoomCard key={v.id} room={v} />)
            ) : (
              <h1 className="text-2xl pl-2">No rooms, yet.</h1>
            )}
          </ul>
        </main>
      </div>
    </>
  );
}
