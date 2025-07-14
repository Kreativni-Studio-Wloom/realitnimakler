import Image from "next/image";

const Info = () => (
  <section id="info" className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/assets/makler.jpg"
          alt="František Novák - portrét"
          width={340}
          height={420}
          className="rounded-2xl object-cover shadow-xl w-[340px] h-[420px]"
          priority
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">O mně</h2>
        <ul className="list-disc pl-6 space-y-4 text-lg text-neutral-800">
          <li>Působím v&nbsp;Praze a Středočeském kraji</li>
          <li>V realitách od roku 2012</li>
          <li>Makléř společnosti <span className="font-bold text-gold-700">RE/MAX</span></li>
          <li>Spolupracuji s 10 dalšími kolegy, proto je proces prodeje vždy maximálně efektivní</li>
        </ul>
      </div>
    </div>
  </section>
);

export default Info; 