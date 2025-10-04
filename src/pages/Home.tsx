import React, { useEffect, useRef, useState } from "react";
import cervejas from "../assets/cervejas_home.jpeg";
import hansMuller from "../assets/HansMuller_home.png";
import joaoPereira from "../assets/JoaoPereira_home.png";
import contato1 from "../assets/Contato1.png";
import contato2 from "../assets/Contato2.png";
import restaurante from "../assets/Restaurante_home.png";
import chefComida from "../assets/chef_comida.png";
import bandeiras from "../assets/bandeiras.png";
import fundoHome from "../assets/fundo_home.png";
import wpp from "../assets/wpp.png";
import { useCart } from "../contexts/CartContext";
import { apiFetch } from "../utils/api";

interface Produto {
  id: string;
  titulo: string;
  preco: number;
  preco_promocional?: number;
}

export default function Home(): React.JSX.Element {
  const refParalaxe = useRef<HTMLDivElement | null>(null);
  const [deslocamentoParalaxe, setDeslocamentoParalaxe] = useState<number>(-10);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const { addItem } = useCart();

  // Buscar produtos do backend
  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const todosProdutos = await apiFetch<Produto[]>('/produtos');
        
        if (todosProdutos && todosProdutos.length > 0) {
          // Pegar os primeiros 3 produtos para exibir na home
          setProdutos(todosProdutos.slice(0, 3));
        } else {
          // produtos fictícios se não houver produtos no banco
          setProdutos([
            { id: '507f1f77bcf86cd799439011', titulo: 'Eisbein', preco: 45.90 },
            { id: '507f1f77bcf86cd799439012', titulo: 'Pretzel Clássico', preco: 18.50 },
            { id: '507f1f77bcf86cd799439013', titulo: 'Feijoada Completa', preco: 38.90 }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        //  produtos fictícios em caso de erro
        setProdutos([
          { id: '507f1f77bcf86cd799439011', titulo: 'Eisbein', preco: 45.90 },
          { id: '507f1f77bcf86cd799439012', titulo: 'Pretzel Clássico', preco: 18.50 },
          { id: '507f1f77bcf86cd799439013', titulo: 'Feijoada Completa', preco: 38.90 }
        ]);
      }
    };

    buscarProdutos();
  }, []);

  useEffect(() => {
    let idAnimacao = 0;
    const atualizar = (): void => {
      const elemento = refParalaxe.current;
      if (!elemento) return;

      const alturaViewport = window.innerHeight || document.documentElement.clientHeight;
      const retangulo = elemento.getBoundingClientRect();
      const topoElementoPagina = retangulo.top + window.scrollY; // posição absoluta do topo
      const alturaElemento = retangulo.height;
      const rolagemY = window.scrollY;

      
      const inicio = topoElementoPagina - alturaViewport;
      const fim = topoElementoPagina + alturaElemento;
      const limitado = Math.min(Math.max(rolagemY - inicio, 0), fim - inicio);
      const progresso = (fim - inicio) > 0 ? limitado / (fim - inicio) : 0;

      
      const faixa = 40; 
      let deslocamento = (progresso - 0.5) * faixa * 2;
      
      deslocamento = Math.max(Math.min(deslocamento, 25), -25);
      setDeslocamentoParalaxe(deslocamento);

      idAnimacao = requestAnimationFrame(atualizar);
    };

    idAnimacao = requestAnimationFrame(atualizar);
    window.addEventListener("resize", atualizar);
    return () => {
      cancelAnimationFrame(idAnimacao);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  // Função para adicionar produtos ao carrinho
  const handleAddToCart = (produto: Produto) => {
    const itemToAdd = {
      id: produto.id,
      titulo: produto.titulo,
      preco: produto.preco,
      preco_promocional: produto.preco_promocional,
      imagem: undefined
    };
    addItem(itemToAdd);
    alert(`${produto.titulo} adicionado ao carrinho!`);
  };

  return (
    <>
      {/* Botão WhatsApp Fixo */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 hover:scale-110 transition-transform duration-200"
      >
        <img src={wpp} alt="WhatsApp" className="w-14 h-14" />
      </a>

      <section id="home" className="relative">
        <div 
          className="relative w-full h-[calc(100vh-65px)] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fundoHome})` }}
        >
          <div className="absolute inset-0 bg-black/70" />

          <div className="relative container mx-auto h-full px-4 flex items-center">
            <div className="max-w-[680px] text-white mt-52">
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
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-6 mb-8 md:mb-10">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">
              <span className="text-kaiserhaus-dark-brown">ESTRELAS KAISERHAUS</span>
            </h2>
            <p className="text-gray-700 text-base md:text-lg">
              Conheça os pratos <span className="font-semibold">mais pedidos</span> da casa
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.slice(0, 3).map((produto, index) => {
              const descricoes = [
                "Joelho de porco defumado, crocante por fora e macio por dentro",
                "Tradicional alemão com mostarda Dijon",
                "O tradicional prato brasileiro com carnes suínas e feijão"
              ];
              
              return (
                <article key={produto.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Imagem {produto.titulo}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{produto.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {descricoes[index] || "Descrição do produto"}
                    </p>
                    <button 
                      onClick={() => handleAddToCart(produto)}
                      className="text-sm text-kaiserhaus-dark-brown font-medium hover:opacity-80 transition"
                    >
                      Adicionar ao carrinho →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <a
              href="#menu"
              className="inline-flex items-center rounded-full bg-kaiserhaus-dark-brown px-6 py-3 font-semibold text-white hover:opacity-90 transition"
            >
              Veja o cardápio completo
            </a>
          </div>
        </div>
      </section>

      {/* Qualidade no seu Delivery */}
      <section className="bg-[#f7efdf] h-[420px] relative">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 h-full">
            <div className="w-full h-full overflow-hidden">
              <img src={chefComida} alt="Chef preparando prato" className="w-full h-full object-cover object-[left_80%]" />
            </div>
            <div className="flex flex-col justify-center text-left px-8">
              <div className="mb-4">
                <img src={bandeiras} alt="Bandeiras Alemanha e Brasil" className="h-12 w-auto" />
              </div>
              <h2 className="text-3xl md:text-[32px] font-extrabold text-[#4A2C2A] tracking-tight">Qualidade no seu Delivery</h2>
              <p className="mt-4 text-gray-700">
                Cada pedido é preparado com cuidado da cozinha à entrega, com embalagens que
                <span className="font-bold"> preservam</span> sabor e textura, garantindo a autêntica culinária alemã em sua mesa.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden hidden md:block">
          <img src={chefComida} alt="Chef preparando prato" className="w-full h-full object-cover object-[left_80%]" />
        </div>
      </section>

      {/* Promoções da Semana */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight">
              Promoções da Semana
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bolinho */}
            <article className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem Bolinho</span>
              </div>
              <div className="p-4 relative">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Bolinho</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-montserrat font-light text-kaiserhaus-dark-brown">18</span>
                    <span className="text-lg font-montserrat font-light text-gray-500 line-through">25</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-8">
                  Frango, carne, mandioca, linguiça blumenau, chucrute, cerveja e queijo
                </p>
                <button className="absolute bottom-4 left-4 text-sm text-kaiserhaus-dark-brown font-medium hover:opacity-80 transition">
                  Adicionar ao carrinho →
                </button>
              </div>
            </article>

            {/* Saint Peter à Belle Meunière */}
            <article className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem Saint Peter</span>
              </div>
              <div className="p-4 relative">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Saint Peter à Belle Meunière</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-montserrat font-light text-kaiserhaus-dark-brown">54</span>
                    <span className="text-lg font-montserrat font-light text-gray-500 line-through">64</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-8">
                  Filé de tilápia com molho de manteiga e alcaparras
                </p>
                <button className="absolute bottom-4 left-4 text-sm text-kaiserhaus-dark-brown font-medium hover:opacity-80 transition">
                  Adicionar ao carrinho →
                </button>
              </div>
            </article>

            {/* Apfelstrudel */}
            <article className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Imagem Apfelstrudel</span>
              </div>
              <div className="p-4 relative">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">Apfelstrudel</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-montserrat font-light text-kaiserhaus-dark-brown">30</span>
                    <span className="text-lg font-montserrat font-light text-gray-500 line-through">40</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-8">
                  Folhado crocante recheado com maçã, canela e especiarias
                </p>
                <button className="absolute bottom-4 left-4 text-sm text-kaiserhaus-dark-brown font-medium hover:opacity-80 transition">
                  Adicionar ao carrinho →
                </button>
              </div>
            </article>
          </div>

          {/* Navegação */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="bg-[#f5efe4] h-[400px] relative">
        <div className="container mx-auto px-4 h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 h-full">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-[32px] font-extrabold text-[#4A2C2A] tracking-tight">Nossa História</h2>
              <p className="mt-4 text-gray-700">
                Há mais de 40 anos em São Paulo, a Kaiserhaus é <span className="font-bold">sinônimo de tradição e autenticidade</span> na gastronomia alemã.
              </p>
              <p className="mt-3 text-gray-700">
                Reconhecidos pela <span className="font-bold">qualidade</span> de seus pratos e pelo <span className="font-bold">cuidado</span> em cada detalhe, nos reinventamos e passamos a atuar <span className="font-bold">exclusivamente</span> no delivery, levando até sua casa o sabor e a tradição que marcaram nossa história.
              </p>
            </div>
            <div className="w-full h-full overflow-hidden">
              <img src={restaurante} alt="Interior do restaurante Kaiserhaus" className="w-full h-full object-cover object-right" />
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden hidden md:block">
          <img src={restaurante} alt="Interior do restaurante Kaiserhaus" className="w-full h-full object-cover object-right" />
        </div>
      </section>

 
      <div className="bg-white py-12"></div>

      {/* Telefone com Parallax (pesquisei e descobri que o parallax é a maneira de fazer a imagem acompanhar a tela) */}
      <section className="relative">
        <div ref={refParalaxe} className="relative w-full h-[35vh] md:h-[45vh] lg:h-[53vh] overflow-hidden">
          {/* Imagem maior que o container para efeito parallax */}
          <img
            src={cervejas}
            alt="Copos de cerveja no balcão"
            className="pointer-events-none absolute left-0 top-0 w-full object-cover block"
            style={{ height: "200%", top: "50%", transform: `translateY(calc(-50% + ${deslocamentoParalaxe}%))`, willChange: "transform", objectPosition: "center 85%" }}
          />

          {/* Frente escuro */}
          <div className="absolute inset-0 bg-black/45" />

          <div className="relative container mx-auto h-full px-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-white/90 text-lg">Prefere pedir por telefone?</p>
              <p className="mt-1 text-white text-2xl md:text-3xl font-extrabold">Ligue: (11) 98765-4321</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chefes */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <h2 className="text-2xl md:text-[32px] font-extrabold text-gray-900 tracking-tight text-center">Conheça nossos chefs</h2>


          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 items-start gap-10 md:gap-16">
            {/* Foto do alemao */}
            <div className="flex flex-col items-center">
              <div className="group relative w-[250px] sm:w-[290px] md:w-[310px] aspect-[3/4] overflow-hidden">
                <img src={hansMuller} alt="Hans Müller" className="absolute inset-0 h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-[#6f2c1f] opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center px-8">
                  <p className="text-white text-[22px] sm:text-[26px] md:text-[28px] font-light leading-snug text-center italic">“<span className="font-bold not-italic">Tradição</span><br/>que<br/>atravessa<br/>gerações”</p>
                </div>
              </div>
              <p className="mt-4 text-xl font-extrabold text-gray-900">Hans Müller<span className="font-normal text-gray-700">, Berlim</span></p>
            </div>

            {/* Foto Joao brasileiro */}
            <div className="flex flex-col items-center">
              <div className="group relative w-[250px] sm:w-[290px] md:w-[310px] aspect-[3/4] overflow-hidden">
                <img src={joaoPereira} alt="Joao Pereira" className="absolute inset-0 h-full w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-[#6f2c1f] opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center px-8">
                  <p className="text-white text-[22px] sm:text-[26px] md:text-[28px] font-light leading-snug text-center italic">“<span className="font-bold not-italic">Criatividade</span><br/>que<br/>renova a<br/>experiência”</p>
                </div>
              </div>
              <p className="mt-4 text-xl font-extrabold text-gray-900">João Pereira<span className="font-normal text-gray-700">, São Paulo</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="bg-[#f5efe4] min-h-[400px] flex items-center">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="relative">
            {/* Imagem esquerda */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <img src={contato1} alt="Ilustração decorativa" className="h-80 w-auto opacity-30" />
            </div>

          
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-[32px] font-extrabold text-[#4A2C2A] tracking-tight text-center">Nosso Manifesto</h2>
              <div className="mt-12 text-gray-700 leading-relaxed text-left">
                <p className="text-base">
                  Na Kaiserhaus, <span className="font-bold">tradição</span> é um elo entre <span className="font-bold">gerações</span>. 
                  Valorizamos autenticidade, paciência e paixão no <span className="font-bold">preparo</span>, pois cada receita carrega 
                  histórias e transforma <span className="font-bold">refeições em memórias</span>.
                </p>
                <p className="mt-3 text-base">
                  Unimos a força da culinária alemã à <span className="font-bold">criatividade</span> brasileira, criando 
                  <span className="font-bold"> experiências</span> que preservam heranças e atravessam o tempo.
                </p>
              </div>
            </div>

            {/* Imagem direita */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <img src={contato2} alt="Ilustração decorativa" className="h-80 w-auto opacity-30" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}