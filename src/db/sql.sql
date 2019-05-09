CREATE TABLE "user" (
  "name" VARCHAR2(25) NOT NULL,
  "phone" CHAR(11) NOT NULL PRIMARY KEY,
  "password" VARCHAR2(30) NOT NULL,
  "sex" CHAR(1),
  CHECK(sex=0 OR sex=1)
)
CREATE TABLE "login" (
  "phone" CHAR(11) NOT NULL PRIMARY KEY,
  "token" CHAR(30) NOT NULL ,
  FOREIGN KEY ("phone") REFERENCES "user"("phone")
)
CREATE TABLE "goods" (
  "id" CHAR(6) NOT NULL PRIMARY KEY,
  "time" VARCHAR(13),
  "name" VARCHAR(255) NOT NULL,
  "discribe" VARCHAR(255),
  "phone" CHAR(11),
  FOREIGN KEY ("phone") REFERENCES "user"("phone")
)
insert into comment_path (ancestor, descendant, depth) 
select cp.ancestor, 10, cp.depth+1 from comment_path as cp 
where cp.descendant=6 union all select 10, 10, 0;