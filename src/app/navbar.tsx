import Link from "next/link";
import UserType from "./types/UserType";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [client, setClient] = useState<UserType>();

  useEffect(() => {
    let user = localStorage.getItem("user");

    if (user) {
      setClient(JSON.parse(user));
    }
  }, []);

  return (
    <nav className="bg-neutral-950 border-emerald-400 border-shadow-200 text-emerald-500 border-b-2 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Chattest
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {client ? (
            <>
              <span className="mr-4">{client.username}</span>

              <img
                className="w-8 h-8 rounded-full bg-neutral-950 "
                src={client.profilePicture}
                alt="http://robohash.org/a.png"
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-3 bg-emerald-500 font-semibold rounded text-zinc-900 mr-4"
              >
                SIGN IN
              </Link>

              <Link
                href="/register"
                className="px-8 py-3 bg-emerald-500 font-semibold rounded text-zinc-900"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
