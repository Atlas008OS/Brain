import { Megaphone, TrendingUp, Wallet, Workflow } from 'lucide-react'

export type Area = 'Ventas' | 'Marketing' | 'Operaciones' | 'Finanzas'

export const AREAS: Area[] = ['Ventas', 'Marketing', 'Operaciones', 'Finanzas']

export const AREA_ICONS: Record<Area, typeof TrendingUp> = {
  Ventas: TrendingUp,
  Marketing: Megaphone,
  Operaciones: Workflow,
  Finanzas: Wallet,
}

export const AREA_BADGE_STYLES: Record<Area, string> = {
  Ventas: 'bg-brand-blue/10 text-brand-blue',
  Marketing: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  Operaciones: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Finanzas: 'bg-brand-teal/10 text-brand-teal',
}

const AREA_KEYWORDS: Record<Area, string[]> = {
  Ventas: [
    'venta', 'ventas', 'cliente', 'clientes', 'lead', 'leads', 'cotizacion', 'cotización',
    'cierre', 'pipeline', 'crm', 'prospecto', 'prospectos', 'vendedor', 'negociacion', 'negociación',
  ],
  Marketing: [
    'marketing', 'campaña', 'campana', 'anuncio', 'anuncios', 'contenido', 'redes sociales',
    'publicidad', 'seo', 'email marketing', 'branding', 'marca', 'engagement', 'audiencia',
  ],
  Operaciones: [
    'proceso', 'procesos', 'inventario', 'logistica', 'logística', 'entrega', 'operacion',
    'operación', 'operaciones', 'servidor', 'seguridad', 'proveedor', 'produccion', 'producción',
    'almacen', 'almacén', 'cadena de suministro',
  ],
  Finanzas: [
    'factura', 'facturas', 'pago', 'pagos', 'cobro', 'cobros', 'presupuesto', 'contable',
    'contabilidad', 'impuesto', 'impuestos', 'flujo de caja', 'finanzas', 'financiero', 'nomina',
    'nómina', 'gasto', 'gastos', 'auditoria', 'auditoría',
  ],
}

export function detectArea(text: string): Area | undefined {
  const lower = text.toLowerCase()
  let bestArea: Area | undefined
  let bestScore = 0

  for (const area of AREAS) {
    const score = AREA_KEYWORDS[area].reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0)
    if (score > bestScore) {
      bestScore = score
      bestArea = area
    }
  }

  return bestArea
}
