import Icon from "./Icon";

function CourseContent() {
  return (
    <div className="sp-course-content">
      <h2>
        Nội dung khóa học <span>Hoàn thành 72%</span>
      </h2>

      <div className="sp-chapter">
        <p>Chương 01</p>

        <h3>
          Kiến thức nền tảng về thiết kế <Icon name="expand_more" />
        </h3>

        <span className="done">
          <Icon name="check_circle" /> Lịch sử của hệ thống lưới
          <small>14:20</small>
        </span>

        <span>
          <Icon name="check_circle" /> Tỷ lệ vàng trong thiết kế giao diện số
          <small>08:45</small>
        </span>
      </div>

      <div className="sp-chapter active">
        <p>Chương 02</p>

        <h3>
          Thẩm mỹ trong thiết kế hiện đại <Icon name="expand_less" />
        </h3>

        <span>
          <Icon name="check_circle" /> Làm chủ khoảng trắng trong thiết kế
          <small>12:30</small>
        </span>

        <span className="current">
          <Icon name="play_circle" /> Nguyên tắc thiết kế giao diện hiện đại
          <small>42:00</small>
        </span>

        <span>
          <Icon name="lock" /> Chiến lược bố cục bất đối xứng
          <small>15:10</small>
        </span>
      </div>

      <div className="sp-chapter locked">
        <p>Chương 03</p>

        <h3>
          Thực hiện dự án cuối khóa <Icon name="lock" />
        </h3>
      </div>
    </div>
  );
}

export default CourseContent;