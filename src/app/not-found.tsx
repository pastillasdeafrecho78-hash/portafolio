import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <main id="main" className="container-page flex min-h-[65vh] flex-col justify-center py-24">
        <p className="section-label">Error 404</p>
        <h1 className="section-title mt-4 max-w-3xl">No encontramos esa página.</h1>
        <p className="section-copy mt-5 max-w-xl">
          El enlace pudo cambiar. Puedes volver al inicio o escribirnos si buscabas algo específico.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className="button button-primary">Volver al inicio</Link>
          <Link href="/#contacto" className="button button-ghost">Contactar</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
