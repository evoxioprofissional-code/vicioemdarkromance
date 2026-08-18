import { createClient } from "@/lib/supabase/server";
import { brl, type Plano } from "@/lib/types";

interface PlanRow {
  id: string;
  nome: string;
  periodo: string | null;
  price_cents: number;
  beneficios: string[] | null;
  destaque: boolean | null;
}

function mapPlano(r: PlanRow): Plano {
  return {
    id: r.id,
    nome: r.nome,
    periodo: r.periodo ?? "1 mês",
    precoMes: brl(r.price_cents),
    cobranca: `Cobrança mensal de ${brl(r.price_cents)} · sem fidelidade`,
    destaque: r.destaque ?? false,
    beneficios: r.beneficios ?? [],
  };
}

export async function getPlanos(): Promise<Plano[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plans")
    .select("*")
    .eq("ativo", true)
    .order("price_cents", { ascending: true });
  return ((data ?? []) as PlanRow[]).map(mapPlano);
}

export async function getPlano(id?: string): Promise<Plano | null> {
  const planos = await getPlanos();
  if (!planos.length) return null;
  return planos.find((p) => p.id === id) ?? planos[0];
}
