type GoogleReview = {
  id?: string;
  rating?: number;
  text?: string;
  relativeTime?: string;
  googleMapsUri?: string;
  author?: {
    name?: string;
    photoUri?: string;
  };
};

let cachedReviews: GoogleReview[] | null = null;
let reviewsRequest: Promise<GoogleReview[]> | null = null;

async function loadGoogleReviews(): Promise<GoogleReview[]> {
  if (cachedReviews) return cachedReviews;
  if (reviewsRequest) return reviewsRequest;

  reviewsRequest = fetch("/api/google-reviews", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Google reviews unavailable");
      const data = await response.json();
      const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
      cachedReviews = reviews.filter((review: GoogleReview) => review && (review.text || review.author?.name));
      return cachedReviews;
    })
    .catch(() => {
      cachedReviews = [];
      return cachedReviews;
    })
    .finally(() => {
      reviewsRequest = null;
    });

  return reviewsRequest;
}

function createStars(rating = 5) {
  const stars = document.createElement("div");
  stars.className = "home-review-carousel__stars";
  stars.setAttribute("aria-label", `${Math.max(1, Math.min(5, Math.round(rating)))} na 5 gwiazdek`);

  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  for (let index = 0; index < 5; index += 1) {
    const star = document.createElement("span");
    star.textContent = "★";
    if (index >= rounded) star.classList.add("is-empty");
    stars.appendChild(star);
  }

  return stars;
}

function createReviewCard(review: GoogleReview, duplicate = false) {
  const card = document.createElement("article");
  card.className = "home-review-carousel__card";
  if (duplicate) card.setAttribute("aria-hidden", "true");

  card.appendChild(createStars(review.rating));

  const text = document.createElement("p");
  text.textContent = `“${review.text || "Profesjonalna obsługa i bardzo dobry kontakt."}”`;
  card.appendChild(text);

  const author = document.createElement("div");
  author.className = "home-review-carousel__author";

  const avatar = document.createElement("div");
  avatar.className = "home-review-carousel__avatar";
  if (review.author?.photoUri) {
    const image = document.createElement("img");
    image.src = review.author.photoUri;
    image.alt = "";
    image.loading = "lazy";
    avatar.appendChild(image);
  } else {
    const initial = document.createElement("span");
    initial.textContent = (review.author?.name || "K").slice(0, 1).toUpperCase();
    avatar.appendChild(initial);
  }

  const authorText = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = review.author?.name || "Klient Google";
  authorText.appendChild(name);

  if (review.relativeTime) {
    const time = document.createElement("small");
    time.textContent = review.relativeTime;
    authorText.appendChild(time);
  }

  author.append(avatar, authorText);
  card.appendChild(author);

  return card;
}

function mountCarousel(originalGrid: HTMLElement, reviews: GoogleReview[]) {
  const parent = originalGrid.parentElement;
  if (!parent || !reviews.length) return;

  originalGrid.classList.add("home-review-grid--legacy");

  let carousel = parent.querySelector<HTMLElement>(".home-review-carousel-enhanced");
  if (carousel) return;

  carousel = document.createElement("div");
  carousel.className = "home-review-carousel-enhanced";
  carousel.setAttribute("role", "region");
  carousel.setAttribute("aria-label", "Opinie klientów Google");

  const track = document.createElement("div");
  track.className = "home-review-carousel__track";

  reviews.forEach((review) => track.appendChild(createReviewCard(review)));
  if (reviews.length > 1) {
    reviews.forEach((review) => track.appendChild(createReviewCard(review, true)));
    carousel.classList.add("is-animated");
  }

  carousel.appendChild(track);
  originalGrid.insertAdjacentElement("afterend", carousel);
}

export function ensureHomepageGoogleReviewsCarousel() {
  if (window.location.pathname !== "/nowa-strona") return;

  const grid = document.querySelector<HTMLElement>(".home-page .home-review-grid");
  if (!grid) return;

  if (cachedReviews?.length) {
    mountCarousel(grid, cachedReviews);
    return;
  }

  void loadGoogleReviews().then((reviews) => {
    const currentGrid = document.querySelector<HTMLElement>(".home-page .home-review-grid");
    if (!currentGrid || window.location.pathname !== "/nowa-strona") return;
    mountCarousel(currentGrid, reviews);
  });
}
