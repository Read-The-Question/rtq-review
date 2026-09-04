import { redirect } from "next/navigation";
import { defaultDocumentRoute } from "@/lib/shared";

export default function HomePage() {
  redirect(defaultDocumentRoute);
}
