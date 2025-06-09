# 🏨 Hotel Booking Management System

Flask web application để quản lý đặt phòng khách sạn với tích hợp Google Sheets và AI.

## ✨ Tính năng

- 📊 Dashboard với thống kê doanh thu
- 📅 Lịch quản lý đặt phòng 
- 🤖 AI trích xuất thông tin từ ảnh
- 📈 Biểu đồ và báo cáo
- 📱 Responsive design
- ☁️ Tích hợp Google Sheets

## 🚀 Deploy lên Koyeb

### Environment Variables cần thiết:

```
FLASK_SECRET_KEY=your_secret_key_here
DEFAULT_SHEET_ID=your_google_sheet_id
WORKSHEET_NAME=BookingManager
MESSAGE_TEMPLATE_WORKSHEET=MessageTemplate
GOOGLE_API_KEY=your_google_ai_api_key
PORT=8080
FLASK_ENV=production
GCP_CREDENTIALS_JSON={"type":"service_account",...your_gcp_json...}
```

### Setup Steps:
1. Fork/Clone repository này
2. Tạo Koyeb service từ GitHub repo
3. Thêm environment variables trên
4. Deploy

## 🔧 Local Development

1. Copy `.env.example` thành `.env`
2. Điền thông tin thực vào `.env`
3. Đặt file `gcp_credentials.json` trong thư mục gốc
4. `pip install -r requirements.txt`
5. `python app.py`

## 📁 Cấu trúc

```
hotel-booking/
├── app.py              # Main Flask application
├── logic.py            # Business logic
├── gcp_helper.py       # Google Cloud helper
├── requirements.txt    # Dependencies
├── Dockerfile          # Container config
├── start.sh           # Startup script
├── templates/         # HTML templates
└── static/           # CSS, JS, images
```

## 🛠️ Troubleshooting

- Check Koyeb logs nếu deployment fail
- Verify environment variables format
- Đảm bảo GCP_CREDENTIALS_JSON là valid JSON

**Always-on deployment trên Koyeb** - Không bao giờ ngủ! 🎉
