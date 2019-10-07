'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.runSql(`
  CREATE TABLE client(
    id serial PRIMARY KEY,
    nama varchar(10) UNIQUE NOT NULL,
    client_id text UNIQUE NOT NULL,
    url text UNIQUE NOT NULL
  );
  
  CREATE INDEX "url_index" ON client USING HASH(url);
  
  CREATE TABLE matakuliah(
    id serial PRIMARY KEY,
    kode char(11) UNIQUE NOT NULL,
    nama varchar(100) UNIQUE NOT NULL
  );
  
  CREATE INDEX "mata_kuliah_index" ON matakuliah USING HASH(kode);
  
  CREATE TABLE "user"(
    id serial PRIMARY KEY,
    nomor varchar(10) UNIQUE NOT NULL,
    nama varchar(100) UNIQUE NOT NULL,
    role smallint NOT NULL
  );
  
  CREATE INDEX "nomor_index" ON "user" USING HASH(nomor);
  
  CREATE TABLE ruangan (
    id serial PRIMARY KEY,
    nama varchar(5) UNIQUE NOT NULL
  );
  
  CREATE INDEX "ruangan_index" ON ruangan USING HASH(nama);
  
  CREATE TABLE kelas (
    id serial PRIMARY KEY,
    matakuliah int REFERENCES matakuliah(id) NOT NULL,
    jenis smallint NOT NULL,
    kode varchar(3) NOT NULL,
    ruangan int REFERENCES ruangan(id) NOT NULL,
    waktuMulai time NOT NULL,
    waktuSelesai time NOT NULL,
    hari smallint NOT NULL
  );
  
  CREATE TABLE account (
    id serial PRIMARY KEY,
    provider varchar(10) NOT NULL,
    account text UNIQUE NOT NULL,
    userId int REFERENCES "user"(id) NOT NULL
  );
  
  CREATE INDEX "account_index" ON account USING HASH(account);
  
  CREATE TABLE pesertamatakuliah (
    userId int REFERENCES "user"(id) NOT NULL,
    kelasId int REFERENCES kelas(id) NOT NULL
  );
  
  CREATE VIEW user_account AS
    SELECT
      "user".id AS id,
      "user".nomor AS nomor,
      "user".nama AS nama,
      "user".role AS role,
      account.provider AS provider,
      account.account AS account
    FROM
      "user" LEFT JOIN account
        ON account.userId = "user".id;
        
  INSERT INTO "user" (nomor, nama, role)
  VALUES ('2017730017', 'Cristopher', 0);
  
  INSERT INTO "user" (nomor, nama, role)
  VALUES ('2017730023', 'Kevin Draven Kenanga', 0);
  
  INSERT INTO "user" (nomor, nama, role)
  VALUES ('2017730054', 'William Xaverius Walah', 0);
  
  INSERT INTO "user" (nomor, nama, role)
  VALUES ('20090002', 'Kristopher David Harjono', 1);
  
  INSERT INTO account
  (provider, account, userId)
  VALUES
  ('line', 'U5b6d6f86b1ec42727cfdced840671e51', 1);
      
  INSERT INTO account
  (provider, account, userId)
  VALUES
  ('line', 'okawokawok', 2);
  
  INSERT INTO client 
  (nama, client_id, url)
  VALUES
  ('line', 'fE+shUppcSfq5IEz7rnkPKFBx9nmjAWnykLZK/38j4CpKm41vq57VmvLymDkfR0kYXurTp40HFKUbQs8D1zDYM4eFInxFeYj6fMn1WRwN6Q0fQbMQlM/QQ1FzTjdfuET/nTnNlIiti7aohufECIoKwdB04t89/1O/w1cDnyilFU=', 'https://wombatable-line-client.herokuapp.com/');`,
  callback);
};

exports.down = function(db, callback) {
  db.runSql(`
    DROP TABLE IF EXISTS pesertamatakuliah;
    DROP TABLE IF EXISTS kelas;
    DROP TABLE IF EXISTS ruangan;
    DROP TABLE IF EXISTS matakuliah;
    DROP VIEW IF EXISTS user_account;
    DROP TABLE IF EXISTS account;
    DROP TABLE IF EXISTS "user";
    DROP TABLE IF EXISTS client;`,
  callback
  );
};

exports._meta = {
  "version": 1
};
