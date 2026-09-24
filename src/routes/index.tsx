import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import sophiaPortrait from "../assets/sophia-clean-portrait.jpg";
import thirdEyeAsset from "../assets/the-third-eye.webp.asset.json";
import matrixTriviaAsset from "../assets/matrix-trivia.jpg.asset.json";
import matrixEvolutionAsset from "../assets/matrix-cracking-the-genetic-code.webp.asset.json";
import motherMatrixAsset from "../assets/mother-of-the-matrix.jpg.asset.json";
import contactPortraitAsset from "../assets/sophia-stewart-contact.jpg.asset.json";
import galaPortraitAsset from "../assets/sophia-stewart-gala.jpg.asset.json";
import galaPosterAsset from "../assets/golden-gala-attendees.jpg.asset.json";
import recognitionBooksAsset from "../assets/recognition-and-books.jpg.asset.json";
import congressionalFolderAsset from "../assets/congressional-recognition-folder.jpg.asset.json";
import congressionalCertificateAsset from "../assets/congressional-recognition-certificate.jpg.asset.json";
import bookCollectionAsset from "../assets/sophia-stewart-books-collection.jpg.asset.json";
import matrixCollageAsset from "../assets/sophia-stewart-matrix-collage.jpg.asset.json";
import luxuryGalaAsset from "../assets/luxury-gala-flyer.jpg.asset.json";
import sophiaVideoAsset from "../assets/sophia-stewart-video.mp4.asset.json";

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
    hook: "Sophia Stewart’s original 1981 manuscript and treatment.",
    image: thirdEyeAsset.url,
  },
  {
    title: "Matrix Trivia",
    hook: "A trivia companion connecting scenes and ideas to The Third Eye.",
    image: matrixTriviaAsset.url,
  },
  {
    title: "Matrix 4: Cracking the Genetic Code",
    hook: "Also known as The Evolution, continuing the world of The Third Eye.",
    image: matrixEvolutionAsset.url,
  },
  {
    title: "Mother of the Matrix",
    hook: "Co-written with Hannibal Zulu, covering the lawsuit and related court filings.",
    image: motherMatrixAsset.url,
  },
];

const sellers = [
  { name: "Amazon", url: (title: string) => `https://www.amazon.com/s?k=${encodeURIComponent(title + " Sophia Stewart")}` },
  { name: "eBay", url: (title: string) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(title + " Sophia Stewart")}` },
  { name: "AbeBooks", url: (title: string) => `https://www.abebooks.com/servlet/SearchResults?kn=${encodeURIComponent(title + " Sophia Stewart")}` },
  { name: "ThriftBooks", url: (title: string) => `https://www.thriftbooks.com/browse/?b.search=${encodeURIComponent(title + " Sophia Stewart")}` },
  { name: "Barnes & Noble", url: (title: string) => `https://www.barnesandnoble.com/s/${encodeURIComponent(title + " Sophia Stewart")}` },
];

const interviews = [
  { label: "Sophia Stewart Interview Playlist", url: "https://www.youtube.com/playlist?list=PL-cC-ldlOk61ULP39M65Nkmv6XqpR0jDL" },
  { label: "Interview I", url: "https://www.youtube.com/watch?v=1redS2eOA5k" },
  { label: "Interview II", url: "https://www.youtube.com/watch?v=2-3hU3vs9K8" },
  { label: "Interview III", url: "https://www.youtube.com/watch?v=NeT7sRdOK9I" },
  { label: "Interview IV", url: "https://www.youtube.com/watch?v=vaazYWt6Mio" },
  { label: "Interview V", url: "https://www.youtube.com/watch?v=YlYej2ePc90" },
  { label: "Interview VI", url: "https://www.youtube.com/watch?v=tjrpMZXPyKY" },
  { label: "Interview VII", url: "https://www.youtube.com/watch?v=GepVD1bxGwY" },
  { label: "Interview VIII", url: "https://www.youtube.com/watch?v=OZnqKn9lHoQ" },
  { label: "Interview IX", url: "https://www.youtube.com/watch?v=5z-nZL-zFPI" },
  { label: "Interview X", url: "https://www.youtube.com/watch?v=FQQVUKQ3oGU" },
  { label: "Interview XI", url: "https://www.youtube.com/watch?v=HuK25xsoPeA" },
  { label: "Interview XII", url: "https://www.youtube.com/watch?v=eg6j5z1rWNU" },
  { label: "Interview XIII", url: "https://www.youtube.com/watch?v=RT4mGNKQtrM" },
  { label: "Interview XIV", url: "https://www.youtube.com/watch?v=WNoZLzXz5kI" },
  { label: "Interview XV", url: "https://www.youtube.com/watch?v=hhKa22fXtt8" },
  { label: "Interview XVI", url: "https://www.youtube.com/watch?v=P1TZN9gPajM" },
  { label: "Interview XVII", url: "https://www.youtube.com/watch?v=EBz1nwiUc0I" },
];

const amazonBooksUrl = `https://www.amazon.com/s?k=${encodeURIComponent("Sophia Stewart books")}`;

const interviewPlaylistUrl = "https://www.youtube.com/playlist?list=PL-cC-ldlOk61ULP39M65Nkmv6XqpR0jDL";

const recognitionImages = [
  { src: galaPortraitAsset.url, alt: "Sophia Stewart at the eZWay Golden Gala" },
  { src: galaPosterAsset.url, alt: "eZWay Golden Gala celebrity attendees announcement featuring Sophia Stewart" },
  { src: recognitionBooksAsset.url, alt: "Sophia Stewart books displayed with a certificate of recognition" },
  { src: congressionalFolderAsset.url, alt: "United States House of Representatives recognition folder" },
  { src: congressionalCertificateAsset.url, alt: "Congressional certificate presented to Sophia Stewart" },
  { src: bookCollectionAsset.url, alt: "Collection of books by Sophia Stewart" },
  { src: matrixCollageAsset.url, alt: "Sophia Stewart and Matrix-themed collage" },
  { src: luxuryGalaAsset.url, alt: "Luxury Gala Academy Award viewing flyer featuring Sophia Stewart" },
];

