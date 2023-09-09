# Web Company Backend NodeJS (Typescript) + Prisma

## How To

```console
pnpm dev install
```

then :

```console
pnpm firstrun
```

or manually
`pnpm install` => `pnpm prisma db push` => `ts-node dbseeder.ts`

## TO run after command above

```console
pnpm dev
```

## Endpoints

### Testimony

```
/testimony
/testimony/{id}
```

### Hero

```
/hero/right
/hero/left
/hero/{id}
```

### Partner

```
/partner
/partner/{id}
```

### Services

```
/service
/service/{id}
```

### Products

```
/product
/product/{id}
```


### TODO
- [ ] Implement automatic test  
- [ ] Check unexpected #bug after manual test  
- [ ] Refactor auth  
  