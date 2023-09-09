# Web Company Backend NodeJS (Typescript) + Prisma

> [!WARNING]  
> This project may still have bugs or memory leaks or overhead. (but it's runs normally)
## How To

I recommend to use npm. or you can adapt this step to other package manager (pnpm, yarn)



#### Copy `.env.example` to `.env`
in wsl/linux/powershell you can do command below
```shell
cp .env.exampe .env
```
then adapt it to your need with your favorite code editor/ IDEs
#### Install needed dependency
```shell
npm install
```
#### Run the migrations
```shell
npx prisma db push
```
#### Run the seeders (if needed)
```shell
npx ts-node dbseeder.ts
```
#### Run the project
```shell
npm run dev
```
#### Run the project in js (usually faster because compiled)
```shell
npm run build
npm run start
```
or directly
```shell
npm run start-js
```

## Endpoints
Check [ENDPOINTS.md](/ENDPOINTS.md)
## TODO
- [ ] Implement automatic test  
- [ ] Check unexpected #bug after manual test  
- [ ] Refactor auth  
  