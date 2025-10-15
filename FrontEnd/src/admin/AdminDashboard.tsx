import { useEffect, useState } from "react"
import { VictoryPie, VictoryLabel, VictoryTheme } from "victory"
import { Card, CardContent } from "../components/ui/card"

const apiUrl = import.meta.env.VITE_API_URL

type DadosGeraisType = {
  clientes: number
  pedidos: number
  camisas: number
  totalVendas: number
}

type CamisasPorMarcaType = {
  marca: string
  num: number
}

type CamisaMaisVendidaType = {
  camisaId: number
  modelo: string
  foto: string
  quantidadeVendida: number
}

export default function AdminDashboard() {
  const [dados, setDados] = useState<DadosGeraisType>({} as DadosGeraisType)
  const [camisasMarca, setCamisasMarca] = useState<CamisasPorMarcaType[]>([])
  const [maisVendidas, setMaisVendidas] = useState<CamisaMaisVendidaType[]>([])

  useEffect(() => {
    async function carregarDados() {
      const [resGerais, resMarcas, resVendidas] = await Promise.all([
        fetch(`${apiUrl}/dashboard/gerais`),
        fetch(`${apiUrl}/dashboard/camisasPorMarca`),
        fetch(`${apiUrl}/dashboard/camisasMaisVendidas`)
      ])

      const dadosGerais = await resGerais.json()
      const dadosMarcas = await resMarcas.json()
      const dadosVendidas = await resVendidas.json()

      setDados(dadosGerais)
      setCamisasMarca(dadosMarcas)
      setMaisVendidas(dadosVendidas)
    }

    carregarDados()
  }, [])

  const dadosMarcas = camisasMarca.map(item => ({
    x: item.marca,
    y: item.num
  }))

  return (
    <div className="container mx-auto mt-24">
      <h2 className="text-3xl font-bold mb-6 text-center">Visão Geral do Sistema</h2>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-blue-600">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{dados.clientes}</div>
            <p className="text-gray-600 dark:text-gray-300">Clientes</p>
          </CardContent>
        </Card>

        <Card className="border-green-600">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{dados.pedidos}</div>
            <p className="text-gray-600 dark:text-gray-300">Pedidos</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-600">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-700">{dados.camisas}</div>
            <p className="text-gray-600 dark:text-gray-300">Camisas</p>
          </CardContent>
        </Card>

        <Card className="border-red-600">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-red-700">
              R$ {dados.totalVendas?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-gray-600 dark:text-gray-300">Total de Vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="flex flex-wrap justify-center gap-10">
        <svg viewBox="30 55 400 400" className="max-w-sm">
          <VictoryPie
            standalone={false}
            width={400}
            height={400}
            data={dadosMarcas}
            innerRadius={50}
            labelRadius={80}
            theme={VictoryTheme.clean}
            style={{
              labels: {
                fontSize: 10,
                fill: "#fff",
                fontFamily: "Arial",
                fontWeight: "bold"
              }
            }}
          />
          <VictoryLabel
            textAnchor="middle"
            style={{
              fontSize: 12,
              fill: "#f00",
              fontFamily: "Arial",
              fontWeight: "bold"
            }}
            x={200}
            y={200}
            text={["Camisas", "por Marca"]}
          />
        </svg>

        <div className="max-w-md w-full">
          <h3 className="text-xl font-semibold mb-3 text-center">Top 5 Camisas Mais Vendidas</h3>
          <div className="grid gap-3">
            {maisVendidas.map((c) => (
              <div
                key={c.camisaId}
                className="flex items-center gap-3 border p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <img src={c.foto} alt={c.modelo} className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{c.modelo}</p>
                  <p className="text-sm text-gray-500">Vendidas: {c.quantidadeVendida}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
