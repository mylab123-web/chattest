import Navbar from "@/app/navbar";

import "../app/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import UserType from "@/app/types/UserType";
import { useRouter } from "next/router";
import { HOST } from "@/app/config";

interface Response {
  token: string;
  user: UserType;
}

interface ResponseData {
  data: Response;
}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  useEffect(() => {
    return () => {
      setUsername("");
      setPassword("");
      setLoading(false);
    };
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data }: { data: ResponseData } = await axios.post(
        `http://${HOST}/api/auth/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", "Bearer " + data.data.token);

      router.push("/");
    } catch (error: any) {
      if (error.response.status == 400) {
        alert("Invalid username or password");
      } else {
        alert(error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div>
        <section className="bg-neutral-950  ">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full  rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-emerald-500  md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  action="#"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-emerald-500 dark:text-white"
                    >
                      Your username
                    </label>
                    <input
                      type="username"
                      name="username"
                      value={username}
                      onChange={handleInputChange}
                      id="username"
                      className="focus:outline-none text-white bg-neutral-950 border border-emerald-600  rounded-lg block w-full p-2.5 "
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-emerald-500  dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="focus:outline-none text-white bg-neutral-950 border border-emerald-600  rounded-lg block w-full p-2.5 "
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-500 text-neutral-900 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                  <p className="text-sm  text-emerald-500 font-light ">
                    Don’t have an account yet?{" "}
                    <Link
                      href="register"
                      className="font-medium  hover:underline text-emerald-500"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LoginPage;
