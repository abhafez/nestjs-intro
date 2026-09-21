<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="110" alt="Nest Logo" /></a>
</p>

<h1 align="center">my-nest-app</h1>

<p align="center">
  A blog API built while working through the
  <a href="https://www.udemy.com/course/nestjs-masterclass-complete-course/">NestJS Masterclass — Complete Course</a> on Udemy.
</p>

<p align="center">
  <strong>Course rating: ★★★★★ 5/5</strong>
</p>

---

## What this is

Course work, not a product. It is a blog API — posts, tags, meta options, users, auth — built
incrementally as the course introduced each concept, then refactored past what the lectures
strictly required (documentation coverage, error mapping, i18n, e2e tests against real tokens).

The point of this README is to be my own notes: every section below is a thing I learned, with
the code from this repo that uses it.

**Stack:** NestJS 11 · TypeScript · PostgreSQL + TypeORM · Passport-free JWT (`@nestjs/jwt`) ·
class-validator · nestjs-i18n · Swagger · Compodoc · Jest · oxlint/oxfmt

---

## Quick start

```bash
npm install
cp .env.example .env.development          # fill in DB + JWT values
NODE_ENV=development npm run start:dev
```

| URL                         | What                                                   |
| --------------------------- | ------------------------------------------------------ |
| `http://localhost:3000`     | the API                                                |
| `http://localhost:3000/api` | Swagger UI — hit **Authorize**, paste an `accessToken` |
| `http://localhost:3001`     | Compodoc (`npm run doc`)                               |

```bash
npm test          # unit
npm run test:e2e  # e2e — needs a reachable database
npm run lint      # oxlint
npm run format    # oxfmt
npm run doc       # compodoc, live on :3001
```

---

## What I learned

### 1. Modules decide what is visible — nothing else does

The single idea I got wrong most often. A provider listed in `providers` is **private to that
module**. Another module importing it still cannot inject it unless it is also in `exports`.

```ts
// src/auth/auth.module.ts
@Module({
  providers: [AuthService, SignInProvider, RefreshTokensProvider, GenerateTokensProvider /* … */],
  exports: [AuthService, HashingProvider, AccessTokenGuard, AuthenticationGuard, JwtModule, ConfigModule],
})
export class AuthModule {}
```

Two bugs, one cause, seen from both sides:

- `UnknownDependenciesException` on `CreateUserProvider` because `AuthModule` never exported
  `HashingProvider`.
- `AccessTokenGuard` failing to resolve `JwtService` inside `UsersController`, because
  `JwtModule` was imported in `AppModule` and **imports do not flow downward** — `UsersModule` is
  a sibling, not a child. `@UseGuards(SomeGuard)` passes a _class_, so Nest instantiates it in the
  module that declares the controller, and that injector had never seen `JwtService`.

The confusing part was that `ConfigModule.forFeature(jwtConfig)` _did_ resolve in the same file —
because `forRoot({ isGlobal: true })` marks ConfigModule global. `JwtModule` has the same `global`
option and it simply was not set.

### 2. Circular dependencies: the real one vs. the accidental one

`forwardRef` is for cycles you cannot design away:

```ts
// src/auth/auth.module.ts
imports: [forwardRef(() => UsersModule) /* … */];
```

Auth genuinely needs Users (sign-in looks a user up) and Users genuinely needs Auth
(`CreateUserProvider` hashes passwords). That cycle stays.

But most cycles I hit were accidental, and `forwardRef` only hid them. `UsersService` held an
unused `AuthService` dependency, closing the loop
`users.service → auth.service → sign-in.provider → users.service`. Symptom:
`Cannot read properties of undefined (reading 'findOneBy')` — but only on a real HTTP request,
never in an isolated `app.resolve()`. Cause: the chain is request-scoped (`PaginationProvider`
injects `REQUEST`), so the half-built property landed `undefined` per request while boot stayed
clean.

**Lesson:** delete the dead dependency first, reach for `forwardRef` second.

### 3. An abstract class makes a great DI token

The nicest pattern in the course. `HashingProvider` is abstract — it is both the contract and the
injection token:

```ts
// src/auth/providers/hashing.provider.ts
@Injectable()
export abstract class HashingProvider {
  abstract hashPassword(password: string | Buffer): Promise<string>;
  abstract comparePassword(password: string | Buffer, encrypted: string): Promise<boolean>;
}
```

