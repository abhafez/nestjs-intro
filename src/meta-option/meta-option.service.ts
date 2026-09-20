import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './entities/meta-option.entity';
import { Repository } from 'typeorm';
import { handleDatabaseError } from '../app/database/database-error.handler';

/** Business logic for meta options. */
@Injectable()
export class MetaOptionService {
  /**
   * Creates the service.
   * @param metaOptionsRepository
   */
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}
  //#region create
  /**
   * Creates a meta option.
   * @param createMetaOptionDto meta option data
   * @throws ConflictException when the row violates a database constraint
   * @throws RequestTimeoutException when the database is unreachable
   */
  async create(createMetaOptionDto: CreateMetaOptionDto) {
    try {
      const metaOption = this.metaOptionsRepository.create(createMetaOptionDto);

      return await this.metaOptionsRepository.save(metaOption);
    } catch (error) {
      handleDatabaseError(error, 'creating the meta option');
    }
  }
  //#endregion

  //#region findAll
  /**
   * Lists all meta options.
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findAll() {
    try {
      return await this.metaOptionsRepository.find();
    } catch (error) {
      handleDatabaseError(error, 'listing meta options');
    }
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single meta option by id.
   * @param id meta option id
   * @throws NotFoundException when no meta option has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async findOne(id: number) {
    let metaOption: MetaOption | null;

    try {
      metaOption = await this.metaOptionsRepository.findOneBy({ id });
    } catch (error) {
      handleDatabaseError(error, 'looking up the meta option');
    }

    if (!metaOption) {
      throw new NotFoundException(`Meta option with id ${id} was not found.`);
    }

    return metaOption;
  }
  //#endregion

  //#region update
  /**
   * Updates a meta option.
   * @param id meta option id
   * @param updateMetaOptionDto fields to update
   * @throws NotFoundException when no meta option has that id
   * @throws RequestTimeoutException when the database is unreachable
   */
  async update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    const metaOption = await this.findOne(id);

    Object.assign(metaOption, updateMetaOptionDto);

    try {
      return await this.metaOptionsRepository.save(metaOption);
    } catch (error) {
      handleDatabaseError(error, 'updating the meta option');
    }
  }
  //#endregion

  //#region remove
  /**
   * Removes a meta option.
   * @param id meta option id
   * @throws NotFoundException when no meta option has that id
   * @throws ConflictException when the meta option is still referenced by a post
   * @throws RequestTimeoutException when the database is unreachable
   */
  async remove(id: number) {
    try {
      const result = await this.metaOptionsRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Meta option with id ${id} was not found.`);
      }
    } catch (error) {
      handleDatabaseError(error, 'deleting the meta option');
    }

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
