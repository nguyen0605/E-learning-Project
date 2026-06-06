export type InstructorNavKey =
  | "dashboard"
  | "courses"
  | "quizzes"
  | "students"
  | "interaction"
  | "analytics";

export const instructorProfile = {
  name: "Thầy Minh Anh",
  role: "Giảng viên chính",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
};

export const instructorNavItems: {
  key: InstructorNavKey;
  label: string;
  icon: string;
  path: string;
}[] = [
  { key: "dashboard", label: "Tổng quan", icon: "dashboard", path: "/instructor" },
  {
    key: "courses",
    label: "Quản lý khóa học",
    icon: "library_books",
    path: "/instructor/courses",
  },
  {
    key: "quizzes",
    label: "Bài kiểm tra",
    icon: "quiz",
    path: "/instructor/quizzes",
  },
  { key: "students", label: "Học viên", icon: "group", path: "/instructor/students" },
  {
    key: "interaction",
    label: "Tương tác",
    icon: "forum",
    path: "/instructor/interaction",
  },
  {
    key: "analytics",
    label: "Phân tích",
    icon: "analytics",
    path: "/instructor/analytics",
  },
];

export const dashboardStats = [
  {
    label: "Khóa học đang dạy",
    value: "8",
    change: "+2 trong tháng này",
    icon: "menu_book",
    tone: "blue",
  },
  {
    label: "Tổng học viên",
    value: "426",
    change: "+18.4% tăng trưởng",
    icon: "groups",
    tone: "slate",
  },
  {
    label: "Hoàn thành TB",
    value: "78%",
    change: "+6.2% cải thiện",
    icon: "trending_up",
    tone: "green",
  },
  {
    label: "Cần chấm điểm",
    value: "23",
    change: "Cần xử lý",
    icon: "rate_review",
    tone: "amber",
  },
];

export const teachingSchedule = [
  {
    time: "09:00",
    title: "Workshop ReactJS thực chiến",
    batch: "FE-React-02",
    mode: "Google Meet",
    status: "Sắp diễn ra",
  },
  {
    time: "13:30",
    title: "Cố vấn Web căn bản",
    batch: "WEB-BASIC-01",
    mode: "Zoom",
    status: "Đã lên lịch",
  },
  {
    time: "19:00",
    title: "Phân tích tình huống tài chính cá nhân",
    batch: "FIN-01",
    mode: "Phòng nội bộ",
    status: "Đã lên lịch",
  },
];

export const coursePerformance = [
  {
    title: "ReactJS thực chiến cho người mới",
    category: "Lập trình",
    students: 128,
    completion: 84,
    rating: 4.9,
    revenue: "168 triệu",
    status: "Đã duyệt",
  },
  {
    title: "Nền tảng Web với HTML, CSS, JS",
    category: "Lập trình",
    students: 96,
    completion: 72,
    rating: 4.7,
    revenue: "102 triệu",
    status: "Đã duyệt",
  },
  {
    title: "Tài chính cá nhân cho người trẻ",
    category: "Kinh doanh",
    students: 64,
    completion: 61,
    rating: 4.8,
    revenue: "73 triệu",
    status: "Chờ duyệt",
  },
];

export const courseManagementStats = [
  { label: "Khóa học đã xuất bản", value: "6", icon: "verified", tone: "blue" },
  { label: "Bài học nháp", value: "14", icon: "edit_note", tone: "slate" },
  { label: "Lớp đang mở", value: "5", icon: "event_available", tone: "green" },
  { label: "Chờ duyệt", value: "2", icon: "hourglass_top", tone: "amber" },
];

export const instructorCourses = [
  {
    title: "ReactJS thực chiến cho người mới",
    category: "Lập trình",
    level: "Trung cấp",
    status: "Đã xuất bản",
    students: 128,
    modules: 8,
    lessons: 36,
    completion: 84,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Nền tảng Web với HTML, CSS, JS",
    category: "Lập trình",
    level: "Cơ bản",
    status: "Đã xuất bản",
    students: 96,
    modules: 6,
    lessons: 28,
    completion: 72,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Tài chính cá nhân cho người trẻ",
    category: "Kinh doanh",
    level: "Cơ bản",
    status: "Chờ duyệt",
    students: 64,
    modules: 5,
    lessons: 22,
    completion: 61,
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
  },
];

