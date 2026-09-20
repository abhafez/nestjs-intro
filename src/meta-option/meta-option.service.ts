import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './entities/meta-option.entity';
import { Repository } from 'typeorm';

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
   */
  async create(createMetaOptionDto: CreateMetaOptionDto) {
    let metaOption = this.metaOptionsRepository.create(createMetaOptionDto);

    metaOption = await this.metaOptionsRepository.save(metaOption);

    return metaOption;
  }
  //#endregion

  //#region findAll
  /** Lists all meta options. */
  async findAll() {
    return await this.metaOptionsRepository.find();
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single meta option by id.
   * @param id meta option id
   */
  async findOne(id: number) {
    return await this.metaOptionsRepository.findOneBy({ id });
  }
  //#endregion

  //#region update
  /**
   * Updates a meta option.
   * @param id meta option id
   * @param updateMetaOptionDto fields to update
   */
  async update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    const metaOption = await this.metaOptionsRepository.findOneBy({ id });

    Object.assign(metaOption, updateMetaOptionDto);

    return await this.metaOptionsRepository.save(metaOption);
  }
  //#endregion

  //#region remove
  /**
   * Removes a meta option.
   * @param id meta option id
   */
  async remove(id: number) {
    await this.metaOptionsRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }
  //#endregion
}
