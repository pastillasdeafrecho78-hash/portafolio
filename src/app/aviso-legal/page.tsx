import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Aviso legal | Think Deep", description: "Información general del sitio Think Deep." };

export default function AvisoLegalPage() {
  return <>
    <main id="main" className="container-page min-h-[65vh] py-20">
      <article className="max-w-3xl">
        <p className="section-label">Información del sitio</p>
        <h1 className="section-title mt-4">Aviso legal</h1>
        <p className="section-copy mt-5">Think Deep presenta en este sitio servicios de desarrollo web, automatización y producto digital. Para consultas sobre el contenido o los servicios, escribe a <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <p className="section-copy mt-5">La información del sitio puede cambiar. Cada proyecto se define mediante una propuesta acordada con el cliente. Las marcas y materiales de terceros conservan sus respectivos titulares.</p>
        <p className="section-copy mt-5">Consulta los <Link className="underline" href="/terminos">términos de uso</Link> y el <Link className="underline" href="/aviso-de-privacidad">aviso de privacidad</Link>.</p>
      </article>
    </main>
    <Footer />
  </>;
}
