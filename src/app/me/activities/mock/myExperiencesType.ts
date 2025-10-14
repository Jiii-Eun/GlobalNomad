export type ExperienceStatus = "published" | "draft" | "paused";

export interface ExperienceCard {
  id: number;
  title: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  pricePerPerson: string;
  status: ExperienceStatus;

  location: string;
  capacity: { min: number; max: number };
  categories: string[];
  createdAt: string;
  updatedAt: string;

  reservations: {
    pending: number;
    approved: number;
    cancelled: number;
    completed: number;
  };

  slug: string;
}
