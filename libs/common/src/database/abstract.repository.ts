import { AbstractDocument } from '@app/common/database/abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true, // this gives us the updated document as opposed to the original document
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document was not found');
    }
    return document;
    // return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // async findOneAndDelete(
  //   filterQuery: FilterQuery<TDocument>,
  // ): Promise<TDocument> {
  //   return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  // }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    const deletedDocument = await this.model
      .findOneAndDelete(filterQuery)
      .lean<TDocument>(true);

    if (!deletedDocument) {
      this.logger.warn(
        'Attempted to delete a non-existent document with filterQuery',
        filterQuery,
      );
      throw new NotFoundException('YER MOM was not found');
    }

    return deletedDocument;
  }
}
