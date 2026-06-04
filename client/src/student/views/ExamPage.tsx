import Icon from "../components/Icon";

const answers = [
  "Increasing personal income tax rates to reduce aggregate demand.",
  "Lowering the discount rate set by the central bank.",
  "Expanding government expenditure on infrastructure projects.",
  "Implementing an open market purchase of treasury securities.",
];

function ExamPage() {
  return (
    <main className="sp-exam-page">
      <section className="sp-exam-head">
        <div>
          <p className="sp-eyebrow">Chương 04: Kinh tế học Nâng cao</p>
          <h1>Bài Kiểm Tra Cuối Kỳ Kinh Tế Vĩ Mô</h1>
        </div>

        <div className="sp-timer">
          <small>Thời gian còn lại</small>
          <strong>24:18</strong>
          <Icon name="timer" />
        </div>
      </section>

      <div className="sp-progress">
        <span>Câu hỏi 08 / 15</span>

        <div>
          <i />
        </div>

        <span>Hoàn thành 53%</span>
      </div>

      <section className="sp-exam-grid">
        <article className="sp-question-card">
          <h2>
            Chính sách tài khóa nào dưới đây có khả năng được sử dụng để kiểm soát
            tình trạng lạm phát cao trong mô hình nền kinh tế đóng?
          </h2>

          {answers.map((answer, index) => (
            <label key={answer} className={index === 0 ? "selected" : ""}>
              <input
                type="radio"
                name="exam-answer"
                defaultChecked={index === 0}
              />

              <span>{String.fromCharCode(65 + index)}</span>

              {answer}

              {index === 0 ? <Icon name="check_circle" /> : null}
            </label>
          ))}

          <div className="sp-question-actions">
            <button type="button">
              <Icon name="chevron_left" /> Câu trước
            </button>

            <button type="button">
              Lưu & Tiếp theo <Icon name="chevron_right" />
            </button>
          </div>
        </article>

        <aside>
          <div className="sp-map">
            <h3>Danh sách câu hỏi</h3>

            {Array.from({ length: 15 }, (_, index) => (
              <button
                className={
                  index < 7 ? "done" : index === 7 ? "current" : ""
                }
                key={index}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="sp-pro-tip">
            <h3>
              <Icon name="emoji_objects" /> Mẹo học tập
            </h3>

            <p>
              Hãy nhớ rằng chính sách tài khóa chỉ liên quan đến chi tiêu công và
              các chính sách thuế của chính phủ.
            </p>
          </div>
        </aside>
      </section>

      <section className="sp-results">
        <p className="sp-eyebrow">Hoàn thành bài kiểm tra</p>

        <h2>Xuất sắc lắm, bé Đạt!</h2>

        <p>
          Bạn đã hoàn thành thành công bài kiểm tra cuối kỳ môn Kinh tế Vĩ mô.
        </p>

        <div className="sp-score-row">
          <article>
            <small>Điểm tổng kết</small>

            <strong>
              92<span>/100</span>
            </strong>

            <p>Thuộc top 5% học viên có kết quả cao nhất.</p>
          </article>

          <article className="blue">
            <small>Thời gian làm bài</small>

            <strong>18:42</strong>

            <p>
              Bạn hoàn thành bài thi nhanh hơn trung bình 6 phút so với các học
              viên khác.
            </p>
          </article>
        </div>

        <div className="sp-breakdown">
          <h3>Chi tiết kết quả</h3>

          <p>
            <Icon name="check_circle" /> Câu 08: Chính sách tài khóa{" "}
            <strong>+6.6 điểm</strong>
          </p>

          <div>
            Giải thích: Tăng thuế là một chính sách tài khóa thắt chặt, giúp giảm
            tốc độ tăng trưởng của nền kinh tế và kiềm chế lạm phát.
          </div>

          <p className="wrong">
            <Icon name="cancel" /> Câu 12: Bẫy thanh khoản{" "}
            <strong>0 điểm</strong>
          </p>

          <div className="wrong">
            Đáp án đúng: D. Chính sách này trở nên kém hiệu quả.
          </div>

          <button type="button">Tải báo cáo kết quả</button>

          <button className="primary" type="button">
            Tiếp tục học tập
          </button>
        </div>
      </section>
    </main>
  );
}

export default ExamPage;