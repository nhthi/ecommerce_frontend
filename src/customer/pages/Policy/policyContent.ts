export type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export const deliverySections: PolicySection[] = [
  {
    title: "Phạm vi giao hàng",
    paragraphs: [
      "NHTHI FIT nhận giao hàng trên toàn quốc thông qua đối tác vận chuyển tiêu chuẩn và các tuyến nội thành ưu tiên tại một số thành phố lớn.",
      "Đơn hàng được xử lý trong giờ hành chính. Các đơn đặt sau 17:00, cuối tuần hoặc ngày lễ sẽ được chuyển sang đợt xử lý tiếp theo.",
      "Với sản phẩm lớn như giàn tạ, ghế tập, máy cardio, bộ phận vận hành có thể liên hệ trước để xác nhận lịch giao và điều kiện nhận hàng thực tế.",
    ],
  },
  {
    title: "Thời gian xử lý và giao dự kiến",
    bullets: [
      "Đơn có sẵn trong kho thường được đóng gói trong 12 đến 24 giờ làm việc.",
      "Nội thành: 1 đến 2 ngày làm việc.",
      "Khu vực tỉnh thành lân cận: 2 đến 4 ngày làm việc.",
      "Khu vực xa, huyện đảo: 4 đến 7 ngày làm việc tùy tuyến vận chuyển.",
    ],
  },
  {
    title: "Giao hàng với sản phẩm có kích thước lớn",
    bullets: [
      "Một số mặt hàng lớn cần xác nhận lại địa chỉ, thang máy, đường vào và khung giờ nhận hàng.",
      "Phí giao và bố trí nhân công có thể thay đổi theo khối lượng và mức độ phức tạp của điểm giao.",
      "Nếu cần hỗ trợ lắp đặt, nhóm vận hành sẽ thông báo trước khi điều phối lịch phù hợp.",
    ],
  },
  {
    title: "Lưu ý khi nhận hàng",
    bullets: [
      "Vui lòng kiểm tra tình trạng thùng hàng, tem niêm phong và mã vận đơn trước khi ký nhận.",
      "Nếu hộp bị móc, rách, ẩm nước hoặc sai sản phẩm, hãy ghi chú với shipper và liên hệ hỗ trợ trong 24 giờ.",
      "Nên quay video mở hộp đối với đơn hàng giá trị cao để dễ đối chiếu nếu phát sinh vấn đề.",
    ],
  },
  {
    title: "Phí giao hàng",
    paragraphs: [
      "Phí giao hàng được hiện rõ tại bước thanh toán dựa trên khu vực, khối lượng và kích thước sản phẩm. Một số chương trình khuyến mại có thể áp dụng freeship theo giá trị đơn hàng.",
      "Trong trường hợp giao nhiều lần do khách thay đổi địa chỉ, thay đổi lịch nhận hoặc không liên lạc được, phụ phí có thể phát sinh sau khi đối tác xác nhận.",
    ],
  },
];

export const paymentSections: PolicySection[] = [
  {
    title: "Hình thức thanh toán",
    bullets: [
      "Thanh toán khi nhận hàng (COD) với đơn đủ điều kiện.",
      "Chuyển khoản ngân hàng theo thông tin xác nhận sau khi đặt hàng.",
      "Cổng thanh toán điện tử như VNPay hoặc QR banking khi hệ thống hỗ trợ.",
      "Một số đơn giá trị cao có thể cần đặt cọc hoặc thanh toán trước một phần.",
    ],
  },
  {
    title: "Xác nhận giao dịch",
    paragraphs: [
      "Ngay sau khi thanh toán thành công, hệ thống sẽ gửi thông báo xác nhận qua giao diện đơn hàng hoặc email đăng ký.",
      "Nếu thanh toán bị trễ, vui lòng đợi 5 đến 15 phút để đối tác cập nhật kết quả. Trong thời gian đó, không nên thanh toán lặp lại nhiều lần cho cùng một đơn.",
    ],
  },
  {
    title: "Lưu ý bảo mật",
    bullets: [
      "Không chia sẻ OTP, mã giao dịch hoặc thông tin thẻ cho người khác.",
      "Chỉ thanh toán qua link, QR và tài khoản do NHTHI FIT cung cấp trong luồng giao dịch chính thức.",
      "Nếu phát hiện giao dịch bất thường, vui lòng tạm dừng thanh toán và liên hệ hỗ trợ ngay lập tức.",
      "Luôn kiểm tra đúng tên người thụ hưởng và nội dung chuyển khoản trước khi xác nhận giao dịch.",
    ],
  },
  {
    title: "Thanh toán cho đơn đặt trước",
    paragraphs: [
      "Với một số mặt hàng sắp về, phiên bản giới hạn hoặc thiết bị đặt theo yêu cầu, shop có thể yêu cầu thanh toán trước một phần để giữ đơn.",
      "Tỷ lệ đặt cọc và thời điểm thanh toán phần còn lại sẽ được nhân viên xác nhận rõ trước khi lên đơn chính thức.",
    ],
  },
  {
    title: "Hoàn tiền",
    paragraphs: [
      "Với đơn hàng đủ điều kiện hoàn, tiền sẽ được xử lý theo hình thức thanh toán ban đầu. Thời gian hoàn tham khảo từ 3 đến 10 ngày làm việc tùy ngân hàng hoặc cổng thanh toán.",
      "Nếu phát sinh trễ hơn dự kiến, khách hàng có thể cung cấp mã giao dịch để nhóm hỗ trợ kiểm tra lại với đối tác thanh toán.",
    ],
  },
];