```ts
// src/auth/auth.module.ts
providers: [{ provide: HashingProvider, useClass: BcryptProvider }];
```

Consumers type against `HashingProvider` and never learn that bcrypt exists. Swapping to argon2
is one line in one module.

### 4. One provider, one job

`PostsService` started as a bag of everything. Creation was the one operation juggling three
sources — author, tags, cascade-inserted meta option — so it moved out:

```ts
// src/posts/providers/posts.service.ts
async create(createPostDto: CreatePostDto, user: ActiveUserData) {
  return this.createPostProvider.create(createPostDto, user);
}
```

Same shape for `CreateUserProvider`, `CreateMultipleUsersProvider`, `FindOneUserByProvider`,
`SignInProvider`, `GenerateTokensProvider`, `RefreshTokensProvider`. The service becomes a thin
façade; each provider is independently testable.

### 5. DTOs, validation, and composing them

Validation is global and strips anything not declared:

```ts
// src/app/app.module.ts
{
  provide: APP_PIPE,
  useValue: new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    whitelist: true,                       // drops unknown properties
    exceptionFactory: i18nValidationErrorFactory,
  }),
}
```

`whitelist: true` is quiet security: a client cannot smuggle `isAdmin: true` into a body.

Composition instead of duplication — `PatchPostDto` is `PartialType(CreatePostDto)`, and every
list endpoint intersects its own filters with the shared pagination query:

```ts
// src/posts/dto/get-posts.dto.ts
export class GetPostsDto extends IntersectionType(GetPostsBaseDto, PaginationQueryDto) {}
```

Nested objects need an explicit opt-in — `@ValidateNested()` alone silently passes:

```ts
// src/posts/dto/create-post.dto.ts
@ValidateNested()
@Type(() => CreatePostMetaOptionsDto)
metaOptions?: CreatePostMetaOptionsDto;
```

### 6. TypeORM: relations, counting, transactions

`findAndCount` in one round-trip, and the total respects `where` — a separate `count()` would
report every row in the table:

```ts
// src/common/pagination/providers/pagination.provider.ts
const [results, totalItems] = await repository.findAndCount({
  ...options,
  skip: calculateSkip(paginationQuery),
  take: limit,
});
```

Bulk insert needs a manual `QueryRunner`, and the `finally` release is not optional:

```ts
// src/users/providers/create-multiple-users.provider.ts
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  for (const user of dto.users) {
    await queryRunner.manager.save(queryRunner.manager.create(User, user));
  }
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
  throw new ConflictException('Could not complete the transaction');
} finally {
  await queryRunner.release();
}
```

A relation bug worth remembering: `Post.metaOptions` is `@OneToOne`, but a payload sent an
_array_. class-transformer happily built a `metaValue`-less instance and cascaded it, producing
`INSERT (38, null, …)` and a 409 from a NOT NULL violation. The fix was validation, not schema —
`@IsObject()` so an array now fails with a 400.

### 7. Config: namespaced, validated, async

```ts
// src/app/config/database.config.ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT as string) || 5432,
  synchronize: process.env.DATABASE_SYNC === 'true',
  // …
}));
```

Boot fails loudly on a missing variable instead of blowing up at first query:

```ts
// src/app/config/enviroment.validation.ts
export default Joi.object({
  DATABASE_PASSWORD: Joi.string().required(),
  JWT_TOKEN: Joi.string().required(),
  JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
  // …
});
```

And `forRootAsync` so TypeORM reads that config rather than `process.env` directly:

```ts
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    synchronize: configService.get('database.synchronize'),
    // …
  }),
});
```

`@nestjs/jwt` gets the same treatment via `jwtConfig.asProvider()`, so the secret lives in exactly
one place.

### 8. Auth: hashing → tokens → guards → decorators

**Hash on write:**

```ts
const salt = await bcrypt.genSalt();
return bcrypt.hash(password, salt);
```

**Two tokens, different payloads.** The access token carries `sub` + `email`; the refresh token
carries `sub` alone, so a leaked refresh token discloses nothing about the account:

```ts
// src/auth/providers/generate-tokens.provider.ts
const [accessToken, refreshToken] = await Promise.all([
  this.signToken<Partial<ActiveUserData>>(user.id, this.jwtConfiguration.accessTokenTTL, { email: user.email }),
  this.signToken(user.id, this.jwtConfiguration.refreshTokenTTL),
]);
```

