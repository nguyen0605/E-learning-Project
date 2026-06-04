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
          <p className="sp-eyebrow">Module 04: Advanced Economics</p>
          <h1>The Macroeconomics Final</h1>
        </div>
        <div className="sp-timer">
          <small>Remaining Time</small>
          <strong>24:18</strong>
          <Icon name="timer" />
        </div>
      </section>
      <div className="sp-progress">
        <span>Question 08 of 15</span>
        <div>
          <i />
        </div>
        <span>53% Complete</span>
      </div>
      <section className="sp-exam-grid">
        <article className="sp-question-card">
          <h2>
            Which of the following fiscal policies would most likely be used to
            combat a period of high inflation in a closed economy model?
          </h2>
          {answers.map((answer, index) => (
            <label key={answer} className={index === 0 ? "selected" : ""}>
              <input type="radio" name="exam-answer" defaultChecked={index === 0} />
              <span>{String.fromCharCode(65 + index)}</span>
              {answer}
              {index === 0 ? <Icon name="check_circle" /> : null}
            </label>
          ))}
          <div className="sp-question-actions">
            <button type="button">
              <Icon name="chevron_left" /> Previous
            </button>
            <button type="button">
              Save & Next <Icon name="chevron_right" />
            </button>
          </div>
        </article>
        <aside>
          <div className="sp-map">
            <h3>Question Map</h3>
            {Array.from({ length: 15 }, (_, index) => (
              <button
                className={index < 7 ? "done" : index === 7 ? "current" : ""}
                key={index}
                type="button"
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="sp-pro-tip">
            <h3>
              <Icon name="emoji_objects" /> Pro-Tip
            </h3>
            <p>Remember that fiscal policy refers strictly to government spending and taxation.</p>
          </div>
        </aside>
      </section>
      <section className="sp-results">
        <p className="sp-eyebrow">Assessment Complete</p>
        <h2>Excellent Work, Alex!</h2>
        <p>You've successfully completed the Macroeconomics Final Exam.</p>
        <div className="sp-score-row">
          <article>
            <small>Overall Score</small>
            <strong>
              92<span>/100</span>
            </strong>
            <p>Top 5% of class</p>
          </article>
          <article className="blue">
            <small>Time Taken</small>
            <strong>18:42</strong>
            <p>You finished 6 minutes faster than the average student.</p>
          </article>
        </div>
        <div className="sp-breakdown">
          <h3>Performance Breakdown</h3>
          <p>
            <Icon name="check_circle" /> Question 08: Fiscal Policy <strong>+6.6 Pts</strong>
          </p>
          <div>
            Expert Explanation: Increasing taxes is a contractionary fiscal policy,
            cooling the economy and slowing inflation.
          </div>
          <p className="wrong">
            <Icon name="cancel" /> Question 12: Liquidity Traps <strong>0 Pts</strong>
          </p>
          <div className="wrong">Correct Answer: D. It becomes ineffective.</div>
          <button type="button">Download Report</button>
          <button className="primary" type="button">
            Continue Learning
          </button>
        </div>
      </section>
    </main>
  );
}

export default ExamPage;
