import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from dotenv import load_dotenv
import json
from functools import lru_cache
from pathlib import Path
import pandas as pd
import plotly
import plotly.express as px
from datetime import datetime, timedelta
import calendar
import base64
import google.generativeai as genai
from io import BytesIO

# --- Cài đặt Chế độ ---
# Đặt thành True để bật thanh công cụ dev và chế độ debug.
# Đặt thành False để chạy ở chế độ production (tắt thanh công cụ).
DEV_MODE = True  # Bật development mode để tự động reload
# --------------------

# Import các hàm logic
from logic import (
    import_from_gsheet, create_demo_data,
    get_daily_activity, get_overall_calendar_day_info,
    extract_booking_info_from_image_content,
    export_data_to_new_sheet,
    append_multiple_bookings_to_sheet,
    delete_booking_by_id, update_row_in_gsheet,
    prepare_dashboard_data, delete_row_in_gsheet,
    delete_multiple_rows_in_gsheet,
    import_message_templates_from_gsheet,
    export_message_templates_to_gsheet
)

# Cấu hình
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

app = Flask(__name__, template_folder=BASE_DIR / "templates", static_folder=BASE_DIR / "static")

# Sử dụng biến DEV_MODE để cấu hình app
app.config['ENV'] = 'production'  # Luôn sử dụng production mode
app.config['DEBUG'] = False  # Luôn tắt debug mode
app.secret_key = os.getenv("FLASK_SECRET_KEY", "a_default_secret_key_for_development")

# Vô hiệu hóa Debug Toolbar - Đã hoàn toàn bị xóa
# KHÔNG import hoặc sử dụng DebugToolbarExtension

@app.context_processor
def inject_dev_mode():
    return dict(dev_mode=DEV_MODE)

@app.context_processor
def inject_pandas():
    return dict(pd=pd)

# --- Lấy thông tin từ .env ---
GCP_CREDS_FILE_PATH = os.getenv("GCP_CREDS_FILE_PATH")
DEFAULT_SHEET_ID = os.getenv("DEFAULT_SHEET_ID")
WORKSHEET_NAME = os.getenv("WORKSHEET_NAME")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
TOTAL_HOTEL_CAPACITY = 4

# --- Khởi tạo ---
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# --- Hàm chính để tải dữ liệu ---
@lru_cache(maxsize=1)
def load_data():
    print("Đang tải dữ liệu đặt phòng từ nguồn...")
    try:
        df = import_from_gsheet(DEFAULT_SHEET_ID, GCP_CREDS_FILE_PATH, WORKSHEET_NAME)
        if df.empty:
            raise ValueError("Sheet đặt phòng trống hoặc không thể truy cập.")
        active_bookings = df[df['Tình trạng'] != 'Đã hủy'].copy()
        print("Tải dữ liệu từ Google Sheet thành công!")
        return df, active_bookings
    except Exception as e:
        print(f"Lỗi tải dữ liệu đặt phòng: {e}. Dùng dữ liệu demo.")
        df_demo, active_bookings_demo = create_demo_data()
        return df_demo, active_bookings_demo

@app.route('/')
def dashboard():
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not start_date_str or not end_date_str:
        today_full = datetime.today()
        start_date = today_full.replace(day=1)
        _, last_day = calendar.monthrange(today_full.year, today_full.month)
        end_date = today_full.replace(day=last_day)
    else:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d')

    df, _ = load_data()
    
    sort_by = request.args.get('sort_by', 'Tháng')
    sort_order = request.args.get('sort_order', 'desc')
    dashboard_data = prepare_dashboard_data(df, start_date, end_date, sort_by, sort_order)

    return render_template('dashboard.html', **dashboard_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5001)), debug=DEV_MODE)
