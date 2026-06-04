import DiscussionCard from "../components/DiscussionCard";
import Icon from "../components/Icon";

function InteractionPage() {
  return (
    <main className="sp-community-page">
      <section className="sp-community-head">
        <div>
          <p className="sp-eyebrow">Community Hub</p>
          <h1>Advanced Typography & Editorial Design</h1>
          <p>
            Join the conversation. Ask questions, share insights, and connect with
            fellow scholars in this course community.
          </p>
        </div>
        <aside>
          <strong>4.8</strong>
          <span>â˜…â˜…â˜…â˜…â˜†</span>
          <p>1,240 global ratings</p>
          <button type="button">Rate this course</button>
        </aside>
      </section>
      <div className="sp-community-layout">
        <aside className="sp-discussion-nav">
          <button className="active" type="button">
            <Icon name="forum" /> All Discussions
          </button>
          <button type="button">
            <Icon name="help" /> Q&A Only
          </button>
          <button type="button">
            <Icon name="history" /> My Questions
          </button>
          <h3>Lesson Context</h3>
          <p className="active">Module 04: Visual Hierarchy</p>
          <p>Module 03: Color Theory</p>
          <p>Module 05: Grid Systems</p>
        </aside>
        <section className="sp-discussions">
          <div className="sp-discussion-tools">
            <label>
              <Icon name="search" />
              <input placeholder="Search for questions or topics..." />
            </label>
            <button type="button">
              <Icon name="add_comment" /> Post Question
            </button>
          </div>
          <DiscussionCard
            pinned
            author="Julian Aris"
            title="Welcome to the Editorial Scholar Discussion Forum"
            body="Feel free to share your works-in-progress or ask technical questions regarding the baseline grids we discussed in Module 04. I'll be reviewing submissions every Tuesday."
          />
          <DiscussionCard
            author="Marcus Chen"
            title="Struggling with asymmetrical layouts in the final project"
            body="I'm finding it hard to balance white space when I remove the center-aligned containers. Does anyone have tips on maintaining visual weight without using heavy imagery?"
            reply
          />
          <DiscussionCard
            author="Elena Rossi"
            title="Best resources for Manrope font pairings?"
            body="Besides Inter, what are you guys using for sub-headers when Manrope feels too heavy?"
          />
          <button className="sp-load-more" type="button">
            Load older discussions
          </button>
        </section>
      </div>
    </main>
  );
}

export default InteractionPage;
