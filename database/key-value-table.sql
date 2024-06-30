--changeset luke:ddl:createTable:special
CREATE TABLE "special" (
                          "special_id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                          "key" varchar(50) NOT NULL UNIQUE,
                          "value" varchar(50) NOT NULL
);
--rollback DROP TABLE "special";