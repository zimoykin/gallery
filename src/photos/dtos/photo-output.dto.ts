import { Exclude, Expose, Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';

@Exclude()
export class PhotoOutputDto {
  @Expose()
  @Transform((value) => value.obj._id)
  _id: string;

  @Expose()
  sortOrder: number;
  @Expose()
  profileId: string;
  @Expose()
  folderId: string;
  @Expose()
  camera: string;
  @Expose()
  lens?: string;
  @Expose()
  iso?: string;
  @Expose()
  film?: string;
  @Expose()
  location?: string;
  @Expose()
  description?: string;
  @Expose()
  previewUrl: string;

  @Expose()
  compressedUrl: string;

  @Expose()
  originalUrl: string;

  @Expose()
  likes: number;

  @Expose()
  privateAccess: number; // 0 = public, 1 = private

  @Expose()
  isFavorite: boolean;
}
