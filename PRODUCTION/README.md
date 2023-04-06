# graphql-wms-api

GraphQL WMS API

DB_USERNAME = sa
DB_PASSWORD = 123456@a123456
DB_NAME = Test03
DB_HOST = 192.168.2.6
DB_DIALECT = mssql
DB_PORT = 1300
JWT_SECRET = toicotientoicotinhyeu

npx sequelize-cli model:generate --name Item --attributes name:string
npx sequelize-cli model:generate --name Unit --attributes name:string
npx sequelize-cli model:generate --name Department --attributes name:string
npx sequelize-cli model:generate --name Routing --attributes name:string

node_modules/.bin/sequelize db:migrate:undo:all
node_modules/.bin/sequelize db:migrate
npx sequelize-cli db:seed:all

node_modules/.bin/sequelize db:seed:undo:all
npx sequelize-cli db:seed:all

npx sequelize-cli seed:generate --name admin-seeder
npx sequelize-cli seed:generate --name item-seeder
npx sequelize-cli seed:generate --name unit-seeder
npx sequelize-cli seed:generate --name type-seeder
npx sequelize-cli seed:generate --name department-seeder