export const courseBatches = [
  {
    code: "FE-React-02",
    course: "ReactJS thực chiến",
    dates: "12/06 - 24/08",
    students: "42 / 50",
    mode: "Trực tuyến",
    status: "Đang học",
  },
  {
    code: "WEB-BASIC-01",
    course: "Nền tảng Web",
    dates: "20/06 - 06/09",
    students: "38 / 45",
    mode: "Kết hợp",
    status: "Đang mở",
  },
  {
    code: "FIN-01",
    course: "Tài chính cá nhân",
    dates: "02/07 - 18/08",
    students: "24 / 35",
    mode: "Trực tuyến",
    status: "Đang mở",
  },
];

export const lessonPlanner = [
  {
    module: "Chương 01",
    title: "Nền tảng React",
    lessons: 6,
    duration: "4 giờ 20 phút",
    state: "Đã xuất bản",
  },
  {
    module: "Chương 02",
    title: "Component và Props",
    lessons: 5,
    duration: "3 giờ 45 phút",
    state: "Đã xuất bản",
  },
  {
    module: "Chương 03",
    title: "State, Effect và luồng dữ liệu",
    lessons: 7,
    duration: "5 giờ 10 phút",
    state: "Bản nháp",
  },
];

export const studentSignals = [
  {
    name: "Nguyễn Bảo Trâm",
    course: "ReactJS thực chiến",
    progress: 92,
    note: "Sẵn sàng duyệt dự án cuối khóa",
  },
  {
    name: "Lê Quang Huy",
    course: "Nền tảng Web",
    progress: 48,
    note: "Vắng hai buổi học trực tuyến",
  },
  {
    name: "Phạm Minh Khoa",
    course: "Tài chính cá nhân",
    progress: 76,
    note: "Nộp bài tập muộn",
  },
];

export const studentManagementStats = [
  { label: "Học viên ghi danh", value: "426", icon: "groups", tone: "blue" },
  { label: "Hoạt động tuần này", value: "312", icon: "bolt", tone: "green" },
  { label: "Có rủi ro", value: "18", icon: "warning", tone: "amber" },
  { label: "Đã hoàn thành", value: "74", icon: "workspace_premium", tone: "slate" },
];

export const instructorStudents = [
  {
    name: "Nguyễn Bảo Trâm",
    email: "tram.nguyen@student.vn",
    course: "ReactJS thực chiến",
    batch: "FE-React-02",
    progress: 92,
    attendance: 96,
    lastActive: "Hôm nay",
    status: "Xuất sắc",
  },
  {
    name: "Lê Quang Huy",
    email: "huy.le@student.vn",
    course: "Nền tảng Web",
    batch: "WEB-BASIC-01",
    progress: 48,
    attendance: 62,
    lastActive: "3 ngày trước",
    status: "Có rủi ro",
  },
  {
    name: "Phạm Minh Khoa",
    email: "khoa.pham@student.vn",
    course: "Tài chính cá nhân",
    batch: "FIN-01",
    progress: 76,
    attendance: 88,
    lastActive: "Hôm qua",
    status: "Đúng tiến độ",
  },
  {
    name: "Trần Gia Hân",
    email: "han.tran@student.vn",
    course: "ReactJS thực chiến",
    batch: "FE-React-02",
    progress: 69,
    attendance: 74,
    lastActive: "Hôm nay",
    status: "Cần xem xét",
  },
  {
    name: "Đoàn Thanh Nam",
    email: "nam.doan@student.vn",
    course: "Nền tảng Web",
    batch: "WEB-BASIC-01",
    progress: 83,
    attendance: 91,
    lastActive: "Hôm nay",
    status: "Đúng tiến độ",
  },
];

