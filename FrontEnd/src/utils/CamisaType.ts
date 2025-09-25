import type { MarcaType } from "./MarcaType"

export type CamisaType = {
    id: number
    modelo: string
    preco: number
    foto: string
    createdAt: Date
    updatedAt: Date
    categoria: string
    destaque: boolean
    marcaId: number
    marca: MarcaType
}