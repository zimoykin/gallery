import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "src/dynamo-db/decorators/inject-model.decorator";
import { AmqpConsumer } from "src/lib/amqp.consumer";
import { FolderDominantColor } from "src/lib/common/dtos/folder-favorite";
import { InjectConsumer } from "src/lib/decorators";
import { Folder } from "./models/folder.model";
import { DynamoDbRepository } from "src/dynamo-db/dynamo-db.repository";

@Injectable()
export class FolderConsumer {
    private readonly logger = new Logger(FolderConsumer.name);
    constructor(
        //@ts-ignore
        @InjectConsumer('folder_dominant_color') private readonly consumer: AmqpConsumer,
        //@ts-ignore
        @InjectRepository(Folder.name) private readonly folderRepository: DynamoDbRepository<Folder>
    ) { }

    onModuleInit() {
        this.consumer.subscribe<FolderDominantColor>(async (message) => {
            this.logger.debug(`Received message: ${JSON.stringify(message)}`);
            const { state, contentId, leftBottomColor, leftTopColor, centerBottomColor, centerTopColor, rightBottomColor, rightTopColor } = message;

            await this.folderRepository.update(contentId, {
                leftBottomColor,
                leftTopColor,
                rightBottomColor,
                rightTopColor,
                centerBottomColor,
                centerTopColor
            });

        });
    }
}