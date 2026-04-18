# @stackra/ts-container

NestJS-style IoC container and dependency injection for TypeScript. Built from
scratch — no Inversify, no heavy runtime.

## Installation

```bash
pnpm add @stackra/ts-container
```

## Features

- 💉 `@Injectable()` decorator for marking classes as DI-managed
- 🎯 `@Inject(token)` for explicit token-based injection
- ❓ `@Optional()` for optional dependencies
- 📦 `@Module()` for declaring module metadata (providers, imports, exports)
- 🌐 `@Global()` for global module registration
- 🔧 `DynamicModule` with `forRoot()` / `forFeature()` pattern
- 🏗️ `ModuleContainer` — the core DI engine
- 🔍 `DependenciesScanner` for module tree walking
- 🔄 `InstanceLoader` for provider instantiation and lifecycle hooks
- 🔗 `forwardRef()` for circular dependency resolution
- 🎭 Provider types: class, value, factory, existing (alias)
- 🔄 Lifecycle hooks: `OnModuleInit`, `OnModuleDestroy`,
  `OnApplicationBootstrap`, `OnApplicationShutdown`, `BeforeApplicationShutdown`
- 📐 Scope support: Singleton, Transient
- ⚡ Compile-time scanning with `RegistryScanner` (zero runtime overhead)
- 🎯 Module distance tracking for predictable lifecycle hook order
- 🏭 `ModuleRef.create()` for dynamic instantiation outside DI
- 🚀 Entry providers for eager initialization
- ⚙️ Application config for global settings
- 🌍 Global application singleton for React integration

## Usage

### Defining Providers

```typescript
/**
 * |-------------------------------------------------------------------
 * | Mark classes with @Injectable() for DI management.
 * |-------------------------------------------------------------------
 */
import { Injectable, Inject, Optional } from '@stackra/ts-container';

@Injectable()
class LoggerService {
  info(msg: string) {
    console.log(msg);
  }
}

@Injectable()
class UserService {
  constructor(
    private logger: LoggerService,
    @Inject('API_URL') private apiUrl: string,
    @Optional() private analytics?: AnalyticsService
  ) {}
}
```

### Defining Modules

```typescript
/**
 * |-------------------------------------------------------------------
 * | Use @Module() to group providers and declare dependencies.
 * |-------------------------------------------------------------------
 */
import { Module } from '@stackra/ts-container';

@Module({
  providers: [LoggerService, UserService],
  exports: [UserService],
})
class UserModule {}

@Module({
  imports: [UserModule],
  providers: [AppService],
})
class AppModule {}
```

### Dynamic Modules

```typescript
/**
 * |-------------------------------------------------------------------
 * | forRoot() / forFeature() return DynamicModule for configuration.
 * |-------------------------------------------------------------------
 */
import { Module, type DynamicModule } from '@stackra/ts-container';

@Module({})
class CacheModule {
  static forRoot(config: CacheConfig): DynamicModule {
    return {
      module: CacheModule,
      global: true,
      providers: [
        { provide: CACHE_CONFIG, useValue: config },
        { provide: CacheManager, useClass: CacheManager },
      ],
      exports: [CacheManager],
    };
  }
}
```

### Provider Types

```typescript
/**
 * |-------------------------------------------------------------------
 * | Four provider types: class, value, factory, existing.
 * |-------------------------------------------------------------------
 */
const providers = [
  // Class provider
  { provide: UserService, useClass: UserService },

  // Value provider
  { provide: 'API_URL', useValue: 'https://api.example.com' },

  // Factory provider
  {
    provide: DbConnection,
    useFactory: (config) => createConnection(config),
    inject: [DB_CONFIG],
  },

  // Existing (alias) provider
  { provide: CACHE_MANAGER, useExisting: CacheManager },
];
```

## API Reference

| Export                      | Type      | Description                                  |
| --------------------------- | --------- | -------------------------------------------- |
| `@Injectable()`             | Decorator | Mark a class as injectable                   |
| `@Inject(token)`            | Decorator | Inject by token (string, symbol, or class)   |
| `@Optional()`               | Decorator | Mark a dependency as optional                |
| `@Module(metadata)`         | Decorator | Declare module metadata                      |
| `@Global()`                 | Decorator | Make a module's exports globally available   |
| `DynamicModule`             | Interface | Return type for `forRoot()` / `forFeature()` |
| `Application`               | Class     | Bootstrap and manage the application         |
| `ModuleContainer`           | Class     | Core DI container engine                     |
| `DependenciesScanner`       | Class     | Module tree scanner (runtime reflection)     |
| `RegistryScanner`           | Class     | Module tree scanner (compile-time)           |
| `InstanceLoader`            | Class     | Provider instantiation and lifecycle         |
| `Injector`                  | Class     | Dependency resolution engine                 |
| `ModuleRef`                 | Class     | Module reference with `create()` method      |
| `forwardRef(fn)`            | Utility   | Resolve circular dependencies                |
| `OnModuleInit`              | Interface | Lifecycle hook after instantiation           |
| `OnModuleDestroy`           | Interface | Lifecycle hook before shutdown               |
| `OnApplicationBootstrap`    | Interface | Lifecycle hook after all modules initialized |
| `OnApplicationShutdown`     | Interface | Lifecycle hook during shutdown               |
| `BeforeApplicationShutdown` | Interface | Lifecycle hook before shutdown starts        |
| `Scope`                     | Enum      | `DEFAULT` (singleton), `TRANSIENT`           |

## Advanced Features

See [ADVANCED_FEATURES.md](./docs/ADVANCED_FEATURES.md) for detailed
documentation on:

- **Module Distance Tracking** — Predictable lifecycle hook order
- **ModuleRef.create()** — Dynamic instantiation outside DI
- **Entry Providers** — Eager initialization for side effects
- **Application Config** — Global settings injection
- **Additional Lifecycle Hooks** — Fine-grained control over bootstrap/shutdown
- **Global Application vs Global Module** — Understanding the difference

## License

MIT
