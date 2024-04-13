import { Button } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userIdErr, setUserIdErr] = useState("");
  const navigate = useNavigate();

  const onEnterSpace = async () => {
    if (!userId) {
      return setUserIdErr("A Unique User Id Is Required!");
    }
    try {
      // await getReadWriteUrl(userId);
      localStorage.setItem("userId", userId);
      navigate("/data-source");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5 items-center p-5 rounded-xl border-2 border-dashed w-[90%] lg:w-[50%]">
        <Input
          placeholder="Enter Unique User ID"
          value={userId}
          onChange={(e) => {
            setUserIdErr("");
            setUserId(e.target.value);
          }}
        />
        {userIdErr && <p className="text-red-500">{userIdErr}</p>}
        <Button onClick={onEnterSpace} colorScheme="blue">
          Enter AI Space ✨
        </Button>
      </div>
    </div>
  );
}
