USE elearning_system;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE session_attendance;
TRUNCATE TABLE class_sessions;
TRUNCATE TABLE notifications;
TRUNCATE TABLE discussion_comments;
TRUNCATE TABLE discussions;
TRUNCATE TABLE course_reviews;
TRUNCATE TABLE certificates;
TRUNCATE TABLE payments;
TRUNCATE TABLE quiz_answers;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE answer_options;
TRUNCATE TABLE questions;
TRUNCATE TABLE quizzes;
TRUNCATE TABLE assignment_submissions;
TRUNCATE TABLE assignments;
TRUNCATE TABLE lesson_progress;
TRUNCATE TABLE lesson_resources;
TRUNCATE TABLE lessons;
TRUNCATE TABLE course_modules;
TRUNCATE TABLE enrollments;
TRUNCATE TABLE course_batches;
TRUNCATE TABLE courses;
TRUNCATE TABLE course_categories;
TRUNCATE TABLE student_profiles;
TRUNCATE TABLE teacher_profiles;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- 1. USERS
-- =========================

INSERT INTO users
(user_id, full_name, email, password_hash, phone, avatar_url, role, status)
VALUES
(1, 'Admin 01', 'admin1@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0900000001', NULL, 'ADMIN', 'ACTIVE'),
(2, 'Admin 02', 'admin2@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0900000002', NULL, 'ADMIN', 'ACTIVE'),

(3, 'Giảng viên 01', 'gv01@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0910000001', NULL, 'TEACHER', 'ACTIVE'),
(4, 'Giảng viên 02', 'gv02@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0910000002', NULL, 'TEACHER', 'ACTIVE'),
(5, 'Giảng viên 03', 'gv03@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0910000003', NULL, 'TEACHER', 'ACTIVE'),
(6, 'Giảng viên 04', 'gv04@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0910000004', NULL, 'TEACHER', 'ACTIVE'),
(7, 'Giảng viên 05', 'gv05@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0910000005', NULL, 'TEACHER', 'ACTIVE'),

(8, 'Học viên 01', 'hv01@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000001', NULL, 'STUDENT', 'ACTIVE'),
(9, 'Học viên 02', 'hv02@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000002', NULL, 'STUDENT', 'ACTIVE'),
(10, 'Học viên 03', 'hv03@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000003', NULL, 'STUDENT', 'ACTIVE'),
(11, 'Học viên 04', 'hv04@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000004', NULL, 'STUDENT', 'ACTIVE'),
(12, 'Học viên 05', 'hv05@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000005', NULL, 'STUDENT', 'ACTIVE'),
(13, 'Học viên 06', 'hv06@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000006', NULL, 'STUDENT', 'ACTIVE'),
(14, 'Học viên 07', 'hv07@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000007', NULL, 'STUDENT', 'ACTIVE'),
(15, 'Học viên 08', 'hv08@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000008', NULL, 'STUDENT', 'ACTIVE'),
(16, 'Học viên 09', 'hv09@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000009', NULL, 'STUDENT', 'ACTIVE'),
(17, 'Học viên 10', 'hv10@elearning.vn', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '0920000010', NULL, 'STUDENT', 'ACTIVE');

INSERT INTO teacher_profiles
(teacher_id, bio, specialization, experience_years, qualification, workplace)
VALUES
(3, 'Giảng viên demo 01', 'Lập trình Web', 5, 'Cử nhân CNTT', 'E-learning Center'),
(4, 'Giảng viên demo 02', 'Digital Marketing', 6, 'Cử nhân Marketing', 'E-learning Center'),
(5, 'Giảng viên demo 03', 'Tiếng Anh', 4, 'TESOL', 'E-learning Center'),
(6, 'Giảng viên demo 04', 'Phân tích dữ liệu', 5, 'Cử nhân HTTT', 'E-learning Center'),
(7, 'Giảng viên demo 05', 'Thiết kế đồ họa', 3, 'Cử nhân Thiết kế', 'E-learning Center');

INSERT INTO student_profiles
(student_id, date_of_birth, gender, address)
VALUES
(8, '2001-01-01', 'MALE', 'TP.HCM'),
(9, '2001-01-02', 'FEMALE', 'TP.HCM'),
(10, '2001-01-03', 'MALE', 'TP.HCM'),
(11, '2001-01-04', 'FEMALE', 'TP.HCM'),
(12, '2001-01-05', 'MALE', 'TP.HCM'),
(13, '2001-01-06', 'FEMALE', 'TP.HCM'),
(14, '2001-01-07', 'MALE', 'TP.HCM'),
(15, '2001-01-08', 'FEMALE', 'TP.HCM'),
(16, '2001-01-09', 'MALE', 'TP.HCM'),
(17, '2001-01-10', 'FEMALE', 'TP.HCM');

-- =========================
-- 4. COURSE CATEGORIES
-- =========================

INSERT INTO course_categories
(category_id, category_name, description, status)
VALUES
(1, 'Lập trình', 'Các khóa học về lập trình web, backend, frontend và cơ sở dữ liệu.', 'ACTIVE'),
(2, 'Marketing', 'Các khóa học về quảng cáo, nội dung, thương hiệu và tăng trưởng.', 'ACTIVE'),
(3, 'Ngoại ngữ', 'Các khóa học tiếng Anh giao tiếp, IELTS và ngoại ngữ ứng dụng.', 'ACTIVE'),
(4, 'Dữ liệu', 'Các khóa học Excel, Power BI, SQL và phân tích dữ liệu.', 'ACTIVE'),
(5, 'Thiết kế', 'Các khóa học thiết kế đồ họa, Canva, branding và social media.', 'ACTIVE'),
(6, 'Kỹ năng mềm', 'Các khóa học kỹ năng giao tiếp, quản lý thời gian và làm việc nhóm.', 'ACTIVE'),
(7, 'Kinh doanh', 'Các khóa học thương mại điện tử, tài chính và vận hành kinh doanh.', 'ACTIVE');

-- =========================
-- 5. COURSES
-- =========================

INSERT INTO courses
(course_id, category_id, teacher_id, course_name, description, thumbnail_url, level, price, status)
VALUES
(1, 1, 3, 'Lập trình Web căn bản với HTML, CSS, JavaScript', 'Khóa học dành cho người mới bắt đầu xây dựng website từ con số 0.', '/courses/web-basic.jpg', 'BEGINNER', 799000, 'APPROVED'),
(2, 1, 3, 'ReactJS thực chiến cho người mới', 'Học ReactJS qua dự án thực tế, xây dựng giao diện web hiện đại.', '/courses/react-basic.jpg', 'INTERMEDIATE', 1299000, 'APPROVED'),
(3, 2, 4, 'Facebook Ads thực chiến cho người mới', 'Nắm nền tảng chạy quảng cáo Facebook, tối ưu nội dung và ngân sách.', '/courses/facebook-ads.jpg', 'BEGINNER', 990000, 'APPROVED'),
(4, 2, 4, 'TikTok Content & Livestream bán hàng', 'Xây dựng kịch bản video ngắn, livestream và tối ưu chuyển đổi.', '/courses/tiktok-content.jpg', 'INTERMEDIATE', 1199000, 'APPROVED'),
(5, 3, 5, 'Tiếng Anh giao tiếp cho người đi làm', 'Tập trung phản xạ giao tiếp công sở, họp hành và email cơ bản.', '/courses/english-office.jpg', 'BEGINNER', 890000, 'APPROVED'),
(6, 4, 6, 'Excel và Power BI cho báo cáo doanh nghiệp', 'Xử lý dữ liệu, tạo dashboard và báo cáo trực quan.', '/courses/powerbi-excel.jpg', 'INTERMEDIATE', 1499000, 'APPROVED'),
(7, 5, 7, 'Thiết kế bài đăng bán hàng bằng Canva', 'Tạo hình ảnh quảng cáo, banner và nội dung social media đẹp mắt.', '/courses/canva-sale.jpg', 'BEGINNER', 690000, 'APPROVED'),
(8, 6, 8, 'Kỹ năng thuyết trình tự tin', 'Rèn luyện cách trình bày, kiểm soát giọng nói và xử lý câu hỏi.', '/courses/presentation.jpg', 'BEGINNER', 590000, 'APPROVED'),
(9, 7, 9, 'Tài chính cá nhân cho người trẻ', 'Quản lý thu chi, tiết kiệm, đầu tư cơ bản và xây dựng quỹ dự phòng.', '/courses/personal-finance.jpg', 'BEGINNER', 790000, 'APPROVED'),
(10, 7, 10, 'Vận hành shop online trên sàn thương mại điện tử', 'Quản lý sản phẩm, đơn hàng, chăm sóc khách hàng và tối ưu doanh số.', '/courses/ecommerce.jpg', 'INTERMEDIATE', 1099000, 'PENDING');

