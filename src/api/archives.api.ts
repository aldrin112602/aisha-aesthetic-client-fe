import { apiRequest } from './client';
export type ArchiveEntity = 'users' | 'services' | 'shop-areas' | 'appointments' | 'followups';
export interface ArchiveRecord {
  id: number; entity: ArchiveEntity; name: string; detail: string | null;
  deletedAt: string; deletedByName: string | null; isDeleted: boolean;
}
export const getArchives = () => apiRequest<ArchiveRecord[]>('/api/archives');
export const restoreArchive = (record: ArchiveRecord) => apiRequest(`/api/archives/${record.entity}/${record.id}/restore`, { method: 'POST' });