export const exchangeSections: PolicySection[] = [
  {
    title: "Thời gian đổi trả",
    paragraphs: [
      "Khách hàng có thể yêu cầu đổi hoặc trả trong vòng 7 ngày kể từ ngày nhận hàng đối với sản phẩm còn nguyên tình trạng, đầy đủ phụ kiện và hóa đơn liên quan.",
      "Với thiết bị lớn, shop khuyến khích thông báo sớm trong 24 đến 48 giờ nếu phát hiện lỗi để việc xử lý nhanh và dễ đối chiếu với đơn vị giao nhận.",
    ],
  },
  {
    title: "Trường hợp được hỗ trợ",
    bullets: [
      "Sản phẩm lỗi kỹ thuật từ nhà sản xuất.",
      "Giao sai màu, sai size, sai phiên bản so với đơn đã xác nhận.",
      "Sản phẩm hư hỏng trong quá trình vận chuyển và có bằng chứng khi nhận hàng.",
      "Phụ kiện thiếu, sai số lượng hoặc không đúng mô tả sản phẩm trên trang bán hàng.",
    ],
  },
  {
    title: "Trường hợp từ chối",
    bullets: [
      "Sản phẩm đã qua sử dụng, trầy xước, thiếu phụ kiện hoặc không còn hộp đóng gói cơ bản.",
      "Sản phẩm thuộc nhóm vệ sinh cá nhân, thực phẩm bổ sung hoặc mặt hàng được ghi chú không hỗ trợ đổi trả.",
      "Yêu cầu gửi sau thời hạn hỗ trợ mà không có lý do đặc biệt.",
      "Lỗi phát sinh do lắp đặt sai hướng dẫn, sử dụng sai mục đích hoặc tác động ngoài lực tác động thông thường.",
    ],
  },
  {
    title: "Quy trình xử lý",
    bullets: [
      "Gửi mã đơn hàng, hình ảnh sản phẩm và mô tả vấn đề qua kênh hỗ trợ.",
      "Bộ phận chăm sóc xác nhận tình trạng và hướng dẫn đóng gói, gửi hàng đổi trả nếu cần.",
      "Sau khi đối chiếu, hệ thống sẽ đổi sản phẩm mới hoặc hoàn tiền theo chính sách áp dụng.",
      "Trạng thái xử lý thường được cập nhật trong 1 đến 3 ngày làm việc từ lúc shop nhận đủ thông tin.",
    ],
  },
  {
    title: "Chi phí đổi trả",
    paragraphs: [
      "Nếu lỗi thuộc về shop, chi phí vận chuyển đổi trả sẽ do NHTHI FIT chi trả. Nếu khách muốn đổi sang màu, size hoặc phiên bản khác không do lỗi sản phẩm, phí giao nhận phát sinh có thể áp dụng tùy trường hợp.",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Bao lâu thì đơn hàng được xác nhận?",
    answer: "Phần lớn đơn hàng được xác nhận trong vòng 30 phút đến 4 giờ làm việc. Với đơn thanh toán trước, hệ thống có thể cần thêm ít phút để đối tác cập nhật kết quả.",
  },
  {
    question: "Tôi có thể kiểm tra hàng trước khi thanh toán không?",
    answer: "Bạn có thể kiểm tra tình trạng đóng gói, mã vận đơn và thông tin người nhận trước khi ký nhận. Việc mở hộp kiểm tra chi tiết tùy thuộc quy định của đối tác giao hàng tại thời điểm nhận đơn.",
  },
  {
    question: "Sản phẩm tập gym lớn có hỗ trợ lắp đặt không?",
    answer: "Một số mặt hàng kích thước lớn như ghế tập, giàn tạ, máy cardio có thể được hỗ trợ lắp đặt theo khu vực. Thông tin cụ thể sẽ được thông báo khi xác nhận đơn.",
  },
  {
    question: "Nếu muốn đổi size hoặc đổi màu thì làm thế nào?",
    answer: "Bạn liên hệ hỗ trợ trong thời hạn đổi trả, gửi mã đơn hàng và nhu cầu đổi. Nhóm hỗ trợ sẽ kiểm tra tồn kho và hướng dẫn bước tiếp theo.",
  },
  {
    question: "Lịch tập và khóa học trên web có miễn phí không?",
    answer: "Một số nội dung hướng dẫn cơ bản được mở miễn phí. Các nội dung chuyên sâu hoặc bộ lịch tập đặc biệt có thể được tách riêng theo chương trình của shop.",
  },
  {
    question: "Tôi có thể đặt hàng nếu đang ở tỉnh xa không?",
    answer: "Có. Hệ thống vẫn nhận đơn toàn quốc. Tuy nhiên, thời gian giao với khu vực xa sẽ dài hơn và một số mặt hàng lớn có thể cần xác nhận thêm trước khi giao.",
  },
  {
    question: "COD có áp dụng cho tất cả mặt hàng không?",
    answer: "Không. Một số sản phẩm giá trị cao, sản phẩm đặt trước hoặc đơn có dấu hiệu rủi ro có thể được yêu cầu thanh toán trước một phần hay toàn bộ.",
  },
  {
    question: "Tôi cần làm gì nếu thanh toán rồi nhưng hệ thống chưa cập nhật?",
    answer: "Bạn hãy lưu lại biên lai, mã giao dịch và đợi thêm ít phút. Nếu quá 15 phút vẫn chưa cập nhật, vui lòng gửi mã đơn hàng kèm chứng từ để shop kiểm tra với đối tác.",
  },
];

export const faqHighlights = [
  "Hỗ trợ đơn hàng và thanh toán trong giờ hành chính.",
  "Phản hồi đổi trả thường được xử lý trong 1 đến 3 ngày làm việc.",
  "Lịch tập và nội dung hướng dẫn được cập nhật định kỳ theo từng giai đoạn.",
];