const navItems = ["Home", "About", "Media", "Books", "Newsletter", "Contact"];
const instagramUrl = "https://www.instagram.com/reels/DUtkk0jkmXf/";

function SophiaStewartPage() {
  const [showAmazonPopup, setShowAmazonPopup] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowAmazonPopup(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="site-shell">
      {showAmazonPopup && (
        <div className="amazon-popup-backdrop" role="presentation" onClick={() => setShowAmazonPopup(false)}>
          <div
            className="amazon-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Sophia Stewart books on Amazon"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="amazon-popup-close"
              aria-label="Close"
              onClick={() => setShowAmazonPopup(false)}
            >
              ×
            </button>
            <p className="section-kicker">Available Now</p>
            <h2>Find Sophia&apos;s books on Amazon</h2>
            <p>Explore The Third Eye, Mother of the Matrix, and more — available on Amazon today.</p>
            <a className="button button-solid" href={amazonBooksUrl} target="_blank" rel="noreferrer">
              Shop on Amazon
            </a>
          </div>
        </div>
      )}
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
          <a href="/fan-club">Fan Club</a>
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
          <img src={sophiaPortrait} alt="Sophia Stewart seated in a warm library setting" />
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
          <p>Explore the original works, companion volume, and documented story behind the creative legacy.</p>
        </div>
        <div className="book-grid">
          {books.map((book) => (
            <article className="book-card" key={book.title}>
              <div className="book-cover">
                <img src={book.image} alt={`${book.title} book cover`} loading="lazy" />
              </div>
              <div className="book-copy">
                <p className="book-eyebrow">By Sophia Stewart</p>
                <h3>{book.title}</h3>
                <p>{book.hook}</p>
                <p className="buy-label">Where to buy</p>
                <div className="buy-links">
                  {sellers.map((seller) => (
                    <a key={seller.name} href={seller.url(book.title)} target="_blank" rel="noreferrer">{seller.name}</a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-photo">
          <img src={sophiaPortrait} alt="Sophia Stewart, author, speaker, and creator" />
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
        <p>Watch Sophia&apos;s interviews and appearances in her own words.</p>
        <a className="button button-outline" href={interviewPlaylistUrl} target="_blank" rel="noreferrer">Watch Playlist</a>
        <div className="interview-grid">
          {interviews.slice(1).map((interview) => (
            <a key={interview.url} className="interview-link" href={interview.url} target="_blank" rel="noreferrer">
              <span className="play-icon" aria-hidden="true">▶</span>
              <span className="interview-number">{interview.label.replace("Interview ", "")}</span>
              <span className="interview-title">Sophia Stewart in conversation</span>
              <span className="interview-watch">Watch</span>
            </a>
          ))}
        </div>
      </section>

      <section className="recognition-section content-section" aria-labelledby="recognition-heading">
        <div className="section-heading">
          <p className="section-kicker">Milestones &amp; Recognition</p>
          <h2 id="recognition-heading">A legacy in pictures.</h2>
          <p>Books, appearances, and recognition from Sophia Stewart&apos;s ongoing public journey.</p>
        </div>
        <div className="recognition-grid">
          {recognitionImages.map((image) => (
            <figure key={image.src}><img src={image.src} alt={image.alt} /></figure>
          ))}
        </div>
        <div className="recognition-video">
          <video src={sophiaVideoAsset.url} controls playsInline preload="metadata" />
        </div>
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

      <section className="contact-section content-section" id="contact">
        <div className="contact-portrait">
          <img src={contactPortraitAsset.url} alt="Portrait of Sophia Stewart" />
        </div>
        <div className="contact-copy">
          <p className="section-kicker">Contact</p>
          <h2>Connect with Sophia.</h2>
          <dl>
            <div><dt>Business</dt><dd>All Eyes On Me, Inc.</dd></div>
            <div><dt>Email</dt><dd><a href="mailto:sophiastewart10@yahoo.com">sophiastewart10@yahoo.com</a></dd></div>
          </dl>
          <div className="contact-socials">
            <a className="button button-outline" href="https://www.facebook.com/SophiaStewartMatrix/" target="_blank" rel="noreferrer">Facebook</a>
            <a className="button button-outline" href="https://www.facebook.com/reel/1408308784081129" target="_blank" rel="noreferrer">Featured Reel</a>
            <a className="button button-outline" href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          </div>
          <p className="contact-note">Contact info to be confirmed and updated.</p>
        </div>
      </section>

      <aside className="rights-notice" aria-label="Rights and legal notice">
        <strong>Rights &amp; Legal Notice</strong>
        <p>All original writings, photographs, artwork, names, and related materials are presented for informational and promotional purposes. Copyrights and trademarks remain with their respective owners. Retail and video links lead to independent third-party services; no affiliation or endorsement is implied.</p>
      </aside>

      <footer>
        <div className="footer-top">
          <a className="brand footer-brand" href="#home">
            <span>Sophia Stewart</span>
            <small>Author <i /> Speaker <i /> Creator</small>
          </a>
          <div className="footer-links">
            {navItems.map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
            <a href="/fan-club">Fan Club</a>
          </div>
          <div className="social-links" aria-label="Social media">
            <a href={interviewPlaylistUrl} target="_blank" rel="noreferrer" aria-label="YouTube">yt</a>
            <a href="https://www.facebook.com/SophiaStewartMatrix/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
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