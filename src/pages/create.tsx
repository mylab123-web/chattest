import Navbar from "@/app/navbar";

import "../app/globals.css";
import { useState } from "react";
import axios from "axios";
import MemberType from "@/app/types/MemberType";
import { useRouter } from "next/router";
import { HOST } from "@/app/config";

interface Response {
  id: string;
  title: string;
  members: MemberType[];
}

interface ResponseData {
  data: Response;
}

const CreatePage = () => {
  const [subject, setSubject] = useState("");

  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (localStorage.getItem("token")) {
      try {
        const { data }: { data: ResponseData } = await axios.post(
          `http://${HOST}/api/rooms/`,
          {
            title: subject,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token") as string,
            },
          }
        );

        const joinedRooms = localStorage.getItem("joined");

        if (joinedRooms) {
          const prev = JSON.parse(joinedRooms);

          localStorage.setItem(
            "joined",
            JSON.stringify({ ...prev, [data.data.id]: true })
          );
        } else {
          localStorage.setItem(
            "joined",
            JSON.stringify({ [data.data.id]: true })
          );
        }

        router.push("room/" + data.data.id);
      } catch (error) {
        alert(JSON.stringify(error));
      }
    } else {
      alert("you have to be logged in first.");
    }
  }

  return (
    <>
      <Navbar />

      <div className="bg-neutral-950 text-emerald-500">
        <section className="">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold"
            ></a>
            <div className="w-full  rounded-lg shadow border border-emerald-500 md:mt-0 sm:max-w-md xl:p-0  ">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl text-emerald-600 font-bold leading-tight tracking-tight  md:text-2xl ">
                  Create Room
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  action="#"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium"
                    >
                      Room Subject
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-neutral-950 text-white border border-emerald-300 text-emerald-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 focus:outline-none"
                      placeholder="Room title"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-emerald-500 text-zinc-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    CREATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreatePage;
