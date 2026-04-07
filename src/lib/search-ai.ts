/**
 * AI-powered filter extraction using DeepSeek.
 * Activated when SEARCH_MODE=ai.
 */
import { chatCompletion } from "@/lib/deepseek";
import { parseSearchQuery, type SearchFilters } from "@/lib/search-parser";

const SYSTEM_PROMPT = `Eres un asistente de búsqueda inmobiliaria. El usuario describe lo que busca en lenguaje natural.
Extrae filtros estructurados como JSON. Campos posibles:

- property_type: string — DEBE usar estos códigos exactos del CRM:
  AP = Departamento/Apartamento
  HO = Casa/House
  LA = Terreno/Lote/Land
  LO = Local comercial
  PH = PH
- operation_type: string — DEBE usar estos valores exactos:
  Sale = Venta
  Rent = Alquiler
  Temporary = Alquiler temporario
- min_price: number (precio mínimo)
- max_price: number (precio máximo)
- currency: string (USD, ARS)
- min_bedrooms: number (dormitorios/habitaciones. "ambientes" = bedrooms + 1)
- max_bedrooms: number
- min_bathrooms: number (baños/ban/bath)
- min_surface: number (m² total mínimo)
- max_surface: number (m² total máximo)
- address_contains: string (barrio, zona, calle — búsqueda parcial en dirección)
- keywords: string (texto libre para buscar en título/descripción)

Reglas:
- Solo incluye campos que el usuario mencionó explícitamente o implícitamente.
- Si dice "3 ambientes" → min_bedrooms: 2 (ambientes - 1 aprox).
- "baños", "ban", "bath" → min_bathrooms, NUNCA min_bedrooms.
- "dormitorios", "habitaciones", "dorm" → min_bedrooms, NUNCA min_bathrooms.
- Si dice "hasta X" → max_price. Si dice "desde X" → min_price.
- Si no especifica moneda, asume USD.
- Si no especifica operación, no incluyas operation_type.
- Responde SOLO el JSON, sin explicaciones.`;

export async function extractFiltersWithAI(query: string): Promise<SearchFilters> {
  try {
    const raw = await chatCompletion(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      { json: true, temperature: 0.1, maxTokens: 500 },
    );
    return JSON.parse(raw) as SearchFilters;
  } catch (err) {
    console.error("DeepSeek filter extraction failed, falling back to parser:", err);
    // Fallback to regex parser
    return parseSearchQuery(query);
  }
}
