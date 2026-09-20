import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDatabaseError } from '../app/database/database-error.handler';

/** Business logic for tags. */
@Injectable()
export class TagsService {
  /**
   * Creates the service.
   * @param tagsRepository
   */
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}
  //#region create
  /**
   * Creates a tag.
   * @param createTagDto tag data
   * @throws ConflictException when a tag with the same unique value already exists
   * @throws RequestTimeoutException when the database is unreachable
   */
  async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagsRepository.create(createTagDto);

      return await this.tagsRepository.save(tag);
    } catch (error) {
      handleDatabaseError(error, 'creating the tag');
    }
  }
  //#endregion

  //#region findAll
  /**
   * Lists all tags.
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findAll() {
    try {
      return await this.tagsRepository.find();
    } catch (error) {
      handleDatabaseError(error, 'listing tags');
    }
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single tag by id.
   * @param id tag id
   * @throws NotFoundException when no tag has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findOne(id: number) {
    let tag: Tag | null;

    try {
      tag = await this.tagsRepository.findOneBy({ id });
    } catch (error) {
      handleDatabaseError(error, 'looking up the tag');
    }

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} was not found.`);
    }

    return tag;
  }
  //#endregion

  //#region findMultipleTags
  /**
   * Finds multiple tags by their ids.
   * @param ids tag ids
   * @throws BadRequestException when one or more ids do not exist
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findMultipleTags(ids: number[]) {
    let tags: Tag[];

    try {
      tags = await this.tagsRepository.findBy({ id: In(ids) });
    } catch (error) {
      handleDatabaseError(error, 'looking up the tags');
    }

    if (tags.length !== ids.length) {
      const missingIds = ids.filter((id) => !tags.some((tag) => tag.id === id));

      throw new BadRequestException(`The following tag ids were not found: ${missingIds.join(', ')}.`);
    }

    return tags;
  }
  //#endregion

  //#region update
  /**
   * Updates a tag.
   * @param id tag id
   * @param updateTagDto fields to update
   * @throws NotFoundException when no tag has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);

    Object.assign(tag, updateTagDto);

    try {
      return await this.tagsRepository.save(tag);
    } catch (error) {
      handleDatabaseError(error, 'updating the tag');
    }
  }
  //#endregion

  //#region remove
  /**
   * Removes a tag.
   * @param id tag id
   * @throws NotFoundException when no tag has that id
   * @throws ConflictException when the tag is still referenced by a post
   * @throws RequestTimeoutException when the database is unreachable
   */
  async remove(id: number) {
    try {
      const result = await this.tagsRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Tag with id ${id} was not found.`);
      }
    } catch (error) {
      handleDatabaseError(error, 'deleting the tag');
    }

    return {
      deleted: true,
      id,
    };
  }
  //#endregion

  //#region softRemove
  /**
   * Soft removes a tag.
   * @param id tag id
   * @throws NotFoundException when no tag has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async softRemove(id: number) {
    try {
      const result = await this.tagsRepository.softDelete(id);

      if (!result.affected) {
        throw new NotFoundException(`Tag with id ${id} was not found.`);
      }
    } catch (error) {
      handleDatabaseError(error, 'deleting the tag');
    }

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
