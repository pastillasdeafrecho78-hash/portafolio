import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import PlacasCatalog from "./PlacasCatalog";

export const metadata: Metadata = {
  title: "Placas NFC para mascotas | Think Deep",
  description: "Personaliza una placa para el collar de tu perro. La versión NFC abre una ficha con tus datos de contacto.",
};

const catalog = {
  whatsapp: WHATSAPP_NUMBER,
  models: [
    { id: "huella", name: "Huella", size: [45, 43], confirmed: false },
    { id: "hueso", name: "Hueso", size: [54, 37], confirmed: false },
    { id: "circulo", name: "Círculo", size: [40, 40], confirmed: false },
    { id: "corazon", name: "Corazón", size: [46, 44], confirmed: false },
  ],

};

export default function PlacasPage() {
  return (
    <>
      <Header />
      <PlacasCatalog catalog={catalog} />
      <Footer />
    </>
  );
}
