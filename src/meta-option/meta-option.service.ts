import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';

/** Business logic for meta options. */
@Injectable()
export class MetaOptionService {
  //#region create
  /**
   * Creates a meta option.
   * @param createMetaOptionDto meta option data
   */
  create(createMetaOptionDto: CreateMetaOptionDto) {
    return 'This action adds a new metaOption';
  }
  //#endregion

  //#region findAll
  /** Lists all meta options. */
  findAll() {
    return `This action returns all metaOption`;
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single meta option by id.
   * @param id meta option id
   */
  findOne(id: number) {
    return `This action returns a #${id} metaOption`;
  }
  //#endregion

  //#region update
  /**
   * Updates a meta option.
   * @param id meta option id
   * @param updateMetaOptionDto fields to update
   */
  update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    return `This action updates a #${id} metaOption`;
  }
  //#endregion

  //#region remove
  /**
   * Removes a meta option.
   * @param id meta option id
   */
  remove(id: number) {
    return `This action removes a #${id} metaOption`;
  }
  //#endregion
}
