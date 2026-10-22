import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Términos de uso | Think Deep", description: "Condiciones generales de uso del sitio Think Deep." };

export default function TerminosPage() {
  return <>
    <main id="main" className="container-page min-h-[65vh] py-20">
      <article className="max-w-3xl">
        <p className="section-label">Información del sitio</p>
        <h1 className="section-title mt-4">Términos de uso</h1>
        <p className="section-copy mt-5">Última actualización: 22 de octubre de 2026.</p>
        <h2 className="mt-10 text-2xl font-semibold">Información y propuestas</h2>
        <p className="section-copy mt-3">Este sitio presenta servicios digitales y formas de contacto. Enviar una consulta no crea por sí mismo un contrato ni reserva un proyecto. El alcance, calendario, precio, pagos y entregables de cada trabajo se confirman por escrito con el cliente antes de comenzar.</p>
        <h2 className="mt-10 text-2xl font-semibold">Contenido</h2>
        <p className="section-copy mt-3">El contenido del sitio se ofrece con fines informativos y puede actualizarse. Las imágenes, textos, marcas y materiales pertenecen a sus titulares; su presencia no concede permiso para reutilizarlos.</p>
        <h2 className="mt-10 text-2xl font-semibold">Contacto</h2>
        <p className="section-copy mt-3">Para aclaraciones, escribe a <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>. Puedes consultar el <Link className="underline" href="/aviso-de-privacidad">aviso de privacidad</Link>.</p>
      </article>
    </main>
    <Footer />
  </>;
}
