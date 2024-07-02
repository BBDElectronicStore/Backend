--changeset adrian:ddl:createTable:stocks
CREATE TABLE stocks (
                        stock_id SERIAL PRIMARY KEY,
                        stock_data JSONB
);
--rollback DROP TABLE "stocks";

--changeset adrian:dml:insert:stocks
INSERT INTO "stocks" ("stock_data") VALUES ('{}')
--rollback DELETE FROM "stocks" WHERE "stock_data" = '{}';