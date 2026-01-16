import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {SessionManagement} from "./sessionManagment";

const Set_session_Tab = async ({
  current_session,
}: {
  current_session: string;
}) => {
  const sessions = await auth.api.listSessions({ headers: await headers() });
  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={current_session}
        />
      </CardContent>
    </Card>
  );
};

export default Set_session_Tab;
