export default async function SendResetPasswordEmail() {
  try {
    const res = await fetch(
      (process.env.NEXT_PUBLIC_URL as string) + "/api/resetPassword",
    );
    const json = await res.json();
    return json;
  } catch (err: any) {
    console.log("error sending reset password email", err);
  }
}
