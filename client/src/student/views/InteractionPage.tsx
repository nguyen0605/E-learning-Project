import DiscussionCard from "../components/DiscussionCard";
import Icon from "../components/Icon";

function InteractionPage() {
  return (
    <main className="sp-community-page">
      <section className="sp-community-head">
        <div>
          <p className="sp-eyebrow">Cộng đồng học tập</p>
          <h1>Thiết kế Biên tập & Nghệ thuật Sắp chữ Nâng cao</h1>
          <p>
            Tham gia thảo luận cùng cộng đồng học viên. Đặt câu hỏi, chia sẻ kinh
            nghiệm và kết nối với những người cùng học trong khóa học này.
          </p>
        </div>

        <aside>
          <strong>4.8</strong>
          <span>★★★★★</span>
          <p>1.240 lượt đánh giá từ học viên</p>
          <button type="button">Đánh giá khóa học</button>
        </aside>
      </section>

      <div className="sp-community-layout">
        <aside className="sp-discussion-nav">
          <button className="active" type="button">
            <Icon name="forum" /> Tất cả thảo luận
          </button>

          <button type="button">
            <Icon name="help" /> Hỏi & Đáp
          </button>

          <button type="button">
            <Icon name="history" /> Câu hỏi của tôi
          </button>

          <h3>Nội dung bài học</h3>

          <p className="active">Chương 04: Phân cấp thị giác</p>
          <p>Chương 03: Lý thuyết màu sắc</p>
          <p>Chương 05: Hệ thống lưới</p>
        </aside>

        <section className="sp-discussions">
          <div className="sp-discussion-tools">
            <label>
              <Icon name="search" />
              <input placeholder="Tìm kiếm câu hỏi hoặc chủ đề..." />
            </label>

            <button type="button">
              <Icon name="add_comment" /> Đặt câu hỏi
            </button>
          </div>

          <DiscussionCard
            pinned
            author="Nguyễn Minh Anh"
            title="Chào mừng bạn đến với diễn đàn thảo luận của khóa học"
            body="Hãy thoải mái chia sẻ bài tập đang thực hiện hoặc đặt câu hỏi liên quan đến hệ thống lưới cơ sở mà chúng ta đã học trong Chương 04. Giảng viên sẽ xem xét và phản hồi các bài đăng vào mỗi thứ Ba hằng tuần."
          />

          <DiscussionCard
            author="Trần Quốc Huy"
            title="Gặp khó khăn với bố cục bất đối xứng trong dự án cuối khóa"
            body="Mình đang gặp khó khăn trong việc cân bằng khoảng trắng khi bỏ bố cục căn giữa. Mọi người có gợi ý nào để duy trì sự cân bằng thị giác mà không cần sử dụng hình ảnh quá nổi bật không?"
            reply
          />

          <DiscussionCard
            author="Lê Khánh Linh"
            title="Có gợi ý nào về các font chữ kết hợp với Manrope không?"
            body="Ngoài Inter, mọi người thường sử dụng font nào cho tiêu đề phụ khi cảm thấy Manrope hơi nặng về mặt thị giác?"
          />

          <button className="sp-load-more" type="button">
            Xem thêm thảo luận cũ
          </button>
        </section>
      </div>
    </main>
  );
}

export default InteractionPage;