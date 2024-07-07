import React from "react";
import RoomType from "./types/RoomType";
import Link from "next/link";

const RoomCard: React.FC<{ room: RoomType }> = ({ room }) => {
  return (
    <li className="flex items-center ">
      <Link
        href={"/room/" + room.id}
        style={{ width: 400 }}
        className="flex  items-center mt-6 pl-4 border-b border-emerald-500    shadow-md"
      >
        <div>
          <h2 className="mb-1 text-xl font-semibold text-white ">
            {room.title}
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center ml-4">
          <div className="flex -space-x-2">
            {room.members
              ? room.members.map((m) => (
                  <img
                    key={m.userId}
                    alt="pp"
                    className="w-6 h-6 border rounded-full dark:bg-gray-500 dark:border-gray-300"
                    src={"https://robohash.org/" + m.username + ".png"}
                  />
                ))
              : null}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default RoomCard;
