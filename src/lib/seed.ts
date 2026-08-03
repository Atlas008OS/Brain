import type { ActivityEntry, DepartmentNode, ProcessRecord } from '../types'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

export const seedProcesses: ProcessRecord[] = [
  {
    id: 'proc-onboarding',
    title: 'Flujo de incorporación de clientes',
    summary:
      'Automatiza la recolección de documentación y los pasos de verificación legal mediante clasificadores LLM, reduciendo el tiempo de activación en un 40%.',
    status: 'Published',
    category: 'Operaciones de Ventas',
    tags: ['Onboarding', 'Automatización'],
    owner: 'Operaciones de Ventas',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(3),
    steps: [
      { id: 's1', title: 'Recolectar documentos legales', description: 'Solicita y valida la documentación de incorporación mediante carga en el portal.', done: true },
      { id: 's2', title: 'Ejecutar clasificación LLM', description: 'Clasifica el tipo de documento y marca automáticamente los campos faltantes.', done: true },
      { id: 's3', title: 'Activar cuenta', description: 'Provisiona el workspace y envía la secuencia de bienvenida.', done: true },
    ],
    contributors: [{ id: 'c1', name: 'Jordan S.', role: 'Líder de Operaciones de Ventas' }],
    timeToExecute: '20m',
    complexity: 'Medium',
    efficiencyScore: 88,
    sourceType: 'manual',
  },
  {
    id: 'proc-risk-audit',
    title: 'Auditoría de riesgo trimestral v2',
    summary: 'Marco de evaluación de riesgo interdepartamental. Actualmente faltan submódulos de cumplimiento financiero.',
    status: 'Draft',
    category: 'Operaciones Centrales',
    tags: ['Riesgo', 'Cumplimiento'],
    createdAt: daysAgo(90),
    updatedAt: daysAgo(6),
    steps: [
      { id: 's1', title: 'Reunir registros de riesgo departamentales', description: 'Extrae los últimos informes de incidentes y excepciones de cada departamento.', done: false },
      { id: 's2', title: 'Calificar severidad del riesgo', description: 'Aplica la matriz de severidad estándar a cada elemento abierto.', done: false },
    ],
    contributors: [{ id: 'c2', name: 'Alex Lewis', role: 'Ingeniero Líder' }],
    timeToExecute: '2h',
    complexity: 'High',
    efficiencyScore: 41,
    sourceType: 'manual',
  },
  {
    id: 'proc-cloud-scaling',
    title: 'Escalado de recursos en la nube',
    summary: 'Guía técnica para el escalado de instancias AWS. Marcado para revisión por referencias a tipos de instancia obsoletos.',
    status: 'Needs Review',
    category: 'Operaciones Centrales',
    tags: ['AWS', 'DevOps'],
    createdAt: daysAgo(60),
    updatedAt: daysAgo(1),
    steps: [
      { id: 's1', title: 'Auditar flota de instancias actual', description: 'Lista los tipos de instancia activos y su utilización.', done: false },
      { id: 's2', title: 'Actualizar política de escalado', description: 'Reemplaza las familias de instancias obsoletas en el grupo de autoescalado.', done: false },
    ],
    contributors: [{ id: 'c2', name: 'Alex Lewis', role: 'Ingeniero Líder' }],
    timeToExecute: '1h',
    complexity: 'Medium',
    efficiencyScore: 63,
    sourceType: 'manual',
  },
  {
    id: 'proc-security-patching',
    title: 'Parcheo de seguridad empresarial',
    summary:
      'Protocolo integral para respuesta a vulnerabilidades de día cero en entornos de nube híbrida. Gestionado por el equipo de InfoSec.',
    status: 'Published',
    category: 'Seguridad de Red',
    tags: ['Seguridad', 'DevOps', 'Cumplimiento'],
    owner: 'Equipo de InfoSec',
    createdAt: daysAgo(340),
    updatedAt: daysAgo(45),
    steps: [
      {
        id: 's1',
        title: 'Snapshot inicial del entorno',
        description: 'Ingresa a la consola de AWS y activa un snapshot manual de EBS para todos los volúmenes de producción antes de iniciar cualquier actualización.',
        done: false,
      },
      {
        id: 's2',
        title: 'Parcheo de vulnerabilidades',
        description: "Ejecuta 'yum update -y' en el host Bastion y verifica que todos los parches de seguridad del kernel se apliquen correctamente.",
        done: false,
        priority: 'High',
        assignee: 'Equipo de Seguridad',
      },
      {
        id: 's3',
        title: 'Auditoría de reglas de firewall',
        description: "Revisa los Security Groups y asegura que el puerto 22 solo esté abierto a rangos VPN internos. Elimina cualquier regla 'Any' huérfana.",
        done: false,
      },
    ],
    contributors: [
      { id: 'c2', name: 'Alex Lewis', role: 'Ingeniero Líder' },
      { id: 'c3', name: 'Sam Rivers', role: 'Auditoría de Seguridad' },
    ],
    timeToExecute: '45m',
    complexity: 'High',
    efficiencyScore: 94,
    sourceType: 'voice',
    transcript: [
      { id: 't1', speaker: 'user', text: 'Nota de voz del 24/10/2023 detallando la auditoría mensual de seguridad de infraestructura.', timestamp: daysAgo(45) },
    ],
    aiSuggestions: ['Verificar vencimiento de certificado SSL', 'Actualizar manifiesto de acceso del equipo'],
  },
  {
    id: 'proc-talent',
    title: 'Adquisición de talento 2.0',
    summary: 'Pipeline de reclutamiento de extremo a extremo integrado con las APIs de Greenhouse y Workday para seguimiento en tiempo real.',
    status: 'Published',
    category: 'Talento y RR. HH.',
    tags: ['RR. HH.', 'Reclutamiento'],
    createdAt: daysAgo(310),
    updatedAt: daysAgo(10),
    steps: [
      { id: 's1', title: 'Sincronizar pipeline de candidatos', description: 'Extrae nuevos postulantes de Greenhouse hacia el tracker.', done: true },
      { id: 's2', title: 'Agendar entrevistas', description: 'Propone automáticamente horarios de entrevista mediante la sincronización con el calendario de Workday.', done: true },
    ],
    contributors: [{ id: 'c4', name: 'Priya N.', role: 'Operaciones de Talento' }],
    timeToExecute: '30m',
    complexity: 'Medium',
    efficiencyScore: 81,
    sourceType: 'manual',
  },
]

