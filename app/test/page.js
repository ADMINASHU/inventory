import { auth } from "@/auth";
import Doc from "@/Components/Doc";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

const TestPage = async () => {
  const session = await auth();

  if(!session?.user) redirect("/login");

  return (
    <div>
      <div>TestPage no login required</div>
      <div>{JSON.stringify(session?.user)}</div>
      <div>{session?.user.name}</div>
     <Image
       required
        height={24}
        width={24}
        src= {session.user.provider === "google" ? session?.user.image : `/${session?.user.image}`} 
        alt="User"
      />
      <div>
        <Doc />
      </div>
    </div>
  );
};

export default TestPage;
