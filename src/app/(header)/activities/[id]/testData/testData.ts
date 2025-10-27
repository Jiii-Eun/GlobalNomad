export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImages: {
    id: number;
    imageUrl: string;
  }[];
  schedules: {
    id: number;
    date: string; // "2023-12-01"
    startTime: string; // "12:00"
    endTime: string; // "13:00"
  }[];
  reviewCount: number;
  rating: number;
  createdAt: string; // ISO 형식 문자열
  updatedAt: string; // ISO 형식 문자열
}

export const testData: Activity = {
  id: 7,
  userId: 21,
  title: "함께 배우면 즐거운 스트릿댄스",
  description:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae, eligendi! Doloribus ipsam ducimus quia, iusto magni recusandae consequatur. Velit, ipsum vero omnis consequatur facere maxime quis harum delectus repudiandae quod.",
  category: "투어",
  price: 10000,
  address: "서울특별시 중구 청계천로 100 ",
  bannerImageUrl:
    "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/a.png",
  subImages: [
    {
      id: 1,
      imageUrl:
        "https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com/globalnomad/activity_registration_image/b.png",
    },
  ],
  schedules: [
    {
      id: 1,
      date: "2023-12-01",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 2,
      date: "2023-12-05",
      startTime: "12:00",
      endTime: "13:00",
    },
  ],
  reviewCount: 6,
  rating: 4.74,
  createdAt: "2023-12-31T21:28:50.589Z",
  updatedAt: "2023-12-31T21:28:50.589Z",
};
