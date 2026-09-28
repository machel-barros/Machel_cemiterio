import { useState } from "react";
import MapaSepulturas from "./MapaSepulturas";
import {
  Search,
  Shield,
  MapPin,
  Landmark,
  Users,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Menu,
  X,
} from "lucide-react";

type Falecido = {
  id: number;
  nome: string;
  nascimento: string;
  falecimento: string;
  sepultamento: string;
  cemiterio: string;
  talhao: string;
  quadra: string;
  fila: string;
  sepultura: string;
};

const vazio: Omit<Falecido, "id"> = {
  nome: "",
  nascimento: "",
  falecimento: "",
  sepultamento: "",
  cemiterio: "",
  talhao: "",
  quadra: "",
  fila: "",
  sepultura: "",
};

function App() {
  const [pagina, setPagina] = useState("inicio");
  const [menu, setMenu] = useState(false);

  const [registros, setRegistros] = useState<Falecido[]>(() => {
    const dados = localStorage.getItem("cemiterio_registros");
    return dados ? JSON.parse(dados) : [];
  });

  const [pesquisa, setPesquisa] = useState("");
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<number | null>(null);

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function guardar(dados: Falecido[]) {
    setRegistros(dados);
    localStorage.setItem("cemiterio_registros", JSON.stringify(dados));
  }

  function login() {
    if (usuario === "admin" && senha === "1234") {
      setErro("");
      setPagina("dashboard");
      setUsuario("");
      setSenha("");
    } else {
      setErro("Utilizador ou senha incorretos.");
    }
  }

  function salvarRegistro() {
    if (!form.nome || !form.cemiterio || !form.sepultura) {
      alert("Preencha Nome, Cemitério e Sepultura.");
      return;
    }

    if (editando !== null) {
      guardar(
        registros.map((r) =>
          r.id === editando ? { ...form, id: editando } : r
        )
      );
      alert("Registro atualizado com sucesso!");
    } else {
      guardar([...registros, { ...form, id: Date.now() }]);
      alert("Falecido cadastrado com sucesso!");
    }

    setForm(vazio);
    setEditando(null);
    setPagina("falecidos");
  }

  function editar(registro: Falecido) {
    setForm({
      nome: registro.nome,
      nascimento: registro.nascimento,
      falecimento: registro.falecimento,
      sepultamento: registro.sepultamento,
      cemiterio: registro.cemiterio,
      talhao: registro.talhao,
      quadra: registro.quadra,
      fila: registro.fila,
      sepultura: registro.sepultura,
    });

    setEditando(registro.id);
    setPagina("cadastro");
  }

  function eliminar(id: number) {
    if (confirm("Deseja eliminar este registro?")) {
      guardar(registros.filter((r) => r.id !== id));
    }
  }

  function logout() {
    setPagina("inicio");
    setMenu(false);
  }

  const resultados = registros.filter((r) => {
    const termo = pesquisa.toLowerCase().trim();

    return (
      r.nome.toLowerCase().includes(termo) ||
      r.sepultura.toLowerCase().includes(termo)
    );
  });

  if (pagina === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
          <Shield className="mx-auto mb-4 text-blue-400" size={45} />

          <h1 className="text-center text-2xl font-bold">
            Área Administrativa
          </h1>

          <p className="mb-7 mt-2 text-center text-sm text-slate-400">
            Acesso restrito
          </p>

          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Utilizador"
            className="mb-4 w-full rounded-xl border border-white/10 bg-slate-900 p-4 outline-none"
          />

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Senha"
            className="mb-4 w-full rounded-xl border border-white/10 bg-slate-900 p-4 outline-none"
          />

          {erro && <p className="mb-4 text-sm text-red-400">{erro}</p>}

          <button
            onClick={login}
            className="w-full rounded-xl bg-blue-600 p-4 font-semibold hover:bg-blue-500"
          >
            Entrar
          </button>

          <button
            onClick={() => setPagina("inicio")}
            className="mt-5 w-full text-sm text-slate-400"
          >
            ← Voltar
          </button>

          <p className="mt-6 text-center text-xs text-slate-500">
            Demonstração: admin / 1234
          </p>
        </div>
      </div>
    );
  }

  if (pagina === "cadastro") {
    return (
      <AdminLayout setPagina={setPagina} logout={logout}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-6 text-2xl font-bold">
            {editando ? "Editar Falecido" : "Cadastrar Falecido"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Nome completo"
              value={form.nome}
              onChange={(v) => setForm({ ...form, nome: v })}
            />

            <Campo
              label="Data de nascimento"
              type="date"
              value={form.nascimento}
              onChange={(v) => setForm({ ...form, nascimento: v })}
            />

            <Campo
              label="Data de falecimento"
              type="date"
              value={form.falecimento}
              onChange={(v) => setForm({ ...form, falecimento: v })}
            />

            <Campo
              label="Data de sepultamento"
              type="date"
              value={form.sepultamento}
              onChange={(v) => setForm({ ...form, sepultamento: v })}
            />

            <Campo
              label="Cemitério"
              value={form.cemiterio}
              onChange={(v) => setForm({ ...form, cemiterio: v })}
            />

            <Campo
              label="Talhão"
              value={form.talhao}
              onChange={(v) => setForm({ ...form, talhao: v })}
            />

            <Campo
              label="Quadra"
              value={form.quadra}
              onChange={(v) => setForm({ ...form, quadra: v })}
            />

            <Campo
              label="Fila"
              value={form.fila}
              onChange={(v) => setForm({ ...form, fila: v })}
            />

            <Campo
              label="Número da sepultura"
              value={form.sepultura}
              onChange={(v) => setForm({ ...form, sepultura: v })}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={salvarRegistro}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              <Plus size={19} />
              {editando ? "Atualizar" : "Cadastrar"}
            </button>

            <button
              onClick={() => {
                setForm(vazio);
                setEditando(null);
                setPagina("falecidos");
              }}
              className="rounded-xl border border-white/10 px-6 py-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (pagina === "falecidos") {
    return (
      <AdminLayout setPagina={setPagina} logout={logout}>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Falecidos</h2>
              <p className="text-sm text-slate-400">
                Registros cadastrados no sistema
              </p>
            </div>

            <button
              onClick={() => {
                setForm(vazio);
                setEditando(null);
                setPagina("cadastro");
              }}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold"
            >
              <Plus size={18} />
              Novo cadastro
            </button>
          </div>

          {registros.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              Nenhum falecido cadastrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Cemitério</th>
                    <th className="p-3">Sepultura</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {registros.map((r) => (
                    <tr key={r.id} className="border-b border-white/5">
                      <td className="p-3">{r.nome}</td>
                      <td className="p-3">{r.cemiterio}</td>
                      <td className="p-3">
                        {r.talhao} / {r.quadra} / {r.fila} / {r.sepultura}
                      </td>
                      <td className="flex gap-3 p-3">
                        <button
                          onClick={() => editar(r)}
                          className="text-blue-400"
                          title="Editar"
                        >
                          <Pencil size={19} />
                        </button>

                        <button
                          onClick={() => eliminar(r.id)}
                          className="text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  if (pagina === "mapa") {
    return (
      <AdminLayout setPagina={setPagina} logout={logout}>
        <MapaSepulturas registros={registros} />
      </AdminLayout>
    );
  }

  if (pagina === "dashboard") {
    const cemiterios = new Set(registros.map((r) => r.cemiterio)).size;

    return (
      <AdminLayout setPagina={setPagina} logout={logout}>
        <h2 className="mb-2 text-2xl font-bold">Dashboard</h2>

        <p className="mb-7 text-sm text-slate-400">
          Visão geral do sistema de gestão do cemitério.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            titulo="Falecidos"
            valor={registros.length}
            icon={<Users />}
          />

          <Stat
            titulo="Sepulturas"
            valor={registros.length}
            icon={<MapPin />}
          />

          <Stat
            titulo="Cemitérios"
            valor={cemiterios}
            icon={<Landmark />}
          />

          <Stat
            titulo="Registros"
            valor={registros.length}
            icon={<LayoutDashboard />}
          />
        </div>

        <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold">Estado do sistema</h3>

          <p className="mt-2 text-sm text-slate-400">
            O sistema está funcionando. Os registros são guardados
            localmente no navegador através do armazenamento local.
          </p>

          <button
            onClick={() => setPagina("cadastro")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold"
          >
            <Plus size={18} />
            Cadastrar falecido
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Cemitério Digital</h1>
            <p className="text-xs text-slate-400">
              Gestão e rastreabilidade de sepulturas
            </p>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <button onClick={() => setPagina("inicio")}>Início</button>

            <button
              onClick={() => setPagina("login")}
              className="flex items-center gap-2"
            >
              <Shield size={17} />
              Área ADM
            </button>
          </nav>

          <button
            onClick={() => setMenu(!menu)}
            className="md:hidden"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>

        {menu && (
          <div className="border-t border-white/10 p-5 md:hidden">
            <button
              onClick={() => {
                setPagina("login");
                setMenu(false);
              }}
              className="flex items-center gap-2"
            >
              <Shield size={18} />
              Área ADM
            </button>
          </div>
        )}
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <Landmark className="mx-auto mb-6 text-blue-400" size={50} />

          <h2 className="text-4xl font-bold md:text-6xl">
            Encontre uma sepultura
            <span className="block text-blue-400">de forma simples.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-slate-400">
            Sistema web para gestão e rastreabilidade de sepulturas em
            cemitérios.
          </p>

          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center rounded-xl border border-white/10 bg-white/5 px-4">
              <Search className="mr-3 text-slate-500" />

              <input
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                placeholder="Nome do falecido ou número da sepultura"
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>

            <button
              onClick={() => {
                if (!pesquisa.trim()) {
                  alert("Digite um nome ou número de sepultura.");
                }
              }}
              className="rounded-xl bg-blue-600 px-7 py-4 font-semibold hover:bg-blue-500"
            >
              Pesquisar
            </button>
          </div>
        </section>

        {pesquisa.trim() && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <h3 className="mb-5 text-xl font-bold">Resultados</h3>

            {resultados.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
                Nenhum registro encontrado.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {resultados.map((r) => (
                  <div
                    key={r.id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg"
                  >
                    <div className="border-b border-white/10 bg-white/5 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                            Falecido
                          </p>

                          <h4 className="mt-1 text-xl font-bold">
                            {r.nome}
                          </h4>
                        </div>

                        <div className="rounded-xl bg-blue-500/10 px-3 py-2 text-center">
                          <p className="text-[10px] uppercase text-blue-300">
                            Sepultura
                          </p>
                          <p className="font-bold text-blue-400">
                            {r.sepultura}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Localização e rastreabilidade
                      </p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Cemitério</span>
                          <span className="text-right font-medium">
                            {r.cemiterio || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Talhão</span>
                          <span className="font-medium">{r.talhao || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Quadra</span>
                          <span className="font-medium">{r.quadra || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Fila</span>
                          <span className="font-medium">{r.fila || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-500">Sepultamento</span>
                          <span className="font-medium">
                            {r.sepultamento || "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                          Rastreabilidade
                        </p>

                        <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
                          {r.nome}
                          {" → "}
                          {r.cemiterio || "Cemitério"}
                          {" → "}
                          {r.talhao || "Talhão"}
                          {" → "}
                          {r.quadra || "Quadra"}
                          {" → "}
                          {r.fila || "Fila"}
                          {" → "}
                          {r.sepultura}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-20 md:grid-cols-3">
          <Info
            icon={<Search />}
            titulo="Pesquisa pública"
            texto="Pesquise pelo nome do falecido ou número da sepultura."
          />

          <Info
            icon={<MapPin />}
            titulo="Rastreabilidade"
            texto="Identifique exatamente a localização da sepultura."
          />

          <Info
            icon={<Shield />}
            titulo="Área administrativa"
            texto="Gestores autorizados podem cadastrar e administrar os registros."
          />
        </section>
      </main>

      <footer className="border-t border-white/10 p-8 text-center text-sm text-slate-500">
        © 2026 Cemitério Digital — Projeto Acadêmico
      </footer>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={label}
      className="rounded-xl border border-white/10 bg-slate-900 p-4 outline-none focus:border-blue-500"
    />
  );
}

function Stat({
  titulo,
  valor,
  icon,
}: {
  titulo: string;
  valor: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-blue-400">{icon}</div>
      <p className="text-sm text-slate-400">{titulo}</p>
      <p className="mt-2 text-3xl font-bold">{valor}</p>
    </div>
  );
}

function Info({
  icon,
  titulo,
  texto,
}: {
  icon: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 text-blue-400">{icon}</div>
      <h3 className="font-semibold">{titulo}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{texto}</p>
    </div>
  );
}

function AdminLayout({
  children,
  setPagina,
  logout,
}: {
  children: React.ReactNode;
  setPagina: (pagina: string) => void;
  logout: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed hidden h-screen w-64 border-r border-white/10 bg-slate-950 p-5 md:block">
        <h1 className="text-xl font-bold">Cemitério Digital</h1>
        <p className="mb-8 text-xs text-slate-500">
          Painel administrativo
        </p>

        <div className="space-y-2">
          <button
            onClick={() => setPagina("dashboard")}
            className="w-full rounded-xl p-3 text-left hover:bg-white/10"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setPagina("falecidos")}
            className="w-full rounded-xl p-3 text-left hover:bg-white/10"
          >
            👤 Falecidos
          </button>

          <button
            onClick={() => setPagina("cadastro")}
            className="w-full rounded-xl p-3 text-left hover:bg-white/10"
          >
            ➕ Novo cadastro
          </button>

          <button
            onClick={() => setPagina("mapa")}
            className="w-full rounded-xl p-3 text-left hover:bg-white/10"
          >
            🗺️ Mapa de sepulturas
          </button>

          <button
            onClick={logout}
            className="mt-8 flex w-full items-center gap-2 rounded-xl p-3 text-left text-red-400 hover:bg-white/10"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className="md:ml-64">
        <div className="border-b border-white/10 p-4 md:hidden">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPagina("dashboard")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              📊 Dashboard
            </button>

            <button
              onClick={() => setPagina("falecidos")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              👤 Falecidos
            </button>

            <button
              onClick={() => setPagina("cadastro")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              ➕ Cadastro
            </button>

            <button
              onClick={() => setPagina("mapa")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              🗺️ Mapa
            </button>

            <button
              onClick={logout}
              className="rounded-xl bg-red-500/10 px-4 py-2 text-red-400"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

export default App;