export const seedDepartments: DepartmentNode[] = [
  {
    id: 'dept-sales',
    name: 'Operaciones de Ventas',
    description: 'Enrutamiento de leads entrantes, higiene de CRM y flujos de incorporación de socios.',
    icon: 'sales',
    completeness: 92,
  },
  {
    id: 'dept-core',
    name: 'Operaciones Centrales',
    description: 'Gestión logística, sincronización de la cadena de suministro y lógica de cumplimiento de pedidos.',
    icon: 'core',
    completeness: 58,
  },
  {
    id: 'dept-talent',
    name: 'Talento y RR. HH.',
    description: 'Secuencias de incorporación, administración de beneficios y evaluaciones anuales.',
    icon: 'talent',
    completeness: 84,
  },
]

export const seedActivity: ActivityEntry[] = [
  { id: 'a1', text: 'Agent Brain completó la documentación de "Incorporación de proveedores".', timestamp: daysAgo(0) },
  { id: 'a2', text: 'Jordan S. revisó el SOP del pipeline de ventas.', timestamp: daysAgo(0) },
  { id: 'a3', text: 'Agent Brain detectó un vacío lógico en el proceso de cumplimiento de pedidos.', timestamp: daysAgo(0) },
  { id: 'a4', text: 'El sistema actualizó automáticamente el manual de CRM v4.2.', timestamp: daysAgo(1) },
]
