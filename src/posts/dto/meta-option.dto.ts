import { IsNotEmpty, IsString } from 'class-validator';

/** A single arbitrary key/value metadata entry attached to a post. */
export class CreatePostMetaOptionsDto {
    /** Metadata key. */
    @IsString()
    @IsNotEmpty()
    key: string;

    /** Metadata value, stored as-is. */
    @IsNotEmpty()
    value: any;
}