import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest) => {
  console.log("RESET PASSWORD API ENDPOINT");
  // const token = await getToken({
  //   req,
  //   secret: process.env.AUTH_SECRET as string,
  // });
  // console.log({ token });
  // console.log({ req });
  //
  // const signedToken = jwt.sign(token, process.env.AUTH_SECRET as string, {
  //   algorithm: "HS256",
  // });
  const res = await fetch("http://localhost:3001/sendemail", {
    method: "POST",
    // headers: { Authorization: `Bearer ${signedToken}` },
    body: JSON.stringify({ email: "baileymk@hotmail.com" }),
  });
  const json = await res.json();
  console.log("reset email response", json);

  if (res.status === 200) {
    // console.log("JSON web token", JSON.stringify(token, null, 2));
    return NextResponse.json({ status: 200 });
  } else {
    return NextResponse.json({ status: 500, message: "no jwt" });
  }
};
