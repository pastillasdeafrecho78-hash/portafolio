import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Enlaces NFC y menús | Think Deep",
  description: "Una página dinámica para menús, reservas, promociones y enlaces. Personalízala desde tu portal sin cambiar tu NFC o QR.",
};

export default function EnlacesPage() {
  return <><Header /><main id="main" className="enlaces-service">
    <div className="container-page">
      <section className="enlaces-service__hero"><p className="section-label">Think Deep Enlaces</p><h1>Tu negocio, en un solo enlace que puedes cambiar.</h1><p>Una página para el menú, las reservas, las redes, la ubicación y lo que quieras compartir. Graba una vez tu NFC o imprime tu QR; después edita el contenido desde tu propio portal.</p><div className="enlaces-service__actions"><a href="https://thinkdeep-enlaces.vercel.app/solicitar" className="button button-primary">Solicitar mi enlace <span aria-hidden="true">↗</span></a><a href="https://thinkdeep-enlaces.vercel.app" className="enlaces-service__secondary">Ver el portal</a></div></section>
      <section className="enlaces-service__details" aria-label="Qué incluye"><article><span>01</span><h2>Menús que se actualizan</h2><p>Agrega categorías, platillos y precios. Cambia el orden o la información cuando lo necesites.</p></article><article><span>02</span><h2>Todos tus destinos</h2><p>Reservas, WhatsApp, redes, promociones o cualquier enlace HTTPS en una sola página personalizada.</p></article><article><span>03</span><h2>Escucha a tus clientes</h2><p>Recibe opiniones privadas en tu panel y decide cuáles destacar para atenderlas. El enlace público de Google permanece disponible para todos.</p></article></section>
      <section className="enlaces-service__closing"><div><p className="section-label">Plan mensual</p><h2>$50 MXN <span>/ mes</span></h2><p>Tu enlace dinámico, menús y botones editables, y bandeja privada de opiniones.</p></div><a href="https://thinkdeep-enlaces.vercel.app/solicitar" className="button button-primary">Solicitar acceso <span aria-hidden="true">↗</span></a></section>
      <p className="enlaces-service__footnote">¿Ya tienes tu portal? <a href="https://thinkdeep-enlaces.vercel.app/entrar">Entra aquí</a>. <Link href="/">Volver a Think Deep</Link>.</p>
    </div>
  </main><Footer /></>;
}