**A guard verifies and hands the payload downstream** by parking it on the request:

```ts
// src/auth/guards/access-token/access-token.guard.ts
request[REQUEST_USER_KEY] = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
```

**Metadata + `Reflector` is the whole "decorator" mechanism.** `@Auth()` is a one-line
`SetMetadata` wrapper:

```ts
// src/auth/decorators/auth.decorator.ts
export const Auth = (...authTypes: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authTypes);
```

**The global guard fails closed** — a new controller with no decorator is protected automatically,
and handler metadata overrides controller metadata:

```ts
// src/auth/guards/authentication/authentication.guard.ts
const authTypes = this.reflector.getAllAndOverride<AuthType[]>(AUTH_TYPE_KEY, [
  context.getHandler(),
  context.getClass(),
]) ?? [AuthenticationGuard.defaultAuthType]; // Bearer
```

```ts
// src/app/app.module.ts
{ provide: APP_GUARD, useClass: AuthenticationGuard }
```

**A param decorator reads it back out**, so controllers never touch `request`:

```ts
// src/auth/decorators/active-user.decorator.ts
export const ActiveUser = createParamDecorator((field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest()[REQUEST_USER_KEY];
  return field ? user?.[field] : user;
});
```

Which is what finally let `POST /posts` stop trusting the client:

```ts
// before — anyone could post as anyone
create(@Body() dto: CreatePostDto) { /* dto.authorId */ }

// after — the author comes from the verified token
create(@Body() dto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
  return this.postsService.create(dto, user);
}
```

I tried replacing `@Auth(AuthType.None)` with the built-in `@SetMetadata` to see whether the
wrapper earns its keep. They are the same mechanism, but measured on `GET /posts`:
`@SetMetadata('authType', 'none')` → **500**, `@SetMetadata('authType', [1])` → 200. The string
500s because the guard iterates `authTypes`, a string iterates _characters_, and
`authTypeGuardMap['n']` is `undefined`. The literal working form is `[1]` — correct and
unreadable. The typed wrapper is worth it.

### 9. Request-scoped providers

Injecting `REQUEST` makes a provider — **and everything that depends on it** — request-scoped.
That is what lets pagination build `links` from the incoming URL:

```ts
// src/common/pagination/providers/pagination.provider.ts
constructor(@Inject(REQUEST) private readonly request: Request) {}
```

Worth knowing the cost: it is also why the circular-dependency bug in §2 only appeared on real
requests.

### 10. Database errors are not 500s

A thrown `QueryFailedError` carries a SQLSTATE. Mapping it beats leaking a stack trace:

```ts
// src/app/database/database-error.handler.ts
export function handleDatabaseError(error: unknown, description: string): never {
  if (error instanceof HttpException) throw error; // never re-wrap a deliberate exception

  if (driverError?.code && CONNECTION_ERROR_CODES.has(driverError.code)) {
    throw new RequestTimeoutException(`Could not reach the database while ${description} …`);
  }

  switch (driverError?.code) {
    case '23505':
      /* unique_violation     */ throw new ConflictException(/* … */);
    case '23503':
      /* foreign_key_violation*/ throw new ConflictException(/* … */);
    case '23502':
      /* not_null_violation   */ throw new ConflictException(/* … */);
  }

  throw new ServiceUnavailableException(/* … */);
}
```

The `instanceof HttpException` guard at the top is the part I would have missed: without it,
wrapping a block in `try`/`catch` swallows your own `NotFoundException` and turns it into a 503.

### 11. i18n on validation errors

```ts
I18nModule.forRoot({
  fallbackLanguage: 'en',
  loader: I18nJsonLoader,
  loaderOptions: { path: join(__dirname, 'i18n'), watch: true },
  resolvers: [AcceptLanguageResolver],
});
```

Paired with `exceptionFactory: i18nValidationErrorFactory` and an
`I18nValidationExceptionFilter`, `Accept-Language: ar` returns Arabic validation messages.
Gotcha: the JSON files are assets — verify `nest build` actually copies them into
`dist/app/i18n/`.

### 12. Swagger: the parts beyond `@ApiProperty`

OpenAPI has no generics, so a `Paginated<T>` envelope has to be spelled out per model. Once, in a
composite decorator, rather than inline on every list route:

```ts
// src/common/pagination/decorators/api-paginated-response.decorator.ts
export function ApiPaginatedResponse<TModel extends Type<unknown>>(model: TModel, description: string) {
  return applyDecorators(
    ApiExtraModels(model, PaginatedMetaDto, PaginatedLinksDto),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(model) } },
              meta: { $ref: getSchemaPath(PaginatedMetaDto) },
              links: { $ref: getSchemaPath(PaginatedLinksDto) },
            },
          },
        ],
      },
    }),
  );
}
```

`applyDecorators` is also how the auth documentation stays in one piece — the security
requirement and the 401 the guard throws can never drift apart:

```ts
// src/auth/decorators/api-auth.decorator.ts
export function ApiAuth() {
  return applyDecorators(
    ApiBearerAuth(ACCESS_TOKEN_SECURITY_SCHEME),
    ApiUnauthorizedResponse({ description: '…', type: ApiErrorResponseDto }),
  );
}
```

A guard is invisible to OpenAPI. Without registering a scheme in `DocumentBuilder`, Swagger UI has
no **Authorize** button at all and every protected route looks anonymous:

```ts
// src/main.ts
.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, ACCESS_TOKEN_SECURITY_SCHEME)
```

Best habit I picked up: audit the generated document, not the decorators. Walking
`SwaggerModule.createDocument(app, config)` found 28 properties with no description and 22 with no
example that reading the source had missed.

### 13. Compodoc

`npm run doc` renders the JSDoc as a browsable site with a module dependency graph.
`--coverageTest 100` turns documentation into a gate. Three things that cost me a while:

- One `/** */` above a group of consts documents **only the first one**.
- JSDoc placed _between_ decorators is ignored — it has to sit above the whole decorator stack.
- Public constructor properties count as documented symbols and need their own comments.

### 14. Testing

Unit specs mock at the module boundary:

```ts
const module = await Test.createTestingModule({
  providers: [
    PostsService,
    { provide: CreatePostProvider, useValue: { create: jest.fn() } },
    { provide: getRepositoryToken(Post), useValue: {} },
  ],
}).compile();
```

E2E goes through the real guard instead of stubbing it — `test/auth-helper.ts` signs a token with
the app's own `JwtService`, so each spec asserts both its 200 and its 401. Stubbing the guard
would have hidden every wiring bug this suite actually caught.

### 15. TypeScript things this codebase taught me

`isolatedModules` + `emitDecoratorMetadata` **(TS1272)** — a type-only symbol in a decorated
signature must be a type-only import. `emitDecoratorMetadata` emits `design:paramtypes`
referencing the identifier as a _value_; `isolatedModules` compiles file-by-file and cannot tell
whether it survives erasure:

```ts
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';
//     ^^^^ required — interfaces and type aliases in decorated params
```

Classes you actually inject (`CreatePostDto`) stay plain imports, because the metadata needs the
constructor at runtime.

Also: `Request` resolves to the global Fetch `Request`, not Express's, unless you
`import type { Request } from 'express'`.

---

## Course rating

**★★★★★ — 5/5**

What earns it: the course teaches NestJS as a set of **mechanisms**, not recipes. By the end I
could explain _why_ `@UseGuards(SomeGuard)` fails to resolve a dependency (the guard is
instantiated in the module declaring the controller), not just that adding an export fixes it.
That is the difference between finishing a course and being able to debug the framework.

Specific strengths:

- **Providers before shortcuts.** Custom provider tokens, abstract-class contracts and
  `APP_GUARD`/`APP_PIPE` are introduced as the normal way to build, so DI stops being magic.
- **Auth built from parts.** Hashing, signing, guards, metadata, `Reflector`, param decorators —
  assembled one at a time instead of importing a Passport strategy and moving on. The
  fail-closed global guard is a genuinely good default I will reuse.
- **It keeps refactoring its own code.** Services get split into providers as they grow, which is
  the lesson most tutorials skip.

Honest caveats, none of which cost it a star: `synchronize: true` is used throughout with no
migrations chapter, and a few areas (error mapping, i18n, documentation coverage, e2e against
real tokens) I had to push past the lectures on my own — which is arguably the course working as
intended.
