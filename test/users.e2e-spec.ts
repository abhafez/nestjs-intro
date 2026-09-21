import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import { signTestToken } from './auth-helper';

describe('UsersController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    token = await signTestToken(app);
  });

  it('/users (POST) returns a translated Arabic error for an invalid email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept-Language', 'ar')
      .send({ firstName: 'John', lastName: 'Dow', email: 'hamada' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContainEqual({ field: 'email', messages: ['يجب إدخال بريد إلكتروني صالح'] });
      });
  });

  it('/users (POST) rejects a request with no token', () => {
    return request(app.getHttpServer()).post('/users').send({}).expect(401);
  });

  afterEach(async () => {
    await app.close();
  });
});
