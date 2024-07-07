import React from "react";
import MemberType from "./types/MemberType";

const RoomMembers: React.FC<{ members: MemberType[] }> = ({ members }) => {
  return (
    <ul>
      {members.length > 0
        ? members.map((m) => (
            <li
              key={m.id || m.userId + "-" + Date.now()}
              className="text-white mb-2 flex items-center"
            >
              <img
                className="w-8 h-8 rounded-full bg-neutral-950 "
                src={"http://robohash.org/" + m.username + ".png"}
                alt="http://robohash.org/a.png"
              />

              <div className="text-emerald-500">{m.username}</div>
            </li>
          ))
        : null}
    </ul>
  );
};

export default RoomMembers;
