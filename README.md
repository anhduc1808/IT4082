# Bài toán: Xây dựng phần mềm quản lý thu phí chung cư

## Mục lục

- [Mô tả yêu cầu](#mô-tả-yêu-cầu)
  - [Ví dụ mẫu sổ quản lý thu các khoản đóng góp](#ví-dụ-mẫu-sổ-quản-lý-thu-các-khoản-đóng-góp)
  - [1. Quản lý thông tin các khoản thu phí](#1-quản-lý-thông-tin-các-khoản-thu-phí)
  - [2. Quản lý việc thu phí hộ gia đình](#2-quản-lý-việc-thu-phí-hộ-gia-đình)
  - [3. Tra cứu và tìm kiếm](#3-tra-cứu-và-tìm-kiếm)
  - [4. Thống kê cơ bản](#4-thống-kê-cơ-bản)
  - [5. Quản lý hộ gia đình và nhân khẩu](#5-quản-lý-hộ-gia-đình-và-nhân-khẩu)
  - [6. Bảo mật và quản lý tài khoản](#6-bảo-mật-và-quản-lý-tài-khoản)
  - [7. Quản lý phí gửi xe](#7-quản-lý-phí-gửi-xe)
  - [8. Quản lý chi phí điện, nước, internet](#8-quản-lý-chi-phí-điện-nước-internet)
- [Yêu cầu kỹ thuật](#yêu-cầu-kỹ-thuật)
- [IT4082](#it4082)

---

## Mô tả yêu cầu

Chung cư **BlueMoon**, tọa lạc tại ngã tư Văn Phú, được khởi công xây dựng năm 2021 và hoàn thành vào năm 2023. Dự án gồm 30 tầng, trong đó:

- Tầng 1: kiot
- 4 tầng đế
- 24 tầng nhà ở
- 1 tầng penthouse

Các hộ gia đình sẽ phải đóng định kỳ các khoản phí để phục vụ quản lý và vận hành chung cư. Ban quản trị do cư dân bầu chọn chịu trách nhiệm thu và quản lý các khoản phí này.

### Các loại phí chính

- **Phí dịch vụ chung cư** (bắt buộc, tính theo m²):  
  Dao động từ 2.500 đến 16.500 đồng/m²/tháng. Dùng cho các dịch vụ như vệ sinh, bảo dưỡng, an ninh, thu gom rác...

- **Phí quản lý chung cư** (bắt buộc):  
  Phục vụ cho công tác vận hành quản lý. BlueMoon thu mức từ 7.000 đồng/m²/tháng.

- **Các khoản đóng góp tự nguyện**:  
  Ví dụ: Quỹ vì người nghèo, quỹ từ thiện, biển đảo... thu theo đợt, không bắt buộc.

Hiện tại việc quản lý đang được thực hiện thủ công hoặc bằng Excel. Ban quản trị mong muốn xây dựng **phần mềm quản lý thu phí** để chuyên nghiệp hóa quy trình này.

---

### Ví dụ mẫu sổ quản lý thu các khoản đóng góp

| Hộ gia đình | Phí dịch vụ | Phí quản lý | Đóng góp   | Tổng cộng     |
|-------------|-------------|-------------|------------|---------------|
| Hộ 1        | 500,000 VND | 140,000 VND | 50,000 VND | 690,000 VND   |
| Hộ 2        | 700,000 VND | 196,000 VND | 100,000 VND| 996,000 VND   |

---

### 1. Quản lý thông tin các khoản thu phí

- Theo dõi phí dịch vụ, phí quản lý theo từng hộ
- Quản lý các khoản đóng góp tự nguyện theo đợt

---

### 2. Quản lý việc thu phí hộ gia đình

- Ghi nhận các khoản đã thanh toán
- Cung cấp hóa đơn/biên lai

---

### 3. Tra cứu và tìm kiếm

- Tra cứu thông tin khoản phí theo từng hộ
- Tìm kiếm theo tên hộ, thời gian, loại phí...

---

### 4. Thống kê cơ bản

- Thống kê tổng thu theo tháng, quý, năm
- Theo dõi tỷ lệ hoàn thành nghĩa vụ đóng phí

---

### 5. Quản lý hộ gia đình và nhân khẩu

- Quản lý thông tin hộ khẩu, nhân khẩu
- Ghi nhận biến động cư trú, tạm trú, tạm vắng

---

### 6. Bảo mật và quản lý tài khoản

- Truy cập hệ thống sau khi đăng nhập
- Cho phép đổi mật khẩu, cập nhật thông tin tài khoản

---

### 7. Quản lý phí gửi xe

- Ghi nhận phí gửi xe theo phương tiện đăng ký
  - Xe máy: 70.000 VND/xe/tháng
  - Ô tô: 1.200.000 VND/xe/tháng

---

### 8. Quản lý chi phí điện, nước, internet

- Thu hộ dựa theo thông báo của nhà cung cấp dịch vụ

---

## Yêu cầu kỹ thuật

- Phần mềm phát triển dưới dạng **ứng dụng desktop**
- Ngôn ngữ: **Java**
- Dữ liệu lưu trữ trên **MySQL Server**
- Có thể thay đổi công nghệ nếu phù hợp hơn với giải pháp

---

## IT4082
