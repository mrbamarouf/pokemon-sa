import type { EntityId, ServiceResult } from "../store-schema";

export type StorageBucket = "custom-cups" | "custom-apparel" | "special-requests" | "profile-images";

export type UploadDesignAssetInput = {
  bucket: StorageBucket;
  userId?: EntityId;
  file: Blob;
  fileName: string;
  contentType?: string;
};

export type StoredAsset = {
  bucket: StorageBucket;
  path: string;
  publicUrl?: string;
  fileName: string;
  contentType?: string;
};

const backendNotConfigured = <T>(message = "Storage backend is not connected yet."): ServiceResult<T> => ({
  data: null,
  error: { code: "backend_not_configured", message },
});

export const uploadDesignAsset = async (input: UploadDesignAssetInput): Promise<ServiceResult<StoredAsset>> => {
  void input;
  return backendNotConfigured<StoredAsset>();
};

export const deleteAsset = async (bucket: StorageBucket, path: string): Promise<ServiceResult<null>> => {
  void bucket;
  void path;
  return backendNotConfigured<null>();
};

export const getPublicUrl = async (bucket: StorageBucket, path: string): Promise<ServiceResult<string>> => {
  void bucket;
  void path;
  return { data: null, error: null };
};
