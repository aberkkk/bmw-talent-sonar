import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyState({ message }: { message?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-foreground">No employees added yet</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {message || "Add employees in Talent Radar to get started"}
      </p>
      <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl text-sm font-bold btn-gradient text-primary-foreground transition-all">
        Go to Talent Radar →
      </button>
    </div>
  );
}
