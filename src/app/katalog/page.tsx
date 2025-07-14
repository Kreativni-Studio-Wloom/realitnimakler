"use client";

import Properties from "@/components/Properties";
import Head from "next/head";

export default function Katalog() {
  return (
    <>
      <Head>
        <title>Katalog nemovitostí | FN Reality</title>
        <meta name="description" content="Kompletní katalog všech nemovitostí v nabídce realitního makléře František Novák." />
      </Head>
      <Properties showAll />
    </>
  );
} 