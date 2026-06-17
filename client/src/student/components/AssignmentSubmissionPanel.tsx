import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { StatusModalTone } from "../../shared/components/feedback/StatusModal";
import type {
  StudentAssignment,
  StudentAssignmentSubmission,
} from "../types/course.types";
import { submitAssignment } from "../services/studentAssignmentsApi";
import Icon from "./Icon";

type AssignmentSubmissionPanelProps = {
  assignment: StudentAssignment;
  onFeedback: (tone: StatusModalTone, title: string, message: string) => void;
  onSubmitted: (submission: StudentAssignmentSubmission) => void;
};

type SubmissionFormState = {
  note: string;
  githubUrl: string;
  driveUrl: string;
  file: File | null;
};

type FormErrors = Partial<Record<keyof SubmissionFormState | "general", string>>;

function isGithubUrl(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().includes("github.com");
  } catch {
    return false;
  }
}

function isGoogleDriveUrl(url: string) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return hostname.includes("drive.google.com") || hostname.includes("docs.google.com");
  } catch {
    return false;
  }
}

function formatSubmissionDate(value: string) {
  const parsedDate = Date.parse(value);

  if (Number.isNaN(parsedDate)) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function buildInitialState(assignment: StudentAssignment): SubmissionFormState {
  return {
    note: assignment.submission?.note ?? "",
    githubUrl: assignment.submission?.githubUrl ?? "",
    driveUrl: assignment.submission?.driveUrl ?? "",
    file: null,
  };
}

function validateForm(state: SubmissionFormState) {
  const errors: FormErrors = {};
  const note = state.note.trim();
  const githubUrl = state.githubUrl.trim();
  const driveUrl = state.driveUrl.trim();

  if (!state.file && !githubUrl && !driveUrl) {
    errors.general = "Hãy tải file lên hoặc dán ít nhất một link GitHub/Google Drive.";
  }

  if (githubUrl && !isGithubUrl(githubUrl)) {
    errors.githubUrl = "Link GitHub chưa đúng định dạng.";
  }

  if (driveUrl && !isGoogleDriveUrl(driveUrl)) {
    errors.driveUrl = "Link Google Drive chưa đúng định dạng.";
  }

  if (note.length > 2000) {
    errors.note = "Ghi chú tối đa 2000 ký tự.";
  }

  return errors;
}

function AssignmentSubmissionPanel({
  assignment,
  onFeedback,
  onSubmitted,
}: AssignmentSubmissionPanelProps) {
  const [formState, setFormState] = useState<SubmissionFormState>(() =>
    buildInitialState(assignment),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(buildInitialState(assignment));
  }, [assignment]);

  const submissionSummary = useMemo(() => {
    const submission = assignment.submission;

    if (!submission) {
      return null;
    }

    return {
      submittedAt: formatSubmissionDate(submission.submittedAt),
      fileLabel:
        submission.originalFileName ??
        submission.fileUrl?.split("/").pop() ??
        "Tệp đã tải lên",
    };
  }, [assignment.submission]);

  function handleChange(
    key: keyof SubmissionFormState,
    value: string | File | null,
  ) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
      general: undefined,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    handleChange("file", event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(formState);

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      onFeedback(
        "warning",
        "Bài nộp chưa hợp lệ",
        nextErrors.general ??
          nextErrors.githubUrl ??
          nextErrors.driveUrl ??
          nextErrors.note ??
          "Vui lòng kiểm tra lại thông tin bài nộp.",
      );
      return;
    }

    const formData = new FormData();
    formData.set("note", formState.note.trim());
    formData.set("githubUrl", formState.githubUrl.trim());
    formData.set("driveUrl", formState.driveUrl.trim());

    if (formState.file) {
      formData.set("attachment", formState.file);
    }

    setIsSubmitting(true);

    try {
      const submission = await submitAssignment(assignment.id, formData);

      onSubmitted(submission);
      setFormState(buildInitialState({ ...assignment, submission }));
      setErrors({});
      onFeedback(
        "success",
        "Nộp bài thành công",
        "Bài nộp của bạn đã được lưu. Bạn có thể cập nhật lại trước khi giảng viên chấm.",
      );
    } catch (error) {
      onFeedback(
        "error",
        "Không thể nộp bài",
        error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi bài tập.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="sp-assignment-card sp-assignment-submission-card">
      <div className="sp-assignment-card-head">
        <div>
          <h3>{assignment.title}</h3>
          <p>{assignment.description ?? "Giảng viên chưa thêm mô tả cho bài tập này."}</p>
        </div>
        <span>Điểm tối đa: {assignment.maxScore}</span>
      </div>

      {submissionSummary ? (
        <div className="sp-assignment-submission-summary">
          <div>
            <strong>Đã nộp</strong>
            <small>{submissionSummary.submittedAt}</small>
          </div>
          {assignment.submission?.fileUrl ? (
            <a href={assignment.submission.fileUrl} rel="noreferrer" target="_blank">
              <Icon name="attach_file" />
              <span>{submissionSummary.fileLabel}</span>
            </a>
          ) : null}
          {assignment.submission?.githubUrl ? (
            <a href={assignment.submission.githubUrl} rel="noreferrer" target="_blank">
              <Icon name="code" />
              <span>GitHub</span>
            </a>
          ) : null}
          {assignment.submission?.driveUrl ? (
            <a href={assignment.submission.driveUrl} rel="noreferrer" target="_blank">
              <Icon name="cloud" />
              <span>Google Drive</span>
            </a>
          ) : null}
          {assignment.submission?.feedback ? (
            <p className="sp-assignment-feedback">
              <strong>Phản hồi:</strong> {assignment.submission.feedback}
            </p>
          ) : null}
        </div>
      ) : null}

      <form className="sp-assignment-form" onSubmit={handleSubmit}>
        <div className="sp-assignment-field">
          <label htmlFor={`assignment-file-${assignment.id}`}>Tệp bài nộp</label>
          <input
            id={`assignment-file-${assignment.id}`}
            onChange={handleFileChange}
            type="file"
          />
          <small>
            Hỗ trợ tải file trực tiếp. Bạn cũng có thể chỉ nộp link GitHub hoặc Google
            Drive.
          </small>
        </div>

        <div className="sp-assignment-grid">
          <div className="sp-assignment-field">
            <label htmlFor={`assignment-github-${assignment.id}`}>Link GitHub</label>
            <input
              id={`assignment-github-${assignment.id}`}
              onChange={(event) => handleChange("githubUrl", event.target.value)}
              placeholder="https://github.com/..."
              type="url"
              value={formState.githubUrl}
            />
            {errors.githubUrl ? <small className="error">{errors.githubUrl}</small> : null}
          </div>

          <div className="sp-assignment-field">
            <label htmlFor={`assignment-drive-${assignment.id}`}>Link Google Drive</label>
            <input
              id={`assignment-drive-${assignment.id}`}
              onChange={(event) => handleChange("driveUrl", event.target.value)}
              placeholder="https://drive.google.com/..."
              type="url"
              value={formState.driveUrl}
            />
            {errors.driveUrl ? <small className="error">{errors.driveUrl}</small> : null}
          </div>
        </div>

        <div className="sp-assignment-field">
          <label htmlFor={`assignment-note-${assignment.id}`}>Ghi chú cho giảng viên</label>
          <textarea
            id={`assignment-note-${assignment.id}`}
            onChange={(event) => handleChange("note", event.target.value)}
            placeholder="Mô tả ngắn về cách bạn làm bài, tài khoản chạy thử, hoặc điều giảng viên cần lưu ý."
            rows={5}
            value={formState.note}
          />
          {errors.note ? <small className="error">{errors.note}</small> : null}
        </div>

        {errors.general ? <p className="sp-assignment-error">{errors.general}</p> : null}

        <div className="sp-assignment-form-actions">
          <button disabled={isSubmitting} type="submit">
            <Icon name="upload_file" />
            {isSubmitting ? "Đang gửi bài..." : assignment.submission ? "Cập nhật bài nộp" : "Nộp bài"}
          </button>
        </div>
      </form>
    </article>
  );
}

export default AssignmentSubmissionPanel;
