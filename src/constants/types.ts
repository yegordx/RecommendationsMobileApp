export type PostResponse = {
  id: number;
  body: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  clusterTags: { id: number; name: string }[];
  userTags: { id: number; name: string }[];
};

export type KeyTag = { id: number; name: string };
export type ClusterTag = { id: number; name: string; keyTagId: number };

export type AuthUser = {
  token: string;
  userId: number;
  name: string;
  email: string;
};

export type InteractionType = 1 | 2 | 3 | 4 | 5;
