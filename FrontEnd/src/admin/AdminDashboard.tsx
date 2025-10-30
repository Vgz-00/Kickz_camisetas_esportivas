import { useEffect, useState } from "react";
import { VictoryPie, VictoryLabel, VictoryTheme, VictoryTooltip } from "victory";
import { Card, CardContent } from "../components/ui/card";
import { useAdminStore } from "./context/AdminContext"; 
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL;

type DadosGeraisType = {
  totais: {
    clientes: number;
    pedidos: number;
    camisas: number;
  };
 
  
};

type CamisasPorMarcaType = {
  marca: string;
  totalCamisas: number; 
};

type CamisaMaisVendidaItem = {
  camisa: {
    id: number;
    modelo: string;
    preco: number;
    marca: { nome: string };
  };
  totalVendido: number;
};

export default function AdminDashboard() {
  const { admin, deslogaAdmin } = useAdminStore(); 
  const navigate = useNavigate();

  const [dados, setDados] = useState<DadosGeraisType>({
    totais: { clientes: 0, pedidos: 0, camisas: 0 },
   
  });
  const [camisasMarca, setCamisasMarca] = useState<CamisasPorMarcaType[]>([]);
  const [maisVendidas, setMaisVendidas] = useState<CamisaMaisVendidaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComToken = (url: string) => {
    if (!admin.token) {
        throw new Error("Token de administrador ausente.");
    }

    return fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin.token}`, 
        },
    });
  };

  useEffect(() => {
    async function carregarDados() {
        setLoading(true);
        
        if (!admin.token) {
            toast.error("Sessão expirada. Faça login novamente.");
            navigate("/admin/login", { replace: true });
            return;
        }

        try {
            const [resGerais, resMarcas, resVendidas] = await Promise.all([
                fetchComToken(`${apiUrl}/dashboard/gerais`),
                fetchComToken(`${apiUrl}/dashboard/camisasMarca`), 
                fetchComToken(`${apiUrl}/dashboard/camisasMaisVendidas`),
            ]);

            const handleAuthError = (response: Response) => {
                if (response.status === 401) {
                    deslogaAdmin();
                    navigate("/admin/login", { replace: true });
                    toast.error("Não autorizado! Token expirado ou inválido.");
                    throw new Error("401 Unauthorized"); 
                }
            };
            
            handleAuthError(resGerais);
            handleAuthError(resMarcas);
            handleAuthError(resVendidas);

            const dadosGerais = await resGerais.json();
            const dadosMarcas = await resMarcas.json();
            const dadosVendidas = await resVendidas.json();

            setDados({
                totais: dadosGerais.totais,
            });
            setCamisasMarca(dadosMarcas);
            setMaisVendidas(dadosVendidas);

        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
            if (error !== "401 Unauthorized") {
                 toast.error("Falha ao carregar dados. Verifique a API.");
            }
        } finally {
            setLoading(false);
        }
    }

    carregarDados();
  }, [admin.token, navigate, deslogaAdmin]); 
  const dadosMarcas = camisasMarca.map(item => ({
    x: item.marca,
    y: item.totalCamisas, 
  }));

  const dadosMaisVendidas = maisVendidas.map(item => ({
  x: item.camisa.modelo, 
  y: item.totalVendido,
}));
  
  if (loading) {
    return (
        <div className="container mx-auto mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6">Carregando Dashboard...</h2>
            <p>Aguarde, verificando dados e autenticação.</p>
        </div>
    );
  }
  
  const coresGraficos = [
  "#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#f97316", "#14b8a6", "#b91c1c", "#6366f1", "#f43f5e"
];

  return (
  <div className="container mx-auto mt-24 px-4">
    <h2 className="text-3xl font-bold mb-8 text-center">Visão Geral do Sistema</h2>

    <div className="flex justify-center mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-gray-100 shadow-md border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-700">{dados.totais.clientes}</div>
            <p className="text-gray-700 mt-2 font-semibold">Clientes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 shadow-md border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-700">{dados.totais.pedidos}</div>
            <p className="text-gray-700 mt-2 font-semibold">Pedidos</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-100 shadow-md border border-gray-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-yellow-700">{dados.totais.camisas}</div>
            <p className="text-gray-700 mt-2 font-semibold">Camisas</p>
          </CardContent>
        </Card>
      </div>
    </div>

    <div className="flex flex-col md:flex-row justify-center items-center gap-8">
      <div className="bg-gray-100 shadow-md p-6 rounded-lg flex justify-center items-center">
    {camisasMarca.length > 0 ? (
      <svg viewBox="0 0 450 450" className="w-96 h-96">
        <VictoryPie
          standalone={false}
          width={450}
          height={450}
          data={dadosMarcas}
          innerRadius={60}
          labelRadius={110}
          colorScale={coresGraficos}
          theme={VictoryTheme.material}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          labelComponent={<VictoryTooltip />}
          style={{
            labels: { fontSize: 12, fill: "#000", fontWeight: "bold" },
            data: { cursor: "pointer" }
          }}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 16, fill: "#f00", fontWeight: "bold" }}
          x={225}
          y={225}
          text={["Camisas", "por Marca"]}
        />
      </svg>
    ) : (
      <div className="flex items-center justify-center w-96 h-96 text-gray-500">
        Gráfico de Marcas indisponível
      </div>
    )}
  </div>

      <div className="bg-gray-100 shadow-md p-6 rounded-lg flex justify-center items-center">
    {maisVendidas.length > 0 ? (
      <svg viewBox="0 0 450 450" className="w-96 h-96">
        <VictoryPie
          standalone={false}
          width={450}
          height={450}
          data={dadosMaisVendidas}
          innerRadius={60}
          labelRadius={110}
          colorScale={coresGraficos}
          labels={({ datum }) => `${datum.x}: ${datum.y}`}
          labelComponent={<VictoryTooltip />}
          style={{
            labels: { fontSize: 12, fill: "#000", fontWeight: "bold" },
            data: { cursor: "pointer" }
          }}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 16, fill: "#f00", fontWeight: "bold" }}
          x={225}
          y={225}
          text={["Top Camisas", "Vendidas"]}
        />
      </svg>
      ) : (
      <div className="flex items-center justify-center w-96 h-96 text-gray-500">
        Gráfico de Mais Vendidas indisponível
      </div>
      )}
    </div>
  </div>
</div>
);

}