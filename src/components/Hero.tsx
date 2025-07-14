import Image from "next/image";

const Hero = () => {
  return (
    <section id="uvod" className="relative min-h-screen flex items-center justify-center bg-neutral-100 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col-reverse md:flex-row items-stretch justify-between py-32 px-4 gap-0">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center gap-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 drop-shadow-lg">František Novák</h1>
          <p className="text-xl md:text-2xl text-neutral-800 font-medium mb-4">Vaše jistota ve světě realit</p>
          <a href="#kontakt" className="inline-block bg-black hover:bg-neutral-800 text-white font-semibold rounded-full px-8 py-4 text-lg shadow-lg transition-colors">Chci prodat nemovitost</a>
        </div>
        {/* Divider přesunu sem, mezi obrázek a text, pouze pro md+ */}
        <div className="hidden md:flex items-center">
          <div className="h-[80%] min-h-[350px] w-px bg-neutral-300 mx-8" />
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center md:pr-8">
          <Image
            src="/assets/deal.png"
            alt="Realitní makléř - handshake a dům"
            width={480}
            height={480}
            className="object-contain max-w-full w-full h-auto m-0 p-0"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default Hero; 