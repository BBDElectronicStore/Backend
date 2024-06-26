--changeset luke:ddl:createTable:test
CREATE TABLE test (
    id SERIAL PRIMARY KEY
);
--rollback DROP TABLE "test";
