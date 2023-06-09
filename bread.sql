CREATE TABLE bread(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    breadStr VARCHAR(100),
    breadInt INTEGER,
    breadFloat FLOAT,
    tanggal DATE,
    breadBoolean BOOLEAN
);
INSERT INTO bread(breadStr, breadInt, breadFloat, tanggal, breadBoolean) VALUES
("Testing Data", 12, 1.45, "2017-12-12", "true"),
("Coba lagi", 99, 100.405, "2017-11-20", "false"),
("Super sekali", 0, 1.45, "2015-11-11", "false"),
("Richard", 122, 12.35, "2012-03-10", "false"),
("Gilang", 23, 99.99, "2015-05-01", "true"),
("Yudi", 11, 1.11, "2011-11-11", "true"),
("Dimas", 195, 0.12, "2013-04-20", "false"),
("Henky", 100, 2.22, "2012-02-12", "false"),
("Dian", 95, 22.22, "2019-06-23", "false")