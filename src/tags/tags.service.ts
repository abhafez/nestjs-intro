import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
   */
  async create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);

    return await this.tagsRepository.save(tag);
  }
  //#endregion

  //#region findAll
  /** Lists all tags. */
  async findAll() {
    return await this.tagsRepository.find();
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single tag by id.
   * @param id tag id
   */
  async findOne(id: number) {
    return await this.tagsRepository.findOneBy({ id });
  }
  //#endregion

  //#region findMultipleTags
  /**
   * Finds multiple tags by their ids.
   * @param ids tag ids
   */
  async findMultipleTags(ids: number[]) {
    return await this.tagsRepository.findBy({ id: In(ids) });
  }
  //#endregion

  //#region update
  /**
   * Updates a tag.
   * @param id tag id
   * @param updateTagDto fields to update
   */
  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagsRepository.findOneBy({ id });

    if (tag) {
      Object.assign(tag, updateTagDto);

      return await this.tagsRepository.save(tag);
    }
  }
  //#endregion

  //#region remove
  /**
   * Removes a tag.
   * @param id tag id
   */
  async remove(id: number) {
    await this.tagsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
