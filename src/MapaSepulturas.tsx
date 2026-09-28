import { useState } from "react";
import { Cross, MapPinned, X } from "lucide-react";

type Registro = {
  id: number;
  nome: string;
  cemiterio: string;
  talhao: string;
  quadra: string;
  fila: string;
  sepultura: string;
  nascimento?: string;
  falecimento?: string;
  sepultamento?: string;
};

type Props = {
  registros: Registro[];
};

export default function MapaSepulturas({ registros }: Props) {
  const [selecionada, setSelecionada] = useState<Registro | null>(null);

  const sepulturas = Array.from({ length: 40 }, (_, index) => {
    const numero = String(index + 1).padStart(3, "0");

    const registro = registros.find((r) => {
      const valor = r.sepultura.toLowerCase();

      return (
        valor === numero.toLowerCase() ||
        valor.endsWith(`-${numero}`) ||
        valor.includes(numero)
      );
    });

    return { numero, registro };
  });

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
          <MapPinned />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Mapa de Sepulturas
          </h1>

          <p className="mt-1 text-slate-500">
            Localização e rastreabilidade das sepulturas.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border bg-white p-5">
        <div className="flex flex-wrap gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-emerald-500" />
            Livre
          </div>

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded bg-red-500" />
            Ocupada
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 sm:p-6">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
          {sepulturas.map((sepultura) => {
            const ocupada = !!sepultura.registro;

            return (
              <button
                key={sepultura.numero}
                onClick={() =>
                  ocupada && setSelecionada(sepultura.registro!)
                }
                className={`aspect-square rounded-xl border-2 transition hover:scale-105 ${
                  ocupada
                    ? "border-red-400 bg-red-50 text-red-700"
                    : "border-emerald-400 bg-emerald-50 text-emerald-700"
                }`}
              >
                <div className="flex h-full flex-col items-center justify-center">
                  <Cross size={20} />

                  <span className="mt-1 text-xs font-bold">
                    {sepultura.numero}
                  </span>

                  <span className="mt-1 text-[9px]">
                    {ocupada ? "Ocupada" : "Livre"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Total de sepulturas
          </p>
          <p className="mt-1 text-2xl font-bold">
            {sepulturas.length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Ocupadas
          </p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {sepulturas.filter((s) => s.registro).length}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">
            Livres
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {sepulturas.filter((s) => !s.registro).length}
          </p>
        </div>
      </div>

      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Detalhes da sepultura
                </p>

                <h2 className="text-2xl font-bold">
                  Sepultura {selecionada.sepultura}
                </h2>
              </div>

              <button
                onClick={() => setSelecionada(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>

            <div className="mb-6 rounded-xl bg-red-50 p-4">
              <p className="text-xs font-semibold uppercase text-red-600">
                Falecido
              </p>

              <p className="mt-1 text-xl font-bold">
                {selecionada.nome}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Info titulo="Cemitério" valor={selecionada.cemiterio} />
              <Info titulo="Talhão" valor={selecionada.talhao} />
              <Info titulo="Quadra" valor={selecionada.quadra} />
              <Info titulo="Fila" valor={selecionada.fila} />
              <Info titulo="Sepultura" valor={selecionada.sepultura} />
              <Info titulo="Nascimento" valor={selecionada.nascimento || "—"} />
              <Info titulo="Falecimento" valor={selecionada.falecimento || "—"} />
              <Info
                titulo="Sepultamento"
                valor={selecionada.sepultamento || "—"}
              />
            </div>

            <div className="mt-6 rounded-xl bg-slate-100 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Rastreabilidade
              </p>

              <p className="mt-2 text-sm font-medium">
                {selecionada.nome}
                {" → "}
                {selecionada.cemiterio}
                {" → "}
                {selecionada.talhao}
                {" → "}
                {selecionada.quadra}
                {" → "}
                {selecionada.fila}
                {" → "}
                {selecionada.sepultura}
              </p>
            </div>

            <button
              onClick={() => setSelecionada(null)}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-3">
      <p className="text-xs text-slate-500">
        {titulo}
      </p>

      <p className="mt-1 font-semibold">
        {valor || "—"}
      </p>
    </div>
  );
}
