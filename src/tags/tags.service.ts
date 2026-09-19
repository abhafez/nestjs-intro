import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

/** Business logic for tags. */
@Injectable()
export class TagsService {
  //#region create
  /**
   * Creates a tag.
   * @param createTagDto tag data
   */
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }
  //#endregion

  //#region findAll
  /** Lists all tags. */
  findAll() {
    return `This action returns all tags`;
  }
  //#endregion

  //#region findOne
  /**
   * Finds a single tag by id.
   * @param id tag id
   */
  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }
  //#endregion

  //#region update
  /**
   * Updates a tag.
   * @param id tag id
   * @param updateTagDto fields to update
   */
  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }
  //#endregion

  //#region remove
  /**
   * Removes a tag.
   * @param id tag id
   */
  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
  //#endregion
}
