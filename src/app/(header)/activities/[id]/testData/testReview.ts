export interface ReviewUser {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

export interface ReviewItem {
  id: number;
  user: ReviewUser;
  activityId: number;
  rating: number; // 0~5 범위 권장(런타임 검증)
  content: string;
  createdAt: string; // ISO 문자열
  updatedAt: string; // ISO 문자열
}

export interface ReviewResponse {
  averageRating: number;
  totalCount: number;
  reviews: ReviewItem[];
}

export const testReview: ReviewResponse = {
  averageRating: 3.9,
  totalCount: 6,
  reviews: [
    {
      id: 1,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser1",
        id: 1,
      },
      activityId: 6089,
      rating: 3.7,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
    {
      id: 2,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser6",
        id: 2,
      },
      activityId: 6089,
      rating: 4,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
    {
      id: 3,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser3",
        id: 3,
      },
      activityId: 6089,
      rating: 5,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
    {
      id: 4,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser2",
        id: 4,
      },
      activityId: 6089,
      rating: 3.7,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
    {
      id: 5,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser4",
        id: 5,
      },
      activityId: 6089,
      rating: 3.5,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
    {
      id: 6,
      user: {
        profileImageUrl: "/profileImg.png",
        nickname: "testUser5",
        id: 6,
      },
      activityId: 6089,
      rating: 4.5,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      createdAt: "2025-10-17T02:37:53.069Z",
      updatedAt: "2025-10-19T02:37:53.069Z",
    },
  ],
};
