import { signOut } from "@/action/signOut";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className=" w-dvw h-dvh grid place-content-center">
      <h3 className=" text-4xl text-center font-semibold">Dashboard</h3>
      <h1 className=" text-center text-7xl uppercase ">{session?.user.name}</h1>
      <form className=" text-center my-4" action={signOut}>
        <Button className="" variant={"destructive"} type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  );
};

export default page;