export const studentAttentionQueue = [
  {
    name: "Lê Quang Huy",
    reason: "Tiến độ dưới 50% và đã vắng hai buổi học.",
    action: "Gửi ghi chú cố vấn",
    priority: "Cao",
  },
  {
    name: "Trần Gia Hân",
    reason: "Bài tập của chương hiện tại đang nộp muộn.",
    action: "Xem yêu cầu gia hạn",
    priority: "Trung bình",
  },
  {
    name: "Phạm Minh Khoa",
    reason: "Điểm bài kiểm tra dưới ngưỡng đạt nhưng chuyên cần vẫn tốt.",
    action: "Giao bài kiểm tra luyện tập",
    priority: "Trung bình",
  },
];

export const cohortFilters = [
  "Tất cả lớp",
  "FE-React-02",
  "WEB-BASIC-01",
  "FIN-01",
];

export const quizManagementStats = [
  { label: "Bài đã xuất bản", value: "12", icon: "quiz", tone: "blue" },
  { label: "Ngân hàng câu hỏi", value: "248", icon: "help", tone: "slate" },
  { label: "Tỷ lệ đạt TB", value: "82%", icon: "fact_check", tone: "green" },
  { label: "Cần chấm", value: "17", icon: "grading", tone: "amber" },
];

export const instructorQuizzes = [
  {
    title: "Kiểm tra Component React",
    course: "ReactJS thực chiến",
    batch: "FE-React-02",
    questions: 24,
    duration: "45 phút",
    attempts: 118,
    passRate: 86,
    status: "Đã xuất bản",
  },
  {
    title: "Kiểm tra nền tảng HTML & CSS",
    course: "Nền tảng Web",
    batch: "WEB-BASIC-01",
    questions: 32,
    duration: "60 phút",
    attempts: 84,
    passRate: 78,
    status: "Đã xuất bản",
  },
  {
    title: "Bài luận tình huống tài chính",
    course: "Tài chính cá nhân",
    batch: "FIN-01",
    questions: 8,
    duration: "40 phút",
    attempts: 36,
    passRate: 69,
    status: "Bản nháp",
  },
];

export const quizQuestionBank = [
  {
    topic: "Quản lý State trong React",
    type: "Nhiều lựa chọn",
    count: 56,
    difficulty: "Trung cấp",
  },
  {
    topic: "HTML ngữ nghĩa",
    type: "Một lựa chọn",
    count: 42,
    difficulty: "Cơ bản",
  },
  {
    topic: "Lập kế hoạch ngân sách",
    type: "Tự luận",
    count: 18,
    difficulty: "Cơ bản",
  },
];

export const gradingQueue = [
  {
    student: "Trần Gia Hân",
    quiz: "Bài luận tình huống tài chính",
    submitted: "2 giờ trước",
    score: "Chờ chấm",
  },
  {
    student: "Phạm Minh Khoa",
    quiz: "Kiểm tra Component React",
    submitted: "Hôm qua",
    score: "Cần xem lại",
  },
  {
    student: "Lê Quang Huy",
    quiz: "Kiểm tra nền tảng HTML & CSS",
    submitted: "Hôm qua",
    score: "Chờ chấm",
  },
];

export const interactionStats = [
  { label: "Chủ đề đang mở", value: "34", icon: "forum", tone: "blue" },
  { label: "Tin chưa đọc", value: "19", icon: "mark_chat_unread", tone: "amber" },
  { label: "Đã xử lý hôm nay", value: "11", icon: "task_alt", tone: "green" },
  { label: "Thông báo", value: "7", icon: "campaign", tone: "slate" },
];

export const discussionThreads = [
  {
    title: "Làm rõ cleanup trong useEffect ở chương dự án",
    course: "ReactJS thực chiến",
    batch: "FE-React-02",
    replies: 14,
    lastActivity: "12 phút trước",
    status: "Cần phản hồi",
  },
  {
    title: "Bài tập 02 có thể dùng Flexbox thay CSS Grid không?",
    course: "Nền tảng Web",
    batch: "WEB-BASIC-01",
    replies: 9,
    lastActivity: "38 phút trước",
    status: "Đang thảo luận",
  },
  {
    title: "Xin ví dụ cho bảng kế hoạch ngân sách",
    course: "Tài chính cá nhân",
    batch: "FIN-01",
    replies: 6,
    lastActivity: "2 giờ trước",
    status: "Đã trả lời",
  },
];

