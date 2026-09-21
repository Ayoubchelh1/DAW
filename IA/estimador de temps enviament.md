# Estimació del temps de lliurament d'una comanda (2+ productes)

## Historial de prompts

1. Prompt inicial → funció TypeScript amb 2 productes i enviament  
2. "fes-ho en markdown" → format `.md`  
3. "afegeix enunciat" → context complet  
4. "justificació curta" → simplificació  
5. "documenta prompts" → historial  
6. "afegeix casos límit" → control errors  
7. "problema 2 millor amb error" → model fail-fast  

---

## Enunciat

Plataforma online per calcular quan arriba una comanda amb:
- 2 productes (temps preparació)
- enviament express o estàndard
- dades poc fiables (marge error)

---

## Procediment seguit

1. Validar dades
2. Agafar el màxim temps de preparació
3. Afegir marge d’error (15%)
4. Aplicar regles d’enviament
5. Retornar rang

---

## Decisions davant casos ambigus

| Cas | Decisió |
|-----|--------|
| Temps `null` / `NaN` | ❌ Error (fail-fast) |
| Temps negatiu | `Math.abs()` |
| Temps > 30 dies | Clamp |
| 2 productes | `max()` |
| Enviament invàlid | 0 |
| Express sense límit | límit = mínim |
| Supera límit | Warning |

---

## Implementació (TypeScript)

```ts
/**
 * Representa un producte del carro
 * El temps de preparació pot venir malament de la BD
 */
export interface Product {
  id: string;
  name: string;
  preparationTimeHours: number;
}

/**
 * Tipus d'enviament disponibles
 */
export type ShippingType = "express" | "standard";

/**
 * Configuració de l'enviament
 */
export interface ShippingOption {
  type: ShippingType;

  // Temps mínim que tarda el transport
  minTransitHours: number;

  // Límit màxim (només express)
  maxTransitHours?: number;
}

/**
 * Resultat final que es retorna a la UI
 */
export interface Result {
  minHours: number;   // temps mínim estimat
  maxHours: number;   // temps màxim estimat
  warnings: string[]; // avisos de dades incorrectes
}

/**
 * Funció per netejar dades de preparació
 * Aquí es controlen errors de la base de dades
 */
function sanitize(raw: number, warnings: string[], name: string): number {

  // ❌ FAIL-FAST: si no és número, parem el sistema
  if (raw === null || raw === undefined || Number.isNaN(raw)) {
    throw new Error(`Temps de preparació invàlid per ${name}`);
  }

  // ➖ Si és negatiu, assumim error de signe i el corregim
  if (raw < 0) {
    warnings.push(`Temps negatiu a ${name}, corregit`);
    return Math.abs(raw);
  }

  // 🔢 Si és massa gran, probablement error → limitem a 30 dies
  if (raw > 720) {
    warnings.push(`Temps massa gran a ${name}, limitat`);
    return 720;
  }

  // ✔️ Valor correcte
  return raw;
}

/**
 * Funció principal que calcula el temps d'entrega
 */
export function estimateOrder(
  products: Product[],
  shipping: ShippingOption
): Result {

  const warnings: string[] = [];

  // ❌ No té sentit calcular sense productes
  if (!products || products.length === 0) {
    throw new Error("No hi ha productes");
  }

  // 🔄 Neteja de dades de cada producte
  const temps = products.map(p =>
    sanitize(p.preparationTimeHours, warnings, p.name)
  );

  // 🧠 DECISIÓ IMPORTANT:
  // La comanda surt quan TOTS els productes estan preparats
  // → per això fem servir el màxim
  const preparacio = Math.max(...temps);

  // 🚚 Temps d’enviament
  let minTransit = shipping.minTransitHours;

  // ⚠️ Si el temps d’enviament és incorrecte, assumim 0
  if (minTransit === undefined || Number.isNaN(minTransit) || minTransit < 0) {
    warnings.push("Temps enviament invàlid → 0");
    minTransit = 0;
  }

  // 🧮 Temps total base
  const total = preparacio + minTransit;

  // 📊 Marge d’error del 15% (dades poc fiables)
  const min = Math.round(total * 0.85);
  const max = Math.round(total * 1.15);

  // ⚡ CAS EXPRESS
  if (shipping.type === "express") {

    // Si no hi ha límit, usem el mínim com a referència
    const limit = shipping.maxTransitHours ?? minTransit;

    // Si supera el límit, ho controlem
    if (max > limit) {
      warnings.push("Supera límit express");

      return {
        minHours: min,
        maxHours: limit, // no podem superar el límit
        warnings
      };
    }
  }

  // ✔️ Cas normal
  return {
    minHours: min,
    maxHours: max,
    warnings
  };
}