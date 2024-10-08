import { Required } from '../../dynamo-db/decorators/required.decorator';
import { Index } from '../../dynamo-db/decorators/index.decorator';
import { PrimaryKey } from '../../dynamo-db/decorators/primary-key.decorator';
import { SortKey } from '../../dynamo-db/decorators/sort-key.decorator';
import { Table } from '../../dynamo-db/decorators/table.decorator';

@Table('folder')
export class Folder {
  @PrimaryKey()
  id: string;

  @SortKey('S')
  profileId: string;

  @Index('N')
  sortOrder: number;

  @Required()
  title: string;

  description: string;

  leftBottomColor: string;
  leftTopColor: string;
  centerTopColor: string;
  centerBottomColor: string;
  rightBottomColor: string;
  rightTopColor: string;

  url?: string;

  @Index('N')
  @Required()
  privateAccess = 0; // 0: public, 1: private

  favoriteFotoId?: string;
}
