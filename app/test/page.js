import { auth } from "@/auth";
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
        // src={`/${session?.user.image}`}
        src={session?.user.image}
        alt="User"
      />
    </div>
  );
};

export default TestPage;
