export type DocBaseModel = {
  _id: string;
  type: string;
  parentId?: string;
  modified: number;
  created: number;
  isPrivate: boolean;
  name: string;
}
