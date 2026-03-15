export interface Memory {
  id: string;
  photo: string | null;
  text: string;
  link: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  createdAt: string;
}

export type MemoryInput = Omit<Memory, 'id'>;
