import React from "react";
import { formatCurrency } from "../lib/utils";

export default function Home() {
  const pratos = [
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8 md:mt-10">
            {pratos.map((p) => (
              <article
                key={p.titulo}
                className="bg-white border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition"
              >
                <div className="w-full aspect-[16/10] bg-gray-200" />

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">{p.titulo}</h3>
                  <p className="mt-1.5 text-gray-600">{p.desc}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-kaiserhaus-light-brown">
                  
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
    </>
  );
}
