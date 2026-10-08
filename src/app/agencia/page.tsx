import type { Metadata } from "next";
import { AgenciaPage } from "@/components/agencia/AgenciaPage";
import { AGENCIA } from "@/lib/agencia";

export const metadata: Metadata = {
  title: AGENCIA.meta.title,
  description: AGENCIA.meta.description,
  openGraph: {
    title: AGENCIA.meta.title,
    description: AGENCIA.meta.description,
  },
};

export default function AgenciaRoute() {
  return <AgenciaPage />;
}
