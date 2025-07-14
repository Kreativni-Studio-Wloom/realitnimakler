import { FaCamera, FaGavel, FaHome, FaBalanceScale, FaHandshake, FaChartLine } from "react-icons/fa";

const services = [
  {
    icon: <FaBalanceScale className="text-gold-500 text-3xl mb-2" />,
    title: "Odhad tržní ceny",
    desc: "Profesionální stanovení reálné hodnoty vaší nemovitosti.",
  },
  {
    icon: <FaCamera className="text-gold-500 text-3xl mb-2" />,
    title: "Profesionální fotografie a video",
    desc: "Atraktivní prezentace nemovitosti pro maximální zájem.",
  },
  {
    icon: <FaHome className="text-gold-500 text-3xl mb-2" />,
    title: "Home staging",
    desc: "Příprava interiéru pro lepší dojem a rychlejší prodej.",
  },
  {
    icon: <FaGavel className="text-gold-500 text-3xl mb-2" />,
    title: "Právní servis",
    desc: "Kompletní právní zajištění prodeje/pronájmu.",
  },
  {
    icon: <FaHandshake className="text-gold-500 text-3xl mb-2" />,
    title: "Hypoteční poradenství",
    desc: "Pomoc s financováním a výběrem hypotéky.",
  },
  {
    icon: <FaChartLine className="text-gold-500 text-3xl mb-2" />,
    title: "Marketing nemovitosti",
    desc: "Cílená propagace na realitních serverech a sociálních sítích.",
  },
];

const Services = () => (
  <section id="sluzby" className="py-24 bg-white">
    <div className="max-w-5xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Služby</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-neutral-50 rounded-xl shadow-md p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-xl duration-200 group"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-gold-700 transition-colors">{s.title}</h3>
            <p className="text-neutral-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services; 