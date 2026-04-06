export type BlogSection = {
  heading: string;
  body: string[];
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: "Tin tức" | "Tập luyện" | "Dinh dưỡng" | "Phục hồi";
  cover: string;
  author: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
  featured?: boolean;
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "5-loi-sai-khi-tap-ta-nguoi-moi",
    title: "5 lỗi sai khi tập tạ mà người mới hay gặp",
    excerpt:
      "Sai nhịp, chọn tạ quá nặng và bỏ qua khởi động là ba lỗi khiến tiến độ chậm hơn rất nhiều trong 4 tuần đầu.",
    category: "Tập luyện",
    cover:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=80",
    author: "Admin Coach Huy",
    readTime: "8 phút đọc",
    publishedAt: "18/03/2026",
    tags: ["người mới", "tập tạ", "form"],
    featured: true,
    sections: [
      {
        heading: "Chọn mức tạ không phù hợp",
        body: [
          "Rất nhiều người mới có xu hướng chọn mức tạ quá nặng ngay từ buổi đầu để tạo cảm giác tập hiệu quả. Cách này dễ làm hỏng form và tăng nguy cơ đau khớp.",
          "Khi mức tạ quá nặng, bạn có thể vẫn hoàn thành số rep nhưng phải rút ngắn biên độ, giật tạ hoặc sai chuyển động. Khi đó bài tập không còn đúng mục tiêu.",
          "Hãy chọn mức tạ giúp bạn kiểm soát tốt, giữ đúng kỹ thuật và vẫn còn 1–2 rep dự trữ ở set cuối. Đây là nền tảng để tiến bộ lâu dài.",
        ],
      },
      {
        heading: "Bỏ qua khởi động",
        body: [
          "Khởi động không chỉ để làm nóng người mà còn giúp khớp vai, hông, gối vào đúng vị trí trước khi tập nặng.",
          "Các bài như squat, press, row nên có 1–3 set khởi động để cơ thể làm quen.",
          "Bỏ qua phần này dễ dẫn đến chấn thương và tập không ổn định.",
        ],
      },
      {
        heading: "Tập nhanh hơn tập đúng",
        body: [
          "Tập quá nhanh khiến bạn không cảm nhận được cơ. Hãy giữ nhịp 2 giây hạ tạ, 1 giây đẩy tạ.",
          "Kỹ thuật luôn quan trọng hơn tốc độ, đặc biệt với người mới.",
        ],
      },
      {
        heading: "Không ghi lại lịch tập",
        body: [
          "Không ghi chép sẽ khiến bạn không biết mình có tiến bộ hay không.",
          "Chỉ cần ghi lại mức tạ, số rep và cảm giác sau buổi tập là đủ.",
        ],
      },
      {
        heading: "Đổi bài liên tục",
        body: [
          "Thay đổi bài tập quá thường xuyên khiến bạn không kịp thích nghi.",
          "Hãy giữ 3–5 bài chính ổn định và chỉ thay đổi bài phụ.",
        ],
      },
    ],
  },

  {
    id: 2,
    slug: "setup-goc-gym-tai-nha-10m2",
    title: "Setup góc gym tại nhà trong không gian 10m²",
    excerpt:
      "Một bộ dụng cụ gọn nhưng hiệu quả sẽ tốt hơn việc mua quá nhiều ngay từ đầu.",
    category: "Tin tức",
    cover:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=80",
    author: "Admin Content Team",
    readTime: "7 phút đọc",
    publishedAt: "16/03/2026",
    tags: ["gym tại nhà", "setup", "dụng cụ"],
    sections: [
      {
        heading: "Bắt đầu đơn giản",
        body: [
          "Ghế tập, tạ điều chỉnh, dây kháng lực và thảm là đủ cho hầu hết bài tập.",
          "Không cần mua quá nhiều khi mới bắt đầu.",
        ],
      },
      {
        heading: "Không gian và sàn tập",
        body: [
          "Đảm bảo đủ chỗ di chuyển và sàn không trơn trượt.",
          "Điều này ảnh hưởng trực tiếp đến trải nghiệm tập.",
        ],
      },
      {
        heading: "Sắp xếp hợp lý",
        body: [
          "Đặt dụng cụ thường dùng ở vị trí dễ lấy.",
          "Gọn gàng sẽ giúp bạn có động lực tập hơn.",
        ],
      },
    ],
  },

  {
    id: 3,
    slug: "an-truoc-buoi-tap-nhu-the-nao",
    title: "Nên ăn gì trước buổi tập?",
    excerpt:
      "Ăn đúng cách trước khi tập giúp bạn có năng lượng ổn định.",
    category: "Dinh dưỡng",
    cover:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80",
    author: "Admin Nutrition",
    readTime: "6 phút đọc",
    publishedAt: "15/03/2026",
    tags: ["ăn uống", "pre-workout"],
    sections: [
      {
        heading: "Thời gian ăn",
        body: [
          "Nên ăn trước tập 60–120 phút.",
          "Ưu tiên carb và một ít protein.",
        ],
      },
      {
        heading: "Đơn giản là tốt nhất",
        body: [
          "Không cần ăn quá cầu kỳ.",
          "Quan trọng là dễ duy trì.",
        ],
      },
      {
        heading: "Nếu tập sáng",
        body: [
          "Có thể ăn nhẹ như chuối hoặc sữa chua.",
          "Sau tập nên ăn bữa chính đầy đủ.",
        ],
      },
    ],
  },

  {
    id: 4,
    slug: "phuc-hoi-sau-ngay-leg-day",
    title: "Phục hồi sau leg day",
    excerpt:
      "Phục hồi đúng cách giúp bạn quay lại tập nhanh hơn.",
    category: "Phục hồi",
    cover:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=80",
    author: "Admin Recovery",
    readTime: "6 phút đọc",
    publishedAt: "14/03/2026",
    tags: ["phục hồi", "leg day"],
    sections: [
      {
        heading: "Vận động nhẹ",
        body: [
          "Đi bộ nhẹ và uống đủ nước giúp cơ hồi phục tốt hơn.",
        ],
      },
      {
        heading: "Ngủ đủ",
        body: [
          "Giấc ngủ là yếu tố quan trọng nhất.",
        ],
      },
      {
        heading: "Không quá phụ thuộc DOMS",
        body: [
          "Đau cơ không phải lúc nào cũng là dấu hiệu tập tốt.",
        ],
      },
    ],
  },

  {
    id: 5,
    slug: "xu-huong-cardio-thuc-dung-2026",
    title: "Xu hướng cardio 2026",
    excerpt:
      "Cardio ngắn nhưng đều đang trở thành xu hướng.",
    category: "Tin tức",
    cover:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1400&q=80",
    author: "Admin",
    readTime: "5 phút đọc",
    publishedAt: "13/03/2026",
    tags: ["cardio", "xu hướng"],
    sections: [
      {
        heading: "Cardio ngắn",
        body: [
          "15–25 phút mỗi buổi là đủ nếu duy trì đều.",
        ],
      },
      {
        heading: "Ưu tiên sự đều đặn",
        body: [
          "Tập đều quan trọng hơn tập quá sức trong thời gian ngắn.",
        ],
      },
    ],
  },

  {
    id: 6,
    slug: "lap-lich-tap-3-buoi-mot-tuan",
    title: "Lịch tập 3 buổi mỗi tuần",
    excerpt:
      "3 buổi mỗi tuần vẫn đủ để tiến bộ nếu tập đúng cách.",
    category: "Tập luyện",
    cover:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=80",
    author: "Admin Coach Nam",
    readTime: "8 phút đọc",
    publishedAt: "12/03/2026",
    tags: ["lịch tập", "3 buổi"],
    sections: [
      {
        heading: "Chọn kiểu tập phù hợp",
        body: [
          "Full body là lựa chọn tốt cho người bận rộn.",
        ],
      },
      {
        heading: "Ưu tiên bài chính",
        body: [
          "Tập trung vào các bài compound như squat, push, pull.",
        ],
      },
      {
        heading: "Theo dõi tiến bộ",
        body: [
          "Tăng tạ hoặc rep nhỏ mỗi tuần là đã tiến bộ.",
        ],
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string) =>
  blogPosts.find((item) => item.slug === slug);