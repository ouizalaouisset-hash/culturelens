// Central book registry — ASINs, Open Library covers, Amazon affiliate links.
const TAG = "culturelens-20";

// Safely appends ?tag= (or &tag=) to any Amazon URL that is missing it.
export function ensureAffiliateTag(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("tag")) u.searchParams.set("tag", TAG);
    return u.toString();
  } catch {
    return url;
  }
}

const RAW = [
  { title: "Atomic Habits",                              author: "James Clear",                         asin: "0735211299" },
  { title: "Deep Work",                                  author: "Cal Newport",                         asin: "1455586692" },
  { title: "Drive",                                      author: "Daniel Pink",                         asin: "1594484805" },
  { title: "The War of Art",                             author: "Steven Pressfield",                   asin: "1936891026" },
  { title: "Getting Things Done",                        author: "David Allen",                         asin: "0143126563" },
  { title: "The Checklist Manifesto",                    author: "Atul Gawande",                        asin: "0312430000" },
  { title: "Extreme Ownership",                          author: "Jocko Willink & Leif Babin",          asin: "1250183863" },
  { title: "The 15 Commitments of Conscious Leadership", author: "Jim Dethmer, Diana Chapman & Kaley Klemp", asin: "0990976904" },
  { title: "The Culture Code",                           author: "Daniel Coyle",                        asin: "0525492461" },
  { title: "Radical Candor",                             author: "Kim Scott",                           asin: "1250235375" },
  { title: "Thinking in Bets",                           author: "Annie Duke",                          asin: "0735216355" },
  { title: "The Lean Startup",                           author: "Eric Ries",                           asin: "0307887898" },
  { title: "Dare to Lead",                               author: "Brené Brown",                         asin: "0399592520" },
  { title: "The Hard Thing About Hard Things",           author: "Ben Horowitz",                        asin: "0062273205" },
  { title: "Mindset",                                    author: "Carol Dweck",                         asin: "0345472322" },
  { title: "The Obstacle Is the Way",                    author: "Ryan Holiday",                        asin: "1591846358" },
  { title: "Essentialism",                               author: "Greg McKeown",                        asin: "0804137382" },
  { title: "Rest",                                       author: "Alex Soojung-Kim Pang",               asin: "1541617169" },
  { title: "The Gifts of Imperfection",                  author: "Brené Brown",                         asin: "1616496193" },
  { title: "The Courage to Be Disliked",                 author: "Ichiro Kishimi & Fumitake Koga",      asin: "1501197274" },
];

export const BOOKS_DB = Object.fromEntries(
  RAW.map(b => [
    b.title.toLowerCase(),
    {
      ...b,
      image: `https://covers.openlibrary.org/b/isbn/${b.asin}-L.jpg`,
      link: ensureAffiliateTag(`https://www.amazon.com/dp/${b.asin}/`),
    },
  ])
);

export function enrichBook(book) {
  if (!book) return null;
  const entry = BOOKS_DB[book.title?.toLowerCase()];
  if (!entry) {
    return {
      ...book,
      image: null,
      link: ensureAffiliateTag(`https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`),
    };
  }
  return { ...book, ...entry };
}
