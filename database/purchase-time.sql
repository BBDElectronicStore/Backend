--changeset luke:ddl:alterTable:orders
ALTER TABLE "orders"
    ADD COLUMN "purchase_time" varchar(50) DEFAULT '';
--rollback DROP TABLE "orders";
