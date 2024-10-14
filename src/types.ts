export type ArtifactType = 'link' | 'text' | 'file' | 'image';

export interface Artifact {
  id: string;
  type: ArtifactType;
  content: string;
  index: number;
}

export type ParaItemStatus = 'backlog' | 'ready' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  endDate: string | null;
}

export interface ParaItem {
  id: string;
  title: string;
  description: string;
  category: 'projects' | 'areas' | 'resources' | 'archives';
  artifacts: Artifact[];
  tasks: Task[];
  endDate: string | null;
  status: ParaItemStatus;
}

export interface ParaState {
  projects: ParaItem[];
  areas: ParaItem[];
  resources: ParaItem[];
  archives: ParaItem[];
}