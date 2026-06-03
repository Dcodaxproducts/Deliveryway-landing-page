export type Nullable<T> = T | null;

export type Maybe<T> = T | null | undefined;

export type SelectOption = {
  label: string;
  value: string;
};

export type ImageUploadValue = {
  file?: File;
  previewUrl?: string;
  url?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
