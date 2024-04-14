import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userIdErr, setUserIdErr] = useState("");
  const navigate = useNavigate();

  const onGenerateRandomId = () => {
    const id = nanoid();
    try {
      localStorage.setItem("userId", id);
      navigate("/data-source");
    } catch (err) {
      console.log(err);
    }
  };

  const onEnterSpace = async () => {
    if (!userId) {
      return setUserIdErr("A Unique Patient Id Is Required!");
    }
    try {
      localStorage.setItem("userId", userId);
      navigate("/data-source");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col gap-1 justify-center items-center gabarito-400">
      <div className="flex flex-col gap-5 items-center p-5 rounded-xl border hover:shadow-xl transition-all w-[90%] lg:w-[50%] shadow">
        <Input
          placeholder="Enter Unique Patient ID"
          value={userId}
          onChange={(e) => {
            setUserIdErr("");
            setUserId(e.target.value);
          }}
        />
        {userIdErr && <p className="text-red-500">{userIdErr}</p>}
        <div className="flex gap-5 flex-wrap items-center justify-center">
          <Button
            onClick={onGenerateRandomId}
            variant={"outline"}
            colorScheme="blue"
          >
            Use Random Id 🔀
          </Button>
          <Button onClick={onEnterSpace} colorScheme="blue">
            Talk To AI Medical Advisor ✨
          </Button>
        </div>
      </div>
      <div className="flex gap-1 text-center flex-wrap">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png"
          width={30}
          height={30}
        />
        <p>
          Powered By{" "}
          <a
            className="underline text-blue-600"
            target="_blank"
            href="https://www.cloudflare.com/en-gb/"
          >
            Cloudflare AI
          </a>
        </p>
        <p>|</p>
        <a
          className="underline text-blue-600"
          target="_blank"
          href="https://www.cloudflare.com/en-gb/"
        >
          Blog
        </a>
      </div>
      <p className="text-center mx-2 text-balance">
        No Rights Reserved - Public Domain | Solely Built for Hackathon
      </p>
      <p className="text-center mx-2 text-balance">
        All Data Are Publicly Accessible,{" "}
        <strong>
          Please Refrain From Entering Any Personal/Confidential Data
        </strong>
      </p>
    </div>
  );
}