-- =========================
-- 6. COURSE BATCHES - BẢN MỚI
-- =========================

INSERT INTO course_batches
(
    batch_id,
    course_id,
    teacher_id,
    batch_code,
    batch_name,
    start_date,
    end_date,
    enrollment_start_date,
    enrollment_deadline,
    min_students,
    max_students,
    tuition_fee,
    learning_mode,
    online_platform,
    default_meeting_url,
    timezone,
    status,
    note
)
VALUES
(1, 1, 3, 'WEB-K01', 'Web căn bản K01 - Tối 2/4/6', '2026-06-01', '2026-07-10', '2026-05-01', '2026-05-31', 5, 30, 799000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/web-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp học online buổi tối thứ 2, 4, 6.'),
(2, 1, 3, 'WEB-K02', 'Web căn bản K02 - Cuối tuần', '2026-06-15', '2026-07-27', '2026-05-15', '2026-06-10', 5, 25, 799000, 'ONLINE', 'GOOGLE_MEET', 'https://meet.google.com/web-k02', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp cuối tuần dành cho người đi làm.'),
(3, 2, 3, 'REACT-K01', 'ReactJS thực chiến K01', '2026-06-08', '2026-07-31', '2026-05-10', '2026-06-05', 5, 25, 1299000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/react-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp ReactJS thực chiến, học qua dự án.'),
(4, 3, 4, 'ADS-K01', 'Facebook Ads K01 - Buổi tối', '2026-06-03', '2026-07-15', '2026-05-10', '2026-06-01', 5, 40, 990000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/ads-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp Facebook Ads thực chiến buổi tối.'),
(5, 4, 4, 'TIKTOK-K01', 'TikTok Content K01', '2026-06-20', '2026-07-25', '2026-05-20', '2026-06-18', 5, 35, 1199000, 'ONLINE', 'GOOGLE_MEET', 'https://meet.google.com/tiktok-k01', 'Asia/Ho_Chi_Minh', 'DRAFT', 'Lớp TikTok content và livestream bán hàng.'),
(6, 5, 5, 'ENG-K01', 'Tiếng Anh công sở K01', '2026-06-05', '2026-08-05', '2026-05-10', '2026-06-03', 8, 30, 890000, 'ONLINE', 'MICROSOFT_TEAMS', 'https://teams.microsoft.com/eng-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp tiếng Anh công sở online.'),
(7, 6, 6, 'DATA-K01', 'Power BI doanh nghiệp K01', '2026-06-10', '2026-07-20', '2026-05-15', '2026-06-08', 5, 25, 1499000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/data-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp Excel và Power BI cho báo cáo doanh nghiệp.'),
(8, 7, 7, 'CANVA-K01', 'Canva bán hàng K01', '2026-06-12', '2026-07-12', '2026-05-18', '2026-06-10', 5, 30, 690000, 'ONLINE', 'GOOGLE_MEET', 'https://meet.google.com/canva-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp thiết kế bài đăng bán hàng bằng Canva.'),
(9, 8, 8, 'PRESENT-K01', 'Thuyết trình tự tin K01', '2026-06-18', '2026-07-18', '2026-05-20', '2026-06-15', 5, 20, 590000, 'HYBRID', 'ZOOM', 'https://zoom.us/j/present-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp kỹ năng thuyết trình kết hợp online và thực hành.'),
(10, 9, 9, 'FINANCE-K01', 'Tài chính cá nhân K01', '2026-06-22', '2026-07-22', '2026-05-20', '2026-06-20', 5, 30, 790000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/finance-k01', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp tài chính cá nhân cho người trẻ.'),
(11, 10, 10, 'ECOM-K01', 'Vận hành shop online K01', '2026-07-01', '2026-08-12', '2026-06-01', '2026-06-28', 5, 30, 1099000, 'ONLINE', 'GOOGLE_MEET', 'https://meet.google.com/ecom-k01', 'Asia/Ho_Chi_Minh', 'DRAFT', 'Lớp vận hành shop online trên sàn thương mại điện tử.'),
(12, 3, 4, 'ADS-K02', 'Facebook Ads K02 - Cuối tuần', '2026-07-05', '2026-08-16', '2026-06-01', '2026-07-01', 5, 35, 990000, 'ONLINE', 'ZOOM', 'https://zoom.us/j/ads-k02', 'Asia/Ho_Chi_Minh', 'OPEN', 'Lớp Facebook Ads cuối tuần.');

-- =========================
-- 7. COURSE MODULES
-- =========================

INSERT INTO course_modules
(module_id, course_id, module_title, description, order_no)
VALUES
(1, 1, 'Nền tảng HTML và cấu trúc website', 'Làm quen với HTML, thẻ cơ bản và cấu trúc trang.', 1),
(2, 1, 'CSS và bố cục giao diện', 'Làm đẹp website bằng CSS, flexbox và responsive.', 2),

(3, 2, 'Tổng quan ReactJS', 'Component, props, state và cách tổ chức project.', 1),
(4, 2, 'Xây dựng dự án React thực tế', 'Làm mini project quản lý khóa học.', 2),

(5, 3, 'Tư duy quảng cáo Facebook', 'Hiểu phễu khách hàng và cách viết nội dung.', 1),
(6, 3, 'Thiết lập và tối ưu chiến dịch', 'Cài đặt chiến dịch, nhóm quảng cáo và đo lường.', 2),

(7, 4, 'Xây dựng kịch bản TikTok', 'Hook, nội dung, CTA và nhịp dựng video.', 1),
(8, 4, 'Livestream bán hàng', 'Chuẩn bị kịch bản live, xử lý phản hồi và chốt đơn.', 2),

(9, 5, 'Giao tiếp công sở cơ bản', 'Chào hỏi, giới thiệu bản thân và trao đổi công việc.', 1),
(10, 5, 'Họp và trình bày bằng tiếng Anh', 'Từ vựng, mẫu câu và phản xạ trong cuộc họp.', 2),

(11, 6, 'Excel xử lý dữ liệu', 'Hàm, pivot table và làm sạch dữ liệu.', 1),
(12, 6, 'Power BI dashboard', 'Tạo biểu đồ, dashboard và báo cáo quản trị.', 2),

(13, 7, 'Canva nền tảng', 'Làm quen giao diện, font, màu sắc và bố cục.', 1),
(14, 7, 'Thiết kế bài bán hàng', 'Thiết kế ảnh quảng cáo, sale post và banner.', 2),

(15, 8, 'Tư duy thuyết trình', 'Chuẩn bị nội dung và cấu trúc bài nói.', 1),
(16, 8, 'Thực hành trình bày', 'Luyện giọng, ngôn ngữ cơ thể và xử lý câu hỏi.', 2),

(17, 9, 'Quản lý thu chi cá nhân', 'Theo dõi dòng tiền và lập ngân sách cá nhân.', 1),
(18, 9, 'Đầu tư cơ bản', 'Các kênh đầu tư phổ biến và quản trị rủi ro.', 2),

(19, 10, 'Xây dựng gian hàng online', 'Tối ưu sản phẩm, hình ảnh và mô tả.', 1),
(20, 10, 'Vận hành đơn hàng và CSKH', 'Quản lý đơn hàng, phản hồi khách và đánh giá.', 2);

-- =========================
-- 8. LESSONS
-- =========================

INSERT INTO lessons
(lesson_id, module_id, lesson_title, lesson_type, content, video_url, duration_minutes, is_preview, order_no)
VALUES
(1, 1, 'Giới thiệu khóa học và lộ trình học', 'VIDEO', 'Tổng quan nội dung khóa học.', '/videos/web/intro.mp4', 15, TRUE, 1),
(2, 1, 'HTML là gì và cách tạo trang đầu tiên', 'VIDEO', 'Học cách tạo file HTML đầu tiên.', '/videos/web/html-basic.mp4', 35, FALSE, 2),
(3, 2, 'CSS cơ bản và màu sắc', 'VIDEO', 'Làm đẹp giao diện bằng CSS.', '/videos/web/css-basic.mp4', 40, FALSE, 1),
(4, 2, 'Buổi live chữa bài HTML/CSS', 'LIVE', 'Lớp học online trực tiếp qua phòng học.', NULL, 90, FALSE, 2),

(5, 3, 'ReactJS là gì?', 'VIDEO', 'Giới thiệu React và component.', '/videos/react/intro.mp4', 30, TRUE, 1),
(6, 3, 'State và Props', 'VIDEO', 'Quản lý dữ liệu trong component.', '/videos/react/state-props.mp4', 45, FALSE, 2),
(7, 4, 'Xây dựng giao diện danh sách khóa học', 'LIVE', 'Buổi học online thực hành React.', NULL, 120, FALSE, 1),

(8, 5, 'Phễu khách hàng trong Facebook Ads', 'VIDEO', 'Tư duy quảng cáo theo từng giai đoạn.', '/videos/ads/funnel.mp4', 32, TRUE, 1),
(9, 5, 'Cách viết hook quảng cáo', 'VIDEO', 'Viết mở đầu thu hút người xem.', '/videos/ads/hook.mp4', 38, FALSE, 2),
(10, 6, 'Thiết lập chiến dịch quảng cáo', 'LIVE', 'Giảng viên hướng dẫn trực tiếp trên tài khoản demo.', NULL, 120, FALSE, 1),

(11, 7, 'Cấu trúc video TikTok bán hàng', 'VIDEO', 'Hook, body, proof và CTA.', '/videos/tiktok/script.mp4', 28, TRUE, 1),
(12, 8, 'Kịch bản livestream chốt đơn', 'LIVE', 'Thực hành live bán hàng theo nhóm.', NULL, 90, FALSE, 1),

(13, 9, 'Giới thiệu bản thân bằng tiếng Anh', 'VIDEO', 'Mẫu câu giao tiếp cơ bản.', '/videos/english/intro.mp4', 25, TRUE, 1),
(14, 10, 'Thực hành họp online bằng tiếng Anh', 'LIVE', 'Buổi học trực tuyến luyện phản xạ.', NULL, 90, FALSE, 1),

(15, 11, 'Làm sạch dữ liệu trong Excel', 'VIDEO', 'Xử lý dữ liệu trùng, sai định dạng.', '/videos/data/excel-clean.mp4', 40, TRUE, 1),
(16, 12, 'Tạo dashboard Power BI đầu tiên', 'LIVE', 'Thực hành tạo dashboard trực tiếp.', NULL, 120, FALSE, 1),

(17, 13, 'Nguyên tắc bố cục trong Canva', 'VIDEO', 'Cách dùng font, màu và khoảng trắng.', '/videos/canva/layout.mp4', 30, TRUE, 1),
(18, 14, 'Thiết kế banner sale giữa tháng', 'LIVE', 'Giảng viên sửa bài trực tiếp.', NULL, 90, FALSE, 1),

(19, 15, 'Cấu trúc bài thuyết trình 5 phút', 'VIDEO', 'Mở bài, thân bài, kết luận.', '/videos/softskill/presentation-structure.mp4', 27, TRUE, 1),
(20, 16, 'Thực hành trình bày trước lớp', 'LIVE', 'Học viên trình bày và nhận góp ý.', NULL, 90, FALSE, 1),

(21, 17, 'Lập bảng thu chi cá nhân', 'VIDEO', 'Tạo bảng theo dõi tiền vào và tiền ra.', '/videos/finance/budget.mp4', 35, TRUE, 1),
(22, 18, 'Đầu tư cơ bản cho người mới', 'LIVE', 'Hỏi đáp trực tuyến về đầu tư an toàn.', NULL, 90, FALSE, 1),

(23, 19, 'Tối ưu tiêu đề sản phẩm', 'VIDEO', 'Viết tiêu đề và mô tả sản phẩm dễ bán.', '/videos/ecom/title.mp4', 32, TRUE, 1),
(24, 20, 'Xử lý đơn hàng và phản hồi khách', 'LIVE', 'Thực hành xử lý tình huống khách hàng.', NULL, 90, FALSE, 1),

(25, 1, 'Bài đọc: Cấu trúc HTML chuẩn', 'TEXT', 'Nội dung đọc thêm về HTML semantic.', NULL, 20, FALSE, 3),
(26, 5, 'Checklist trước khi chạy quảng cáo', 'PDF', 'Tài liệu checklist quảng cáo.', NULL, 15, FALSE, 3),
(27, 11, 'File mẫu Excel doanh nghiệp', 'PDF', 'Tài liệu thực hành Excel.', NULL, 10, FALSE, 2),
(28, 13, 'Bộ màu thiết kế bán hàng', 'PDF', 'Bảng màu và font gợi ý.', NULL, 10, FALSE, 2),
(29, 17, 'Mẫu file quản lý tài chính cá nhân', 'PDF', 'File mẫu quản lý thu chi.', NULL, 10, FALSE, 2),
(30, 19, 'Checklist vận hành shop online', 'PDF', 'Checklist đăng sản phẩm và xử lý đơn.', NULL, 10, FALSE, 2);

-- =========================
-- 9. LESSON RESOURCES
-- =========================

INSERT INTO lesson_resources
(resource_id, lesson_id, resource_name, resource_type, resource_url)
VALUES
(1, 2, 'File mẫu HTML bài 1', 'OTHER', '/resources/html-bai-1.zip'),
(2, 3, 'Bài tập CSS cơ bản', 'PDF', '/resources/css-basic.pdf'),
(3, 6, 'Slide State và Props', 'SLIDE', '/resources/react-state-props.pdf'),
(4, 8, 'Mẫu phễu khách hàng', 'PDF', '/resources/facebook-funnel.pdf'),
(5, 9, '50 mẫu hook quảng cáo', 'PDF', '/resources/50-hook-ads.pdf'),
(6, 11, 'Mẫu kịch bản TikTok', 'PDF', '/resources/tiktok-script.pdf'),
(7, 13, 'Từ vựng giới thiệu bản thân', 'PDF', '/resources/english-introduction.pdf'),
(8, 15, 'File Excel thực hành', 'OTHER', '/resources/excel-demo.xlsx'),
(9, 16, 'Dữ liệu mẫu Power BI', 'OTHER', '/resources/powerbi-data.xlsx'),
(10, 17, 'Bộ template Canva', 'LINK', 'https://example.com/canva-template'),
(11, 19, 'Mẫu dàn ý thuyết trình', 'PDF', '/resources/presentation-outline.pdf'),
(12, 21, 'File quản lý thu chi', 'OTHER', '/resources/budget-template.xlsx'),
(13, 23, 'Mẫu tiêu đề sản phẩm', 'PDF', '/resources/ecom-title.pdf'),
(14, 24, 'Kịch bản CSKH mẫu', 'PDF', '/resources/customer-care-script.pdf'),
(15, 30, 'Checklist shop online', 'PDF', '/resources/ecom-checklist.pdf');

-- =========================
-- 10. CLASS SESSIONS
-- =========================

INSERT INTO class_sessions
(session_id, batch_id, teacher_id, session_title, session_description, start_time, end_time, meeting_url, meeting_password, platform, status, recording_url, note)
VALUES
(1, 1, 3, 'Buổi 1: Giới thiệu HTML và cấu trúc website', 'Giảng viên giới thiệu lộ trình học và cách tạo trang HTML đầu tiên.', '2026-06-01 20:00:00', '2026-06-01 21:30:00', 'https://zoom.us/j/web-k01-buoi-1', 'WEB001', 'ZOOM', 'SCHEDULED', NULL, 'Học viên chuẩn bị máy tính và trình duyệt Chrome.'),
(2, 1, 3, 'Buổi 2: HTML semantic và form cơ bản', 'Thực hành tạo form đăng ký đơn giản.', '2026-06-03 20:00:00', '2026-06-03 21:30:00', 'https://zoom.us/j/web-k01-buoi-2', 'WEB002', 'ZOOM', 'SCHEDULED', NULL, NULL),
(3, 1, 3, 'Buổi 3: CSS căn bản', 'Làm quen selector, màu sắc, font chữ và khoảng cách.', '2026-06-05 20:00:00', '2026-06-05 21:30:00', 'https://zoom.us/j/web-k01-buoi-3', 'WEB003', 'ZOOM', 'SCHEDULED', NULL, NULL),

(4, 2, 3, 'Buổi 1: Làm website cá nhân', 'Tạo bố cục trang giới thiệu cá nhân.', '2026-06-15 09:00:00', '2026-06-15 11:00:00', 'https://meet.google.com/web-k02-buoi-1', 'WEBK02', 'GOOGLE_MEET', 'SCHEDULED', NULL, 'Lớp cuối tuần.'),
(5, 2, 3, 'Buổi 2: Responsive trên mobile', 'Tối ưu giao diện web trên điện thoại.', '2026-06-22 09:00:00', '2026-06-22 11:00:00', 'https://meet.google.com/web-k02-buoi-2', 'WEBK02', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),

(6, 3, 3, 'Buổi 1: Tổng quan ReactJS', 'Giới thiệu component, props, state.', '2026-06-08 20:00:00', '2026-06-08 22:00:00', 'https://zoom.us/j/react-k01-buoi-1', 'REACT1', 'ZOOM', 'SCHEDULED', NULL, NULL),
(7, 3, 3, 'Buổi 2: State và sự kiện trong React', 'Thực hành xử lý sự kiện và cập nhật state.', '2026-06-10 20:00:00', '2026-06-10 22:00:00', 'https://zoom.us/j/react-k01-buoi-2', 'REACT2', 'ZOOM', 'SCHEDULED', NULL, NULL),
(8, 3, 3, 'Buổi 3: Làm project danh sách khóa học', 'Xây dựng giao diện danh sách khóa học.', '2026-06-12 20:00:00', '2026-06-12 22:00:00', 'https://zoom.us/j/react-k01-buoi-3', 'REACT3', 'ZOOM', 'SCHEDULED', NULL, NULL),

(9, 4, 4, 'Buổi 1: Tư duy Facebook Ads', 'Hiểu phễu khách hàng và mục tiêu quảng cáo.', '2026-06-03 20:00:00', '2026-06-03 21:30:00', 'https://zoom.us/j/ads-k01-buoi-1', 'ADS001', 'ZOOM', 'SCHEDULED', NULL, NULL),
(10, 4, 4, 'Buổi 2: Viết nội dung quảng cáo', 'Thực hành viết hook và nội dung theo PAS.', '2026-06-05 20:00:00', '2026-06-05 21:30:00', 'https://zoom.us/j/ads-k01-buoi-2', 'ADS002', 'ZOOM', 'SCHEDULED', NULL, NULL),
(11, 4, 4, 'Buổi 3: Thiết lập chiến dịch demo', 'Giảng viên hướng dẫn setup chiến dịch mẫu.', '2026-06-08 20:00:00', '2026-06-08 21:30:00', 'https://zoom.us/j/ads-k01-buoi-3', 'ADS003', 'ZOOM', 'SCHEDULED', NULL, NULL),

(12, 5, 4, 'Buổi 1: Xây dựng kịch bản TikTok', 'Cách viết hook, nội dung và CTA cho video ngắn.', '2026-06-20 20:00:00', '2026-06-20 21:30:00', 'https://meet.google.com/tiktok-k01-buoi-1', 'TIKTOK1', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),
(13, 5, 4, 'Buổi 2: Kịch bản livestream bán hàng', 'Chuẩn bị nội dung live và xử lý phản hồi khách.', '2026-06-22 20:00:00', '2026-06-22 21:30:00', 'https://meet.google.com/tiktok-k01-buoi-2', 'TIKTOK2', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),

(14, 6, 5, 'Buổi 1: Giới thiệu bản thân bằng tiếng Anh', 'Luyện mẫu câu giới thiệu bản thân trong công việc.', '2026-06-05 19:30:00', '2026-06-05 21:00:00', 'https://teams.microsoft.com/eng-k01-buoi-1', 'ENG001', 'MICROSOFT_TEAMS', 'SCHEDULED', NULL, NULL),
(15, 6, 5, 'Buổi 2: Giao tiếp trong cuộc họp', 'Từ vựng và mẫu câu họp online.', '2026-06-09 19:30:00', '2026-06-09 21:00:00', 'https://teams.microsoft.com/eng-k01-buoi-2', 'ENG002', 'MICROSOFT_TEAMS', 'SCHEDULED', NULL, NULL),
(16, 6, 5, 'Buổi 3: Thực hành phản xạ công sở', 'Luyện hội thoại tình huống thực tế.', '2026-06-12 19:30:00', '2026-06-12 21:00:00', 'https://teams.microsoft.com/eng-k01-buoi-3', 'ENG003', 'MICROSOFT_TEAMS', 'SCHEDULED', NULL, NULL),

(17, 7, 6, 'Buổi 1: Làm sạch dữ liệu Excel', 'Xử lý dữ liệu trùng, thiếu và sai định dạng.', '2026-06-10 20:00:00', '2026-06-10 22:00:00', 'https://zoom.us/j/data-k01-buoi-1', 'DATA01', 'ZOOM', 'SCHEDULED', NULL, NULL),
(18, 7, 6, 'Buổi 2: Pivot Table và báo cáo nhanh', 'Tạo bảng tổng hợp doanh thu bằng Pivot Table.', '2026-06-12 20:00:00', '2026-06-12 22:00:00', 'https://zoom.us/j/data-k01-buoi-2', 'DATA02', 'ZOOM', 'SCHEDULED', NULL, NULL),
(19, 7, 6, 'Buổi 3: Dashboard Power BI', 'Tạo dashboard quản trị doanh nghiệp.', '2026-06-15 20:00:00', '2026-06-15 22:00:00', 'https://zoom.us/j/data-k01-buoi-3', 'DATA03', 'ZOOM', 'SCHEDULED', NULL, NULL),

(20, 8, 7, 'Buổi 1: Canva nền tảng', 'Làm quen giao diện Canva và nguyên tắc bố cục.', '2026-06-12 20:00:00', '2026-06-12 21:30:00', 'https://meet.google.com/canva-k01-buoi-1', 'CANVA1', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),
(21, 8, 7, 'Buổi 2: Thiết kế banner sale', 'Thực hành thiết kế banner bán hàng.', '2026-06-15 20:00:00', '2026-06-15 21:30:00', 'https://meet.google.com/canva-k01-buoi-2', 'CANVA2', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),

(22, 9, 8, 'Buổi 1: Cấu trúc bài thuyết trình', 'Xây dựng mở bài, thân bài và kết luận.', '2026-06-18 19:30:00', '2026-06-18 21:00:00', 'https://zoom.us/j/present-k01-buoi-1', 'PRS001', 'ZOOM', 'SCHEDULED', NULL, NULL),
(23, 9, 8, 'Buổi 2: Thực hành trình bày', 'Học viên trình bày và nhận góp ý trực tiếp.', '2026-06-22 19:30:00', '2026-06-22 21:00:00', 'https://zoom.us/j/present-k01-buoi-2', 'PRS002', 'ZOOM', 'SCHEDULED', NULL, NULL),

(24, 10, 9, 'Buổi 1: Quản lý thu chi cá nhân', 'Lập bảng thu chi và nguyên tắc phân bổ tiền.', '2026-06-22 20:00:00', '2026-06-22 21:30:00', 'https://zoom.us/j/finance-k01-buoi-1', 'FIN001', 'ZOOM', 'SCHEDULED', NULL, NULL),
(25, 10, 9, 'Buổi 2: Đầu tư cơ bản cho người mới', 'Tìm hiểu các kênh đầu tư phổ biến.', '2026-06-25 20:00:00', '2026-06-25 21:30:00', 'https://zoom.us/j/finance-k01-buoi-2', 'FIN002', 'ZOOM', 'SCHEDULED', NULL, NULL),

(26, 11, 10, 'Buổi 1: Xây dựng gian hàng online', 'Tối ưu tên sản phẩm, ảnh và mô tả.', '2026-07-01 20:00:00', '2026-07-01 21:30:00', 'https://meet.google.com/ecom-k01-buoi-1', 'ECOM01', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),
(27, 11, 10, 'Buổi 2: Xử lý đơn hàng và chăm sóc khách', 'Quy trình vận hành đơn hàng và phản hồi khách.', '2026-07-03 20:00:00', '2026-07-03 21:30:00', 'https://meet.google.com/ecom-k01-buoi-2', 'ECOM02', 'GOOGLE_MEET', 'SCHEDULED', NULL, NULL),

(28, 12, 4, 'Buổi 1: Facebook Ads cuối tuần', 'Tư duy quảng cáo và cách chọn mục tiêu.', '2026-07-05 09:00:00', '2026-07-05 11:00:00', 'https://zoom.us/j/ads-k02-buoi-1', 'ADS201', 'ZOOM', 'SCHEDULED', NULL, NULL),
(29, 12, 4, 'Buổi 2: Viết content quảng cáo', 'Thực hành viết nội dung theo từng ngành.', '2026-07-12 09:00:00', '2026-07-12 11:00:00', 'https://zoom.us/j/ads-k02-buoi-2', 'ADS202', 'ZOOM', 'SCHEDULED', NULL, NULL),
(30, 12, 4, 'Buổi 3: Đọc chỉ số và tối ưu ngân sách', 'Phân tích chỉ số quảng cáo và điều chỉnh ngân sách.', '2026-07-19 09:00:00', '2026-07-19 11:00:00', 'https://zoom.us/j/ads-k02-buoi-3', 'ADS203', 'ZOOM', 'SCHEDULED', NULL, NULL);

-- =========================
-- 11. ENROLLMENTS
-- =========================

INSERT INTO enrollments
(enrollment_id, student_id, batch_id, enrolled_at, status, progress_percent)
VALUES
(1, 11, 1, '2026-05-10 08:30:00', 'ACTIVE', 25),
(2, 12, 1, '2026-05-10 09:10:00', 'ACTIVE', 40),
(3, 13, 1, '2026-05-11 10:15:00', 'ACTIVE', 15),
(4, 14, 2, '2026-05-12 14:20:00', 'PENDING', 0),
(5, 15, 2, '2026-05-12 15:25:00', 'ACTIVE', 10),

(6, 16, 3, '2026-05-13 11:00:00', 'ACTIVE', 20),
(7, 17, 3, '2026-05-13 11:30:00', 'ACTIVE', 30),
(8, 18, 3, '2026-05-14 12:00:00', 'PENDING', 0),

(9, 19, 4, '2026-05-14 13:00:00', 'ACTIVE', 35),
(10, 20, 4, '2026-05-14 13:30:00', 'ACTIVE', 45),
(11, 21, 4, '2026-05-15 08:00:00', 'ACTIVE', 10),
(12, 22, 4, '2026-05-15 09:00:00', 'PENDING', 0),

(13, 23, 6, '2026-05-15 10:00:00', 'ACTIVE', 55),
(14, 24, 6, '2026-05-15 10:30:00', 'ACTIVE', 60),
(15, 25, 6, '2026-05-15 11:00:00', 'ACTIVE', 20),

(16, 26, 7, '2026-05-16 08:20:00', 'ACTIVE', 15),
(17, 27, 7, '2026-05-16 09:30:00', 'ACTIVE', 10),
(18, 28, 7, '2026-05-16 10:40:00', 'PENDING', 0),

(19, 29, 8, '2026-05-17 08:00:00', 'ACTIVE', 30),
(20, 30, 8, '2026-05-17 08:30:00', 'CANCELLED', 0),

(21, 11, 4, '2026-05-18 09:00:00', 'ACTIVE', 12),
(22, 12, 6, '2026-05-18 09:10:00', 'ACTIVE', 18),
(23, 13, 7, '2026-05-18 09:20:00', 'ACTIVE', 5),
(24, 14, 8, '2026-05-18 09:30:00', 'ACTIVE', 8),
(25, 15, 9, '2026-05-18 09:40:00', 'ACTIVE', 0),
(26, 16, 10, '2026-05-18 09:50:00', 'ACTIVE', 0),
(27, 17, 12, '2026-05-18 10:00:00', 'PENDING', 0),
(28, 18, 12, '2026-05-18 10:10:00', 'ACTIVE', 0),
(29, 19, 10, '2026-05-18 10:20:00', 'ACTIVE', 0),
(30, 20, 9, '2026-05-18 10:30:00', 'ACTIVE', 0);

-- =========================
-- 12. SESSION ATTENDANCE
-- =========================

INSERT INTO session_attendance
(attendance_id, session_id, student_id, status, joined_at, left_at, duration_minutes, note)
VALUES
(1, 1, 11, 'PRESENT', '2026-06-01 19:58:00', '2026-06-01 21:30:00', 92, 'Vào lớp đúng giờ.'),
(2, 1, 12, 'PRESENT', '2026-06-01 20:02:00', '2026-06-01 21:28:00', 86, NULL),
(3, 1, 13, 'LATE', '2026-06-01 20:18:00', '2026-06-01 21:30:00', 72, 'Vào trễ 18 phút.'),
(4, 1, 15, 'ABSENT', NULL, NULL, 0, 'Vắng không báo trước.'),

(5, 2, 11, 'PRESENT', '2026-06-03 19:59:00', '2026-06-03 21:30:00', 91, NULL),
(6, 2, 12, 'PRESENT', '2026-06-03 20:01:00', '2026-06-03 21:30:00', 89, NULL),
(7, 2, 13, 'PRESENT', '2026-06-03 20:03:00', '2026-06-03 21:25:00', 82, NULL),

(8, 3, 11, 'PRESENT', '2026-06-05 20:00:00', '2026-06-05 21:30:00', 90, NULL),
(9, 3, 12, 'LATE', '2026-06-05 20:20:00', '2026-06-05 21:30:00', 70, 'Có báo trước do kẹt xe.'),
(10, 3, 13, 'PRESENT', '2026-06-05 20:04:00', '2026-06-05 21:30:00', 86, NULL),

(11, 6, 16, 'PRESENT', '2026-06-08 19:55:00', '2026-06-08 22:00:00', 125, NULL),
(12, 6, 17, 'PRESENT', '2026-06-08 20:01:00', '2026-06-08 21:58:00', 117, NULL),
(13, 6, 18, 'ABSENT', NULL, NULL, 0, 'Chưa hoàn tất học phí.'),

(14, 7, 16, 'PRESENT', '2026-06-10 20:00:00', '2026-06-10 22:00:00', 120, NULL),
(15, 7, 17, 'LATE', '2026-06-10 20:15:00', '2026-06-10 22:00:00', 105, NULL),

(16, 9, 19, 'PRESENT', '2026-06-03 19:59:00', '2026-06-03 21:30:00', 91, NULL),
(17, 9, 20, 'PRESENT', '2026-06-03 20:03:00', '2026-06-03 21:28:00', 85, NULL),
(18, 9, 21, 'LATE', '2026-06-03 20:22:00', '2026-06-03 21:30:00', 68, 'Vào muộn buổi đầu.'),
(19, 9, 22, 'ABSENT', NULL, NULL, 0, 'Chưa xác nhận thanh toán.'),

(20, 10, 19, 'PRESENT', '2026-06-05 19:58:00', '2026-06-05 21:30:00', 92, NULL),
(21, 10, 20, 'PRESENT', '2026-06-05 20:00:00', '2026-06-05 21:30:00', 90, NULL),
(22, 10, 21, 'PRESENT', '2026-06-05 20:04:00', '2026-06-05 21:20:00', 76, NULL),

(23, 14, 23, 'PRESENT', '2026-06-05 19:25:00', '2026-06-05 21:00:00', 95, NULL),
(24, 14, 24, 'PRESENT', '2026-06-05 19:30:00', '2026-06-05 21:00:00', 90, NULL),
(25, 14, 25, 'LATE', '2026-06-05 19:50:00', '2026-06-05 21:00:00', 70, NULL),

(26, 17, 26, 'PRESENT', '2026-06-10 19:56:00', '2026-06-10 22:00:00', 124, NULL),
(27, 17, 27, 'PRESENT', '2026-06-10 20:02:00', '2026-06-10 21:55:00', 113, NULL),
(28, 17, 28, 'EXCUSED', NULL, NULL, 0, 'Xin phép nghỉ vì việc gia đình.'),

(29, 20, 29, 'PRESENT', '2026-06-12 19:58:00', '2026-06-12 21:30:00', 92, NULL),
(30, 20, 30, 'ABSENT', NULL, NULL, 0, 'Tài khoản đang bị khóa.'),

(31, 22, 15, 'PRESENT', '2026-06-18 19:28:00', '2026-06-18 21:00:00', 92, NULL),
(32, 22, 20, 'LATE', '2026-06-18 19:45:00', '2026-06-18 21:00:00', 75, NULL),

(33, 24, 16, 'PRESENT', '2026-06-22 19:59:00', '2026-06-22 21:30:00', 91, NULL),
(34, 24, 19, 'PRESENT', '2026-06-22 20:01:00', '2026-06-22 21:30:00', 89, NULL),

(35, 28, 17, 'PRESENT', '2026-07-05 08:58:00', '2026-07-05 11:00:00', 122, NULL),
(36, 28, 18, 'PRESENT', '2026-07-05 09:03:00', '2026-07-05 10:55:00', 112, NULL);

-- =========================
-- 13. LESSON PROGRESS
-- =========================

INSERT INTO lesson_progress
(progress_id, student_id, lesson_id, is_completed, completed_at)
VALUES
(1, 11, 1, TRUE, '2026-06-01 20:30:00'),
(2, 11, 2, TRUE, '2026-06-03 21:00:00'),
(3, 12, 1, TRUE, '2026-06-01 20:35:00'),
(4, 12, 2, TRUE, '2026-06-03 21:10:00'),
(5, 13, 1, TRUE, '2026-06-01 20:40:00'),
(6, 16, 5, TRUE, '2026-06-09 20:30:00'),
(7, 17, 5, TRUE, '2026-06-09 20:35:00'),
(8, 19, 8, TRUE, '2026-06-04 20:20:00'),
(9, 20, 8, TRUE, '2026-06-04 20:25:00'),
(10, 23, 13, TRUE, '2026-06-06 19:30:00');

-- =========================
-- 14. ASSIGNMENTS
-- =========================

INSERT INTO assignments
(assignment_id, batch_id, title, description, due_date, max_score)
VALUES
(1, 1, 'Bài tập tạo trang giới thiệu cá nhân', 'Học viên tạo một trang HTML giới thiệu bản thân.', '2026-06-10 23:59:00', 10),
(2, 3, 'Bài tập React Component', 'Tạo component hiển thị danh sách khóa học.', '2026-06-20 23:59:00', 10),
(3, 4, 'Viết 3 mẫu nội dung quảng cáo', 'Viết nội dung quảng cáo theo công thức PAS.', '2026-06-15 23:59:00', 10),
(4, 6, 'Ghi âm giới thiệu bản thân bằng tiếng Anh', 'Nộp file ghi âm tối đa 2 phút.', '2026-06-18 23:59:00', 10),
(5, 7, 'Tạo báo cáo doanh thu bằng Excel', 'Xử lý dữ liệu và tạo bảng tổng hợp.', '2026-06-22 23:59:00', 10),
(6, 8, 'Thiết kế banner sale', 'Thiết kế một banner bán hàng bằng Canva.', '2026-06-25 23:59:00', 10);

-- =========================
-- 15. ASSIGNMENT SUBMISSIONS
-- =========================

INSERT INTO assignment_submissions
(submission_id, assignment_id, student_id, file_url, content, submitted_at, score, feedback, graded_at, graded_by)
VALUES
(1, 1, 11, '/submissions/student-11-html.zip', 'Em đã hoàn thành trang giới thiệu cá nhân.', '2026-06-09 20:30:00', 8.5, 'Bố cục rõ ràng, cần tối ưu responsive thêm.', '2026-06-10 09:00:00', 3),
(2, 1, 12, '/submissions/student-12-html.zip', 'Bài nộp HTML và CSS cơ bản.', '2026-06-09 21:00:00', 9.0, 'Bài làm tốt, trình bày sạch.', '2026-06-10 09:15:00', 3),
(3, 3, 19, '/submissions/student-19-ads.docx', 'Em gửi 3 mẫu nội dung quảng cáo.', '2026-06-14 22:00:00', 8.0, 'Hook tốt, cần CTA rõ hơn.', '2026-06-15 10:00:00', 4),
(4, 4, 23, '/submissions/student-23-english.mp3', 'File ghi âm giới thiệu bản thân.', '2026-06-17 21:10:00', 8.5, 'Phát âm rõ, cần luyện ngữ điệu tự nhiên hơn.', '2026-06-18 08:30:00', 5);

-- =========================
-- 16. QUIZZES
-- =========================

INSERT INTO quizzes
(quiz_id, batch_id, title, description, duration_minutes, max_score, pass_score, attempt_limit)
VALUES
(1, 1, 'Quiz HTML cơ bản', 'Kiểm tra kiến thức HTML nền tảng.', 20, 10, 5, 2),
(2, 3, 'Quiz ReactJS nền tảng', 'Kiểm tra kiến thức component, props, state.', 25, 10, 6, 2),
(3, 4, 'Quiz Facebook Ads', 'Kiểm tra kiến thức về chiến dịch quảng cáo.', 20, 10, 5, 2),
(4, 6, 'Quiz tiếng Anh công sở', 'Kiểm tra từ vựng và mẫu câu giao tiếp.', 15, 10, 5, 3),
(5, 7, 'Quiz Excel và dữ liệu', 'Kiểm tra hàm Excel và xử lý dữ liệu.', 30, 10, 6, 2),
(6, 8, 'Quiz thiết kế Canva', 'Kiểm tra nguyên tắc bố cục và màu sắc.', 20, 10, 5, 2);

-- =========================
-- 17. QUESTIONS
-- =========================

INSERT INTO questions
(question_id, quiz_id, question_text, question_type, score)
VALUES
(1, 1, 'Thẻ nào dùng để tạo tiêu đề lớn nhất trong HTML?', 'SINGLE_CHOICE', 2),
(2, 1, 'HTML là ngôn ngữ dùng để làm gì?', 'SINGLE_CHOICE', 2),

(3, 2, 'Trong ReactJS, props dùng để làm gì?', 'SINGLE_CHOICE', 2),
(4, 2, 'State trong React có thể thay đổi trong quá trình chạy không?', 'TRUE_FALSE', 2),

(5, 3, 'Mục tiêu chính của quảng cáo chuyển đổi là gì?', 'SINGLE_CHOICE', 2),
(6, 3, 'Hook trong nội dung quảng cáo thường nằm ở đâu?', 'SINGLE_CHOICE', 2),

(7, 4, 'Câu nào phù hợp để giới thiệu bản thân trong môi trường công sở?', 'SINGLE_CHOICE', 2),
(8, 4, 'Meeting nghĩa là gì?', 'SINGLE_CHOICE', 2),

(9, 5, 'Pivot Table trong Excel thường dùng để làm gì?', 'SINGLE_CHOICE', 2),
(10, 5, 'Power BI chủ yếu dùng để làm gì?', 'SINGLE_CHOICE', 2),

(11, 6, 'Trong thiết kế, khoảng trắng giúp ích gì?', 'SINGLE_CHOICE', 2),
(12, 6, 'Canva thường dùng để thiết kế loại nội dung nào?', 'MULTIPLE_CHOICE', 2);

-- =========================
-- 18. ANSWER OPTIONS
-- =========================

INSERT INTO answer_options
(option_id, question_id, option_text, is_correct)
VALUES
(1, 1, 'h1', TRUE),
(2, 1, 'p', FALSE),
(3, 1, 'span', FALSE),
(4, 1, 'div', FALSE),

(5, 2, 'Tạo cấu trúc nội dung cho trang web', TRUE),
(6, 2, 'Thiết kế cơ sở dữ liệu', FALSE),
(7, 2, 'Chạy quảng cáo', FALSE),
(8, 2, 'Gửi email marketing', FALSE),

(9, 3, 'Truyền dữ liệu từ component cha sang component con', TRUE),
(10, 3, 'Lưu mật khẩu người dùng', FALSE),
(11, 3, 'Tạo database', FALSE),
(12, 3, 'Tối ưu quảng cáo', FALSE),

(13, 4, 'Đúng', TRUE),
(14, 4, 'Sai', FALSE),

(15, 5, 'Tạo hành động như mua hàng, đăng ký hoặc nhắn tin', TRUE),
(16, 5, 'Chỉ tăng lượt xem ảnh đại diện', FALSE),
(17, 5, 'Chỉ để làm đẹp fanpage', FALSE),
(18, 5, 'Không cần đo lường kết quả', FALSE),

(19, 6, 'Ở phần mở đầu để kéo sự chú ý', TRUE),
(20, 6, 'Ở cuối bài viết', FALSE),
(21, 6, 'Trong phần thông tin thanh toán', FALSE),
(22, 6, 'Không cần có hook', FALSE),

(23, 7, 'Hello, my name is An. I work in marketing.', TRUE),
(24, 7, 'Goodbye forever.', FALSE),
(25, 7, 'I no understand job.', FALSE),
(26, 7, 'Food very nice.', FALSE),

(27, 8, 'Cuộc họp', TRUE),
(28, 8, 'Hóa đơn', FALSE),
(29, 8, 'Nhà kho', FALSE),
(30, 8, 'Bài hát', FALSE),

(31, 9, 'Tổng hợp và phân tích dữ liệu nhanh', TRUE),
(32, 9, 'Chỉnh sửa video', FALSE),
(33, 9, 'Thiết kế logo', FALSE),
(34, 9, 'Gửi tin nhắn tự động', FALSE),

(35, 10, 'Trực quan hóa dữ liệu và tạo dashboard', TRUE),
(36, 10, 'Thiết kế poster', FALSE),
(37, 10, 'Soạn nhạc', FALSE),
(38, 10, 'Tạo video hoạt hình', FALSE),

(39, 11, 'Giúp thiết kế dễ nhìn và thoáng hơn', TRUE),
(40, 11, 'Làm thiết kế rối hơn', FALSE),
(41, 11, 'Làm mất toàn bộ nội dung', FALSE),
(42, 11, 'Không có tác dụng', FALSE),

(43, 12, 'Banner quảng cáo', TRUE),
(44, 12, 'Bài đăng mạng xã hội', TRUE),
(45, 12, 'Slide thuyết trình', TRUE),
(46, 12, 'Cấu hình server database', FALSE);

-- =========================
-- 19. QUIZ ATTEMPTS
-- =========================

INSERT INTO quiz_attempts
(attempt_id, quiz_id, student_id, started_at, submitted_at, score, status)
VALUES
(1, 1, 11, '2026-06-05 20:00:00', '2026-06-05 20:15:00', 8, 'GRADED'),
(2, 1, 12, '2026-06-05 20:05:00', '2026-06-05 20:18:00', 6, 'GRADED'),
(3, 1, 13, '2026-06-05 20:10:00', NULL, NULL, 'IN_PROGRESS'),
(4, 3, 19, '2026-06-08 21:00:00', '2026-06-08 21:16:00', 9, 'GRADED'),
(5, 3, 20, '2026-06-08 21:05:00', '2026-06-08 21:18:00', 7, 'GRADED'),
(6, 4, 23, '2026-06-10 19:00:00', '2026-06-10 19:12:00', 8, 'GRADED');

-- =========================
-- 20. QUIZ ANSWERS
-- =========================

INSERT INTO quiz_answers
(answer_id, attempt_id, question_id, option_id, essay_answer)
VALUES
(1, 1, 1, 1, NULL),
(2, 1, 2, 5, NULL),
(3, 2, 1, 1, NULL),
(4, 2, 2, 6, NULL),
(5, 4, 5, 15, NULL),
(6, 4, 6, 19, NULL),
(7, 5, 5, 15, NULL),
(8, 5, 6, 20, NULL),
(9, 6, 7, 23, NULL),
(10, 6, 8, 27, NULL);

-- =========================
-- 21. PAYMENTS
-- =========================

INSERT INTO payments
(payment_id, student_id, batch_id, amount, payment_method, payment_status, transaction_code, paid_at)
VALUES
(1, 11, 1, 799000, 'BANK_TRANSFER', 'SUCCESS', 'ELN202605100001', '2026-05-10 08:45:00'),
(2, 12, 1, 799000, 'MOMO', 'SUCCESS', 'ELN202605100002', '2026-05-10 09:20:00'),
(3, 13, 1, 799000, 'VNPAY', 'SUCCESS', 'ELN202605110003', '2026-05-11 10:30:00'),
(4, 14, 2, 799000, 'BANK_TRANSFER', 'PENDING', 'ELN202605120004', NULL),
(5, 15, 2, 799000, 'MOMO', 'SUCCESS', 'ELN202605120005', '2026-05-12 15:40:00'),

(6, 16, 3, 1299000, 'BANK_TRANSFER', 'SUCCESS', 'ELN202605130006', '2026-05-13 11:20:00'),
(7, 17, 3, 1299000, 'VNPAY', 'SUCCESS', 'ELN202605130007', '2026-05-13 11:45:00'),
(8, 18, 3, 1299000, 'MOMO', 'PENDING', 'ELN202605140008', NULL),

(9, 19, 4, 990000, 'BANK_TRANSFER', 'SUCCESS', 'ELN202605140009', '2026-05-14 13:20:00'),
(10, 20, 4, 990000, 'MOMO', 'SUCCESS', 'ELN202605140010', '2026-05-14 13:45:00'),
(11, 21, 4, 990000, 'VNPAY', 'SUCCESS', 'ELN202605150011', '2026-05-15 08:20:00'),
(12, 22, 4, 990000, 'BANK_TRANSFER', 'PENDING', 'ELN202605150012', NULL),

(13, 23, 6, 890000, 'MOMO', 'SUCCESS', 'ELN202605150013', '2026-05-15 10:20:00'),
(14, 24, 6, 890000, 'BANK_TRANSFER', 'SUCCESS', 'ELN202605150014', '2026-05-15 10:45:00'),
(15, 25, 6, 890000, 'VNPAY', 'SUCCESS', 'ELN202605150015', '2026-05-15 11:20:00'),

(16, 26, 7, 1499000, 'BANK_TRANSFER', 'SUCCESS', 'ELN202605160016', '2026-05-16 08:45:00'),
(17, 27, 7, 1499000, 'MOMO', 'SUCCESS', 'ELN202605160017', '2026-05-16 09:45:00'),
(18, 28, 7, 1499000, 'BANK_TRANSFER', 'PENDING', 'ELN202605160018', NULL),

(19, 29, 8, 690000, 'VNPAY', 'SUCCESS', 'ELN202605170019', '2026-05-17 08:15:00'),
(20, 30, 8, 690000, 'MOMO', 'REFUNDED', 'ELN202605170020', '2026-05-17 08:50:00');

-- =========================
-- 22. CERTIFICATES
-- =========================

INSERT INTO certificates
(certificate_id, student_id, batch_id, certificate_code, certificate_url, issued_at)
VALUES
(1, 23, 6, 'CERT-ELN-2026-0001', '/certificates/cert-23-6.pdf', '2026-08-06 09:00:00'),
(2, 24, 6, 'CERT-ELN-2026-0002', '/certificates/cert-24-6.pdf', '2026-08-06 09:05:00'),
(3, 11, 1, 'CERT-ELN-2026-0003', '/certificates/cert-11-1.pdf', '2026-07-11 09:10:00');

-- =========================
-- 23. COURSE REVIEWS
-- =========================

INSERT INTO course_reviews
(review_id, student_id, course_id, rating, comment, created_at)
VALUES
(1, 11, 1, 5, 'Khóa học dễ hiểu, phù hợp với người mới bắt đầu.', '2026-06-12 10:00:00'),
(2, 12, 1, 4, 'Bài giảng rõ ràng, phần bài tập nên có thêm ví dụ.', '2026-06-12 11:00:00'),
(3, 19, 3, 5, 'Nội dung quảng cáo thực chiến, áp dụng được ngay.', '2026-06-14 09:30:00'),
(4, 20, 3, 4, 'Giảng viên giải thích dễ hiểu, nhiều ví dụ thực tế.', '2026-06-14 10:00:00'),
(5, 23, 5, 5, 'Khóa tiếng Anh rất phù hợp cho dân văn phòng.', '2026-06-16 08:30:00'),
(6, 26, 6, 5, 'Power BI học rất thực tế, dashboard dễ làm theo.', '2026-06-18 14:00:00');

-- =========================
-- 24. DISCUSSIONS
-- =========================

INSERT INTO discussions
(discussion_id, batch_id, user_id, title, content, created_at)
VALUES
(1, 1, 11, 'Em chưa hiểu phần Flexbox', 'Thầy cho em hỏi khi nào dùng flex-direction row và column ạ?', '2026-06-04 09:00:00'),
(2, 4, 19, 'Cách chọn mục tiêu quảng cáo', 'Em nên chọn tương tác hay chuyển đổi khi mới chạy quảng cáo?', '2026-06-06 10:15:00'),
(3, 6, 23, 'Luyện nói tiếng Anh mỗi ngày', 'Cô có thể gợi ý cách luyện nói 15 phút mỗi ngày không ạ?', '2026-06-07 08:30:00'),
(4, 7, 26, 'Dữ liệu Power BI bị lỗi định dạng', 'Em import file Excel nhưng ngày tháng bị sai định dạng.', '2026-06-08 14:20:00'),
(5, 8, 29, 'Xin góp ý banner sale', 'Em gửi mẫu banner sale, nhờ cô góp ý thêm về bố cục.', '2026-06-09 16:00:00');

INSERT INTO discussion_comments
(comment_id, discussion_id, user_id, content, created_at)
VALUES
(1, 1, 3, 'Flex-direction row dùng khi muốn các phần tử nằm ngang, column dùng khi muốn xếp dọc nhé em.', '2026-06-04 10:00:00'),
(2, 2, 4, 'Nếu mục tiêu là bán hàng hoặc lấy lead thì nên ưu tiên chuyển đổi hoặc tin nhắn, tùy dữ liệu hiện có.', '2026-06-06 11:00:00'),
(3, 3, 5, 'Em có thể luyện theo 3 bước: nghe mẫu, nhại lại, sau đó tự nói theo tình huống cá nhân.', '2026-06-07 09:00:00'),
(4, 4, 6, 'Em kiểm tra lại định dạng cột ngày trong Excel trước khi import vào Power BI nhé.', '2026-06-08 15:00:00'),
(5, 5, 7, 'Banner ổn rồi, em tăng khoảng trắng quanh tiêu đề và giảm bớt icon phụ là đẹp hơn.', '2026-06-09 17:00:00');

-- =========================
-- 25. NOTIFICATIONS
-- =========================

INSERT INTO notifications
(notification_id, user_id, title, content, is_read, created_at)
VALUES
(1, 11, 'Đăng ký khóa học thành công', 'Bạn đã đăng ký lớp Web căn bản K01 thành công.', FALSE, '2026-05-10 08:50:00'),
(2, 12, 'Thanh toán thành công', 'Hệ thống đã ghi nhận thanh toán khóa học Web căn bản K01.', TRUE, '2026-05-10 09:25:00'),
(3, 3, 'Có học viên mới đăng ký', 'Lớp Web căn bản K01 vừa có học viên mới đăng ký.', FALSE, '2026-05-10 09:30:00'),
(4, 19, 'Nhắc lịch học', 'Lớp Facebook Ads K01 sẽ bắt đầu vào 20:00 ngày 03/06/2026.', FALSE, '2026-06-03 08:00:00'),
(5, 23, 'Bài tập mới', 'Bạn có bài tập mới trong lớp Tiếng Anh công sở K01.', FALSE, '2026-06-06 08:00:00'),
(6, 26, 'Quiz mới được mở', 'Quiz Excel và dữ liệu đã sẵn sàng để làm bài.', FALSE, '2026-06-12 09:00:00'),
(7, 4, 'Lịch dạy mới', 'Bạn có lịch dạy Facebook Ads K02 vào ngày 05/07/2026.', FALSE, '2026-06-20 08:00:00'),
(8, 7, 'Có bài nộp mới', 'Học viên đã nộp bài thiết kế banner sale.', FALSE, '2026-06-25 09:00:00');