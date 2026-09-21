import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedLinksDto } from '../dto/paginated-links.dto';
import { PaginatedMetaDto } from '../dto/paginated-meta.dto';

/**
 * Documents a `200` response carrying the {@link Paginated} envelope around `model`.
 *
 * `Paginated<T>` is a generic interface, and OpenAPI has no generics — so the envelope has to be
 * spelled out per model. This keeps that in one place instead of repeating an inline schema on
 * every list route.
 *
 * @param model entity or DTO appearing in the `data` array
 * @param description text shown next to the 200 response
 */
export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel, description: string) {
  return applyDecorators(
    ApiExtraModels(model, PaginatedMetaDto, PaginatedLinksDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                description: 'Rows on the requested page.',
                items: { $ref: getSchemaPath(model) },
              },
              meta: { $ref: getSchemaPath(PaginatedMetaDto) },
              links: { $ref: getSchemaPath(PaginatedLinksDto) },
            },
            required: ['data', 'meta', 'links'],
          },
        ],
      },
    }),
  );
}
