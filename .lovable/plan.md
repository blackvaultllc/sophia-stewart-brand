# Mother of the Matrix Fan Club

## What I’ll build
- Polish the phone layouts for Interviews and Milestones so each item is easy to scan, open, and read without crowding.
- Replace the Instagram placeholder with Sophia’s supplied Instagram link.
- Add a dedicated Mother of the Matrix Fan Club page, linked prominently from the main site.
- Let fans create an account with email/password or Google, then add their name, photo, and the year they became a fan.
- Add a conversational thread feed with starter topics about Sophia’s books, interviews, creative legacy, and Matrix-related discussion.
- Let signed-in fans create threads, comment, follow other fans, and view fan profiles.
- Hold new fan-created threads and comments for staff approval before they appear publicly.
- Add a private staff moderation page for reviewing and approving or rejecting submissions.

## Experience and safeguards
- Keep the existing black, cream, and warm-gold editorial style.
- Make the fan club phone-first: compact topic cards, readable comments, large tap targets, and no squeezed multi-column sections.
- Clearly label pending submissions so members know they are awaiting review.
- Keep fan roles separate from public profile information, with staff access enforced securely.
- Public visitors can read approved conversations; posting, following, and profile editing require an account.
- Include community rules focused on respectful, positive, on-topic discussion.

## Technical details
- Use Lovable Cloud for accounts, profiles, follows, threads, comments, moderation status, and profile-photo storage.
- Protect each table with row-level access rules; only approved content is publicly readable.
- Use a separate role table and secure server-side role checks for moderation.
- Seed a small set of approved starter threads directly with the schema so the club is useful on first launch.
- Add individual metadata for the fan club, sign-in, profile, and moderation pages.
- Verify the main page and fan club at phone and desktop sizes, including sign-up, posting, pending states, and moderation access.
