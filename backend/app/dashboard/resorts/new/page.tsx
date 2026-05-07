import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function NewResortPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "RESORT_OWNER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-serif font-bold text-navy-950 mb-2">Add Your Property</h1>
        <p className="text-navy-950/50">Follow the steps below to list your luxury stay in Hampi.</p>
      </div>
      <OnboardingWizard ownerId={session.user.id} />
    </div>
  );
}
