'use client';

import { useState, useEffect } from "react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      jmeno: form.jmeno.value,
      email: form.email.value,
      telefon: form.telefon.value,
      zprava: form.zprava.value,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        alert('Chyba při odesílání. Zkuste to prosím později.');
      }
    } catch (err) {
      alert('Chyba při odesílání. Zkuste to prosím později.');
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <section id="kontakt" className="py-24 bg-neutral-100">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-start">
        <div>
          {/* <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Realitní kancelář</h2> */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Kontaktujte mě</h2>
          {submitted ? (
            <div className="bg-green-100 text-green-800 rounded-xl p-8 text-xl font-semibold text-center shadow-md">Požadavek byl přijat. Ozvu se vám co nejdříve.</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-8 rounded-xl shadow-md">
              <input type="text" name="jmeno" placeholder="Vaše jméno" required className="border rounded px-4 py-2" />
              <input type="email" name="email" placeholder="E-mail" required className="border rounded px-4 py-2" />
              <input type="tel" name="telefon" placeholder="Telefon" className="border rounded px-4 py-2" />
              <textarea name="zprava" placeholder="Zpráva" required className="border rounded px-4 py-2 min-h-[100px]" />
              <button type="submit" className="bg-black hover:bg-neutral-800 text-white font-semibold rounded-full px-6 py-3 mt-2 transition-colors">Odeslat zprávu</button>
            </form>
          )}
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Realitní kancelář</h2>
          <iframe
            title="Mapa lokalita"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2563.123456789!2d14.42076!3d50.08804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDA1JzE3LjAiTiAxNMKwMjUnMTQuOCJF!5e0!3m2!1scs!2scz!4v1234567890!5m2!1scs!2scz"
            width="100%"
            height="320"
            className="rounded-xl border-0 w-full self-start"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="bg-white p-8 rounded-xl shadow-md mt-8 space-y-2 text-base w-full max-w-md mx-auto">
            <div className="font-semibold text-lg mb-2">Adresa</div>
            <div className="mb-2">Staroměstské náměstí 122, Praha</div>
            <div><span className="font-semibold">Telefon:</span> <a href="tel:+420123456789" className="text-gold-700 hover:underline">+420 123 456 789</a></div>
            <div><span className="font-semibold">E-mail:</span> <a href="mailto:makler@email.cz" className="text-gold-700 hover:underline">makler@email.cz</a></div>
            <div><span className="font-semibold">IČO:</span> 12345678</div>
            <div className="flex gap-4 mt-2">
              <a href="https://wa.me/420123456789" target="_blank" rel="noopener" className="hover:text-gold-700 underline">WhatsApp</a>
              <a href="https://m.me/uzivatel" target="_blank" rel="noopener" className="hover:text-gold-700 underline">Messenger</a>
              <a href="https://instagram.com/uzivatel" target="_blank" rel="noopener" className="hover:text-gold-700 underline">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 