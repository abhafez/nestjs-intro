import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) returns a translated Arabic error for an invalid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept-Language', 'ar')
      .send({ firstName: 'John', lastName: 'Dow', email: 'hamada' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContainEqual(
          expect.objectContaining({ property: 'email', constraints: { isEmail: 'يجب إدخال بريد إلكتروني صالح' } }),
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
