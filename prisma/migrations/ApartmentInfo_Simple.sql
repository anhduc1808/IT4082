-- Xóa bảng Apartment nếu tồn tại cùng các đối tượng phụ thuộc
DROP TABLE IF EXISTS public."Apartment" CASCADE;

-- Tạo bảng Apartment
CREATE TABLE public."Apartment" (
    id SERIAL PRIMARY KEY,
    apartmentNo INTEGER,
    size INTEGER
);

-- Dữ liệu mẫu
INSERT INTO public."Apartment" (apartmentNo, size) VALUES
(1, 3),
(2, 2),
(3, 4),
(4, 1),
(5, 2),
(6, 5),
(7, 3),
(8, 4),
(9, 2),
(10, 1),
(11, 3),
(12, 5),
(13, 4),
(14, 2),
(15, 3),
(16, 1),
(17, 2),
(18, 4),
(19, 3),
(20, 5),
(21, 2),
(22, 1),
(23, 3),
(24, 4),
(25, 5),
(26, 2),
(27, 3),
(28, 1),
(29, 4),
(30, 2),
(31, 3),
(32, 1),
(33, 5),
(34, 4),
(35, 3),
(36, 2),
(37, 1),
(38, 5),
(39, 2),
(40, 3),
(41, 4),
(42, 1),
(43, 5),
(44, 3),
(45, 2),
(46, 1),
(47, 4),
(48, 2),
(49, 3),
(50, 5);
ALTER TABLE public."Apartment" RENAME COLUMN apartmentno TO "apartmentNo";
