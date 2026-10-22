"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="container-page flex min-h-[65vh] flex-col justify-center py-24">
      <p className="section-label">Error temporal</p>
      <h1 className="section-title mt-4">No pudimos abrir esta página.</h1>
      <p className="section-copy mt-5">Inténtalo de nuevo. Si continúa, escríbenos por correo.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <button type="button" onClick={reset} className="button button-primary">Reintentar</button>
        <a href="mailto:salvador@thinkdeepgroup.com" className="button button-ghost">Escribirnos</a>
      </div>
    </main>
  );
}
