import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "Aviso de privacidad | Think Deep", description: "Información sobre el uso de datos en Think Deep." };

export default function PrivacidadPage() {
  return <>
    <main id="main" className="container-page min-h-[65vh] py-20">
      <article className="max-w-3xl">
        <p className="section-label">Información del sitio</p>
        <h1 className="section-title mt-4">Aviso de privacidad</h1>
        <p className="section-copy mt-5">Última actualización: 22 de octubre de 2026.</p>
        <h2 className="mt-10 text-2xl font-semibold">Contacto</h2>
        <p className="section-copy mt-3">Think Deep atiende consultas sobre los datos compartidos mediante este sitio en <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <h2 className="mt-10 text-2xl font-semibold">Datos y uso</h2>
        <p className="section-copy mt-3">Si nos contactas por correo o WhatsApp, podremos recibir tu nombre, datos de contacto y los detalles que decidas compartir sobre tu proyecto. Se usan para responderte, preparar una propuesta y dar seguimiento a la relación comercial. El sitio también puede procesar datos técnicos necesarios para su funcionamiento y seguridad.</p>
        <h2 className="mt-10 text-2xl font-semibold">Servicios externos</h2>
        <p className="section-copy mt-3">El sitio se aloja en Vercel. Cuando eliges WhatsApp o correo, la comunicación se realiza mediante esos servicios y se rige también por sus políticas. No compartas datos sensibles que no sean necesarios para tu consulta.</p>
        <h2 className="mt-10 text-2xl font-semibold">Tus solicitudes</h2>
        <p className="section-copy mt-3">Puedes solicitar acceso, corrección, eliminación u oposición al uso de tus datos en el correo anterior. Indica los datos necesarios para identificar tu solicitud y un medio para responderte. Los cambios de este aviso se publicarán aquí.</p>
        <p className="section-copy mt-10"><Link className="underline" href="/terminos">Consultar términos</Link></p>
      </article>
    </main>
    <Footer />
  </>;
}