export const directMessages = [
  {
    student: "Lê Quang Huy",
    preview: "Em vắng buổi học trước. Thầy cho em xin bản ghi được không ạ?",
    time: "08:42",
    priority: "Cao",
  },
  {
    student: "Nguyễn Bảo Trâm",
    preview: "Thầy xem giúp em đề cương dự án cuối khóa trước thứ Sáu được không ạ?",
    time: "10:15",
    priority: "Trung bình",
  },
  {
    student: "Trần Gia Hân",
    preview: "Em đã nộp bài muộn và có đính kèm ghi chú giải thích.",
    time: "Hôm qua",
    priority: "Trung bình",
  },
];

export const announcementDrafts = [
  {
    title: "Buổi học trực tuyến chuyển sang tối thứ Sáu",
    target: "FE-React-02",
    state: "Bản nháp",
  },
  {
    title: "Đã đăng rubric và ví dụ cho bài tập 03",
    target: "WEB-BASIC-01",
    state: "Đã lên lịch",
  },
  {
    title: "Thời hạn nhận phản hồi bảng tài chính",
    target: "FIN-01",
    state: "Đã xuất bản",
  },
];

export const analyticsStats = [
  { label: "Giờ giảng dạy", value: "146", icon: "schedule", tone: "blue" },
  { label: "Tỷ lệ hoàn thành", value: "78%", icon: "trending_up", tone: "green" },
  { label: "Điểm kiểm tra TB", value: "8.2", icon: "score", tone: "slate" },
  { label: "Tín hiệu rủi ro", value: "18", icon: "crisis_alert", tone: "amber" },
];

export const engagementTrend = [
  { label: "T1", value: 46 },
  { label: "T2", value: 58 },
  { label: "T3", value: 52 },
  { label: "T4", value: 74 },
  { label: "T5", value: 81 },
  { label: "T6", value: 88 },
];

export const courseInsights = [
  {
    title: "ReactJS thực chiến",
    completion: 84,
    quizAverage: 8.7,
    attendance: 91,
    trend: "+12%",
  },
  {
    title: "Nền tảng Web",
    completion: 72,
    quizAverage: 7.9,
    attendance: 84,
    trend: "+6%",
  },
  {
    title: "Tài chính cá nhân",
    completion: 61,
    quizAverage: 7.4,
    attendance: 79,
    trend: "-3%",
  },
];

export const learnerSegments = [
  { label: "Xuất sắc", value: 34, tone: "blue" },
  { label: "Đúng tiến độ", value: 48, tone: "green" },
  { label: "Cần xem xét", value: 12, tone: "amber" },
  { label: "Có rủi ro", value: 6, tone: "red" },
];

export const analyticsRecommendations = [
  {
    title: "Rà soát Chương 03 trong ReactJS thực chiến",
    detail: "Tỷ lệ rời bài tăng sau bài đầu tiên về quản lý state.",
    impact: "Cao",
  },
  {
    title: "Thêm một buổi ôn tập cho Nền tảng Web",
    detail: "Chuyên cần ổn định nhưng điểm kiểm tra giảm ở phần bố cục.",
    impact: "Trung bình",
  },
  {
    title: "Đăng ví dụ cho bảng kế hoạch tài chính",
    detail: "Câu trả lời tự luận cho thấy học viên còn lúng túng ở nhóm ngân sách.",
    impact: "Trung bình",
  },
];

export const analyticsBars = [
  { label: "T2", value: 54 },
  { label: "T3", value: 68 },
  { label: "T4", value: 42 },
  { label: "T5", value: 86 },
  { label: "T6", value: 74 },
  { label: "T7", value: 92 },
  { label: "CN", value: 63 },
];
