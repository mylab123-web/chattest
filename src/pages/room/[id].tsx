import Navbar from "@/app/navbar";
import "../../app/globals.css";
import Room from "@/app/types/RoomType";
import { useEffect, useState } from "react";
import axios from "axios";
import RoomMessage from "@/app/types/RoomMessage";
import RoomMember from "@/app/types/RoomMemberType";
import { useRouter } from "next/router";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import UserType from "@/app/types/UserType";
import MemberType from "@/app/types/MemberType";
import { HOST } from "@/app/config";

interface Response {
  data: Room;
}

export const RoomPage = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null
  );

  const [isMember, setIsMember] = useState(false);

  const [user, setUser] = useState<UserType | null>();

  const [message, setMessage] = useState("");

  const [isWideScreen, setIsWideScreen] = useState(false);

  useEffect(() => {
    // Check window width on client side
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 768);
    };

    handleResize(); // Check initially
    window.addEventListener("resize", handleResize); // Listen for resize events

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const ws = new Client({ brokerURL: `ws://${process.env.HOST}/websocket/` });

    if (id) {
      ws.onConnect = (f) => {
        setClient(ws);
      };

      ws.activate();

      return () => {
        ws.deactivate();
      };
    }
  }, [id]);

  useEffect(() => {
    if (client) {
      const user = localStorage.getItem("user");

      if (user) {
        const jUser = JSON.parse(user);

        setUser(jUser);
      }

      if (isMember) {
        subscribe(client, localStorage.getItem("token") as string);
      } else {
        subscribe(client, "");
      }

      return () => {
        setClient(null);
        setUser(null);
      };
    }
  }, [client]);

  function subscribe(client: Client, token: string) {
    var sub = client.subscribe(
      "/topic/" + id,
      function (message: IMessage) {
        const body: RoomMessage = JSON.parse(message.body);

        switch (body.action.type) {
          case "JOIN":
            addMember(body.action.subject as RoomMember);
            break;
          case "LEAVE":
            removeMember(body.action.subject as RoomMember);
            break;
          case "STANDARD":
            addMessage(body);
            break;
        }
      },
      {
        Authorization: token,
      }
    );

    setSubscription(sub);
  }

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const { data }: { data: Response } = await axios.get(
            `http://${HOST}/api/rooms/` + id
          );

          setRoom(data.data);

          setMembers(data.data.members as unknown as RoomMember[]);
        } catch (error) {
          alert("Error :" + error);
        }
      };

      fetchData();

      return () => {
        client?.deactivate();
        setRoom(null);
      };
    }
  }, [id]);

  function addMember(newMember: RoomMember) {
    if (newMember.userId == user?.id) {
      return;
    }

    const exist = members.findIndex((m) => m.userId == newMember.userId);

    if (exist == -1) {
      setMembers((members) => [...members, newMember]);
    }
  }

  function removeMember(member: RoomMember) {
    const newMembers = members.filter((m) => m.userId != member.userId);

    setMembers(newMembers);
  }

  function addMessage(newMessage: RoomMessage) {
    setMessages((messages) => [...messages, newMessage]);
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      client?.publish({
        destination: "/messages/" + id,
        body: message,
      });

      setMessage("");
    }
  }

  function joinChat(ws: Client) {
    if (!localStorage.getItem("token") || !localStorage.getItem("user")) {
      alert("You have to be logged in first.");
    } else {
      subscription?.unsubscribe();

      subscribe(ws, localStorage.getItem("token") as string);

      setIsMember(true);
    }
  }

  return (
    <div className="bg-neutral-950 ">
      <Navbar />

      <div className="mx-auto flex flex-col md:flex-row">
        <div className="w-full md:w-1/5 bg-neutral-950 border border-2 border-emerald-500 p-4">
          <h2 className="text-white font-semibold mb-4">Members</h2>

          <ul>
            {user && (
              <li
                id={user.id + "-" + Date.now()}
                className="text-white mb-2 flex items-center"
              >
                <img
                  className="w-8 h-8 rounded-full bg-neutral-950 "
                  src={user.profilePicture}
                  alt="pp"
                />

                <div className="text-emerald-500">{user.username}</div>
              </li>
            )}

            {members?.map((m) => (
              <li
                key={m.memberId + "-" + Date.now()}
                className="text-white mb-2 flex items-center"
              >
                <img
                  className="w-8 h-8 rounded-full bg-neutral-950 "
                  src={"http://robohash.org/" + m.username + ".png"}
                  alt="pp"
                />

                <div className="text-emerald-500">{m.username}</div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`w-full ${isWideScreen ? "lg:w-3/5" : ""} bg-neutral-950`}
        >
          {isWideScreen && (
            <div className="bg-neutral-950">
              <h3 className="text-white text-center mt-4">
                Profile pictures are generated by robohash.org
              </h3>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/5 bg-neutral-950 border border-2 border-emerald-500 p-4 ml-auto">
          {room?.title && (
            <>
              <h2 className="text-white font-semibold mb-4">{room.title}</h2>

              <div>
                <div className="min-h-96 overflow-y-auto">
                  {messages?.map((m) => (
                    <div
                      key={m.sender.userId + "-" + Date.now()}
                      className="flex items-center mt-2"
                    >
                      <div>
                        <img
                          className="w-8 h-8 rounded-full bg-neutral-950 "
                          src={m.sender.profilePicture}
                          alt="pp"
                        />
                      </div>
                      <div className="text-emerald-500">
                        {m.sender.username} :
                      </div>
                      <div className="ml-4 text-white">
                        {m.action.subject as string}
                      </div>
                    </div>
                  ))}
                </div>
                {isMember ? (
                  <input
                    type="text"
                    name="message"
                    value={message}
                    placeholder="Send message..."
                    className="w-full bg-neutral-950 text-emerald-500 focus:outline-none pb-2 border-b border-emerald-500 "
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                ) : (
                  client && (
                    <button
                      className="px-8 py-3 bg-emerald-500 font-semibold rounded w-full "
                      onClick={() => joinChat(client)}
                    >
                      JOIN CHAT
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
