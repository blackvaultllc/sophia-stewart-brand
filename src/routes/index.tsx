import { createFileRoute } from "@tanstack/react-router";
import sophiaHero from "../assets/sophia-stewart-hero.jpg.asset.json";
import sophiaAbout from "../assets/sophia-stewart-about.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sophia Stewart | Author, Speaker & Creator" },
      {
        name: "description",
        content:
          "Discover Sophia Stewart's books, story, media appearances, and creative legacy.",
      },
      { property: "og:title", content: "Sophia Stewart | Author, Speaker & Creator" },
      {
        property: "og:description",
        content:
          "Discover Sophia Stewart's books, story, media appearances, and creative legacy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SophiaStewartPage,
});

const pillars = [
  { icon: "▤", title: "Author", text: "Books that inspire, inform, and leave a lasting impact" },
  { icon: "◉", title: "Speaker", text: "Engaging audiences with real stories and powerful insights" },
  { icon: "▣", title: "Media", text: "Interviews, podcasts, and features from around the world" },
  { icon: "✎", title: "Creator", text: "A creative journey driven by passion, purpose, and vision" },
  { icon: "✉", title: "Stay Connected", text: "Join the newsletter for updates, news, and exclusive content" },
];

const books = [
  {
    title: "The Third Eye",
    eyebrow: "A visionary work",
    hook: "A bold exploration of imagination, authorship, and the power behind an original idea.",
    mark: "III",
  },
  {
    title: "Mother of the Matrix",
    eyebrow: "The story behind the story",
    hook: "The extraordinary creative journey that inspired a cultural phenomenon.",
    mark: "M",
  },
  {
    title: "The Matrix: Evolution",
    eyebrow: "The legacy continues",
    hook: "A deeper look into an evolving universe of ideas, identity, and truth.",
    mark: "E",
  },
];

const navItems = ["Home", "About", "Media", "Books", "Newsletter", "Contact"];

function SophiaStewartPage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Sophia Stewart home">
          <span>Sophia Stewart</span>
          <small>Author <i /> Speaker <i /> Creator</small>
        </a>
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} className={item === "Home" ? "active" : ""} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="section-kicker">Author · Speaker · Creator</p>
          <h1>
            The Story
            <br />
            The Journey
            <br />
            <em>The Legacy</em>
          </h1>
          <div className="gold-rule" />
          <p className="hero-description">
            Author. Creator. Visionary. Explore Sophia Stewart&apos;s remarkable journey, her books,
            media appearances, and the legacy she continues to build.
          </p>
          <div className="hero-actions">
            <a className="button button-solid" href="#about">Learn More</a>
            <a className="button button-outline" href="#media">Watch Interviews</a>
          </div>
        </div>
        <div className="hero-photo">
          <img src={sophiaHero.url} alt="Sophia Stewart seated in a warm library setting" />
        </div>
      </section>

      <section className="pillar-band" aria-label="Sophia Stewart's work">
        {pillars.map((pillar) => (
          <article className="pillar" key={pillar.title}>
            <div className="pillar-icon" aria-hidden="true">{pillar.icon}</div>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <blockquote className="quote-band">
        <p>“Every story has power. Every voice has purpose. Every legacy begins with truth.”</p>
        <cite>— Sophia Stewart</cite>
      </blockquote>

      <section className="books-section content-section" id="books">
        <div className="section-heading">
          <p className="section-kicker">Written Legacy</p>
          <h2>Books by Sophia Stewart</h2>
          <p>Original works shaped by vision, conviction, and an uncompromising creative voice.</p>
        </div>
        <div className="book-grid">
          {books.map((book, index) => (
            <article className="book-card" key={book.title}>
              <div className={`book-cover book-cover-${index + 1}`}>
                <span className="cover-mark">{book.mark}</span>
                <small>Sophia Stewart</small>
                <strong>{book.title}</strong>
              </div>
              <div className="book-copy">
                <p className="book-eyebrow">{book.eyebrow}</p>
                <h3>{book.title}</h3>
                <p>{book.hook}</p>
                <a className="text-link" href="#contact">View Book <span aria-hidden="true">→</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-photo">
          <img src={sophiaAbout.url} alt="Sophia Stewart, author, speaker, and creator" />
        </div>
        <div className="about-copy">
          <p className="section-kicker">The Woman Behind the Work</p>
          <h2>A voice. A vision. A legacy.</h2>
          <p className="lead">
            Sophia Stewart is an author, creator, and speaker whose fearless imagination has
            inspired conversations about originality, ownership, and creative truth.
          </p>
          <p>
            Her journey is one of resilience and purpose—a testament to standing by your work,
            telling your story, and protecting the ideas that shape culture.
          </p>
          <a className="text-link" href="#contact">Read Full Story <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="media-section content-section" id="media">
        <div>
          <p className="section-kicker">In Conversation</p>
          <h2>Ideas that deserve to be heard.</h2>
        </div>
        <p>Explore interviews, podcasts, and appearances featuring Sophia&apos;s story in her own words.</p>
        <a className="button button-outline" href="#contact">View Media</a>
      </section>

      <section className="newsletter-section" id="newsletter">
        <div>
          <p className="section-kicker">Stay Connected</p>
          <h2>Join Sophia&apos;s inner circle.</h2>
          <p>Receive updates on new books, appearances, interviews, and exclusive stories.</p>
        </div>
        <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="Enter your email address" required />
          <button className="button button-solid" type="submit">Subscribe</button>
        </form>
      </section>

      <footer id="contact">
        <div className="footer-top">
          <a className="brand footer-brand" href="#home">
            <span>Sophia Stewart</span>
            <small>Author <i /> Speaker <i /> Creator</small>
          </a>
          <div className="footer-links">
            {navItems.map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
          </div>
          <div className="social-links" aria-label="Social media">
            <a href="#contact" aria-label="Instagram">ig</a>
            <a href="#contact" aria-label="YouTube">yt</a>
            <a href="#contact" aria-label="Facebook">f</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Sophia Stewart. All rights reserved.</span>
          <span>Author · Speaker · Creator</span>
        </div>
      </footer>
    </main>
  );
}