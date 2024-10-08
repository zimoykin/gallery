import { Index } from '../../dynamo-db/decorators/index.decorator';
import { PrimaryKey } from '../../dynamo-db/decorators/primary-key.decorator';
import { SortKey } from '../../dynamo-db/decorators/sort-key.decorator';
import { Table } from '../../dynamo-db/decorators/table.decorator';
import { Required } from '../../dynamo-db/decorators/required.decorator';
import * as luxon from 'luxon';

@Table('offers')
export class Offer {
  @PrimaryKey()
  id: string;

  @SortKey('S')
  profileId: string;

  title: string;
  text?: string; //Markdown
  price?: number;
  image?: string;
  preview: string;
  location?: string;
  category?: 'trip' | 'hotel' | 'restaurant' | 'camera' | 'lens' | 'other';
  url?: string;

  @Index('N')
  privateAccess = 0; // 0: public, 1: private

  @Index('N')
  @Required()
  availableUntil: number;

  constructor() {
    const now = luxon.DateTime.now();
    now.plus({ month: 1 });
    this.availableUntil = now.toJSDate().getTime();
  }
}
