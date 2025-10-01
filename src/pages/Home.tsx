import React from "react";
import { formatCurrency } from "../lib/utils";

interface Prato {
  titulo: string;
  desc: string;
  preco: number;
}

export default function Home(): React.JSX.Element {
  const pratos: Prato[] = [
    {
      titulo: "Eisbein",
      desc: "Joelho de porco defumado, crocante por fora e macio por dentro.",
      preco: 69.9,
    },
    {
      titulo: "Pretzel Clássico",
      desc: "Tradicional alemão com mostarda Dijon.",
      preco: 22.0,
    },
    {
      titulo: "Feijoada Completa",
      desc: "O tradicional prato brasileiro com carnes suínas e feijão.",
      preco: 49.9,
    },
  ];

  return (
    <>

      <section id="home" className="relative">

        <div className="relative w-full h-[68vh] md:h-[76vh] bg-gray-300">

          <div className="absolute inset-0 bg-black/55" />

          <div className="relative container mx-auto h-full px-4 flex items-center">
            <div className="max-w-[680px] text-white">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight md:tracking-[-0.01em] leading-[1.05] drop-shadow-sm">
                KAISERHAUS
              </h1>

              <p className="mt-4 text-base md:text-lg text-white/90 leading-relaxed">
                Da nossa cozinha para sua mesa, com o mesmo sabor de sempre
              </p>

              <a
                href="#menu"
                className="inline-flex items-center mt-6 rounded-md bg-kaiserhaus-dark-brown px-5 py-3 font-semibold text-white shadow hover:opacity-90 transition"
              >
                Faça seu pedido!
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="bg-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">
              <span className="text-kaiserhaus-dark-brown">ESTRELAS KAISERHAUS</span>
            </h2>
            <p className="text-gray-700">
              Conheça os pratos <span className="font-semibold">mais pedidos</span> da casa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 md:mt-10">
            {pratos.map((p) => (
              <article
                key={p.titulo}
                className="bg-white border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition"
              >
                <div className="w-full aspect-[16/10] bg-gray-200" />

                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{p.titulo}</h3>
                  <p className="mt-1.5 text-sm sm:text-base text-gray-600 line-clamp-2 min-h-[48px]">{p.desc}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-kaiserhaus-light-brown text-lg">
                      {formatCurrency(p.preco)}
                    </span>

                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium
                                 border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown
                                 hover:bg-kaiserhaus-dark-brown hover:text-white transition"

                    >
                      Adicionar ao carrinho
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-0.5 transition"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#menu"
              className="inline-flex items-center rounded-full bg-kaiserhaus-dark-brown px-6 py-3 font-semibold text-white hover:opacity-90 transition"
            >
              Veja o cardápio completo
            </a>
          </div>
        </div>
      </section>

      {/* Qualidade no seu Delivery (hero secundário) */}
      <section className="bg-[#f7efdf]">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="w-full h-64 md:h-[380px] rounded-xl bg-gray-200" />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🇩🇪🇧🇷</span>
              </div>
              <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-[#4a2f2a]">Qualidade no seu Delivery</h2>
              <p className="mt-4 text-gray-800 leading-relaxed max-w-xl">
                Cada pedido é preparado com cuidado da cozinha à entrega, com embalagens que
                <span className="font-semibold"> preservam</span> sabor e textura, garantindo a autêntica culinária alemã em sua mesa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promoções da Semana */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">
              Promoções da Semana
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 md:mt-10">
            {[1,2,3].map((i) => (
              <article
                key={`promo-${i}`}
                className="bg-white border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition"
              >
                <div className="w-full aspect-[16/10] bg-gray-200" />
                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Título da Promoção {i}</h3>
                  <p className="mt-1.5 text-sm sm:text-base text-gray-600 line-clamp-2 min-h-[48px]">Descrição breve do prato da promoção.</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-kaiserhaus-light-brown text-lg">{formatCurrency(34.9)}</span>
                      <span className="text-sm text-gray-500 line-through">{formatCurrency(44.9)}</span>
                    </div>
                    <button className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium border-kaiserhaus-dark-brown text-kaiserhaus-dark-brown hover:bg-kaiserhaus-dark-brown hover:text-white transition">
                      Adicionar ao carrinho
                      <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="bg-[#f5efe4]">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">Nossa História</h2>
              <p className="mt-4 text-gray-700">Há mais de 40 anos em São Paulo, a Kaiserhaus é sinônimo de tradição e autenticidade na gastronomia alemã.</p>
              <p className="mt-3 text-gray-700">Reconhecidos pela qualidade de seus pratos e pelo cuidado em cada detalhe, nos reinventamos e passamos a atuar exclusivamente no delivery, levando até sua casa o sabor e a tradição que marcaram nossa história.</p>
            </div>
            <div className="w-full h-64 md:h-[320px] rounded-xl bg-gray-200" />
          </div>
        </div>
      </section>

      {/* CTA Telefone */}
      <section className="relative">
        <div className="relative w-full h-56 md:h-64 bg-gray-300">
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative container mx-auto h-full px-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/90 text-lg">Prefere pedir por telefone?</p>
              <p className="mt-1 text-white text-2xl md:text-3xl font-extrabold">Ligue: (11) 98765-4321</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chefs */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight text-center">Conheça nossos chefs</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
            {[{nome:'Hans Müller', cidade:'Berlim'}, {nome:'Joao Pereira', cidade:'São Paulo'}].map((chef) => (
              <div key={chef.nome} className="flex flex-col items-center">
                <div className="w-56 h-64 rounded-xl bg-gray-200" />
                <div className="mt-4 text-center">
                  <p className="font-semibold text-gray-900">{chef.nome}</p>
                  <p className="text-sm text-gray-600">{chef.cidade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-[#f5efe4]">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">Nosso Manifesto</h2>
            <div className="mt-6 max-w-3xl mx-auto text-gray-800 leading-relaxed">
              <p>Na Kaiserhaus, tradição é um elo entre gerações. Valorizamos autenticidade, paciência e paixão no preparo, pois cada receita carrega histórias e transforma refeições em memórias.</p>
              <p className="mt-4">Unimos a força da culinária alemã à criatividade brasileira, criando experiências que preservam heranças e atravessam o tempo.</p>
            </div>
          </div>
          <div className="mt-10 flex items-center justify-between">
            <div className="hidden md:block w-24 h-40 bg-gray-200 rounded" />
            <div className="hidden md:block w-24 h-40 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    </>
  );
}