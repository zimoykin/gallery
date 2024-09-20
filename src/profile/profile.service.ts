import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from 'src/dynamo-db/decorators/inject-model.decorator';
import { DynamoDbRepository } from 'src/dynamo-db/dynamo-db.repository';
import { Profile } from './profile.model';
import { InjectS3Bucket } from 'src/s3-bucket/inject-s3-bucket.decorator';
import { S3BucketService } from 'src/s3-bucket/s3-bucket.service';
import { ImageCompressorService } from 'src/image-compressor/image-compressor.service';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);
    constructor(
        @InjectRepository('Profile') private readonly profileRepository: DynamoDbRepository<Profile>,
        @InjectS3Bucket('profile') private readonly s3BucketService: S3BucketService,
        private readonly imageCompressorService: ImageCompressorService
    ) { }


    async createProfile(userId: string, userName: string) {
        this.logger.log(`creating profile for user ${userId}`);
        const profile = await this.profileRepository.create({
            userId: userId,
            name: userName ?? 'unknown'
        });

        if (!profile) {
            throw new BadRequestException('could not create profile');
        }
        return profile;
    }

    async findProfileByUserId(userId: string) {
        const profile = await this.profileRepository.findOneByFilter<Profile>({
            match: { userId: userId }
        }) || await this.createProfile(userId, 'unknown');


        if (profile?.bucket?.key) {
            const url = await this.s3BucketService.generateSignedUrl(profile.bucket.key);
            return {
                ...profile,
                url
            };
        }

        return profile;
    }

    async readAllPublicProfiles() {
        const profiles = await this.profileRepository.readByFilter({
            match: { privateAccess: false }
        });
        const result = [];
        for await (const profile of profiles) {
            if (profile.bucket?.key) {
                const url = await this.s3BucketService.generateSignedUrl(profile.bucket.key);
                profile.bucket.url = url;
                result.push({ ...profile, });
            } else {
                result.push(profile);
            }
        }
        return result;
    }

    async updateProfile(id: string, dto: Partial<Profile>) {
        const profile = await this.profileRepository.findById(id);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        else {
            const updatedProfile = Object.assign(profile, dto);
            return this.profileRepository.update(profile.id, updatedProfile);
        }
    }


    async createProfilePhoto(profileId: string, file: any) {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        const resized = await this.imageCompressorService.compressImage(file.buffer, 320, 320);
        const bucket = await this.s3BucketService.upload(
            resized,
            `${profile.id}/${file.originalname}`,
        );
        return this.profileRepository.update(profile.id, { bucket });
    }

    async findProfileById(id: string) {
        if (!id) {
            throw new NotFoundException('Profile id not found');
        }
        const profile = await this.profileRepository.findOneByFilter({ match: { id } });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        if (profile.bucket?.key) {
            const url = await this.s3BucketService.generateSignedUrl(profile.bucket.key);
            return {
                ...profile,
                url
            };
        }

        return profile;
    }
}
