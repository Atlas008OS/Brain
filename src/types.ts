export type ProcessStatus = 'Published' | 'Draft' | 'Needs Review'
export type Complexity = 'Low' | 'Medium' | 'High'

export interface ProcessStep {
  id: string
  title: string
  description: string
  done: boolean
  priority?: 'Low' | 'Medium' | 'High'
  assignee?: string
}

export interface Contributor {
  id: string
  name: string
  role: string
}

export interface ProcessRecord {
  id: string
  title: string
  summary: string
  status: ProcessStatus
  category: string
  tags: string[]
  owner?: string
  createdAt: string
  updatedAt: string
  steps: ProcessStep[]
  contributors: Contributor[]
  timeToExecute?: string
  complexity?: Complexity
  efficiencyScore?: number
  sourceType: 'voice' | 'manual'
  transcript?: TranscriptLine[]
  aiSuggestions?: string[]
}

export interface TranscriptLine {
  id: string
  speaker: 'user' | 'agent'
  text: string
  timestamp: string
}

export interface ActivityEntry {
  id: string
  text: string
  timestamp: string
}

export interface DepartmentNode {
  id: string
  name: string
  description: string
  icon: 'sales' | 'core' | 'talent'
  completeness: number
}
