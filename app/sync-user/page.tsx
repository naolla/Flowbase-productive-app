import { redirect } from "next/navigation";
import { syncCurrentUser } from "@/lib/users";

export default async function SyncUserPage() {
  await syncCurrentUser();

  redirect("/");
}
