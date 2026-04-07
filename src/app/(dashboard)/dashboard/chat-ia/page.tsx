import { AISearch } from "@/components/search/ai-search";
import { requireAuth } from "@/lib/supabase/auth";

export default async function ChatIAPage() {
  await requireAuth();

  return (
    <div data-testid="chat-ia-page">
      <div className="mb-6">
        <h1 className="font-heading text-heading font-bold text-primary">Chat IA</h1>
        <p className="mt-1 text-body-sm text-gray-500">
          Busca propiedades describiendo lo que necesitas.
        </p>
      </div>
      <AISearch />
    </div>
  );
}
