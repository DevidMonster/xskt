from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import json
import time
import pytz

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 40)

BASE_URL = "https://ketqua04.net/so-ket-qua"
results = []

vn_tz = pytz.timezone("Asia/Ho_Chi_Minh")
today = datetime.now(vn_tz)

for i in range(300):
    day = today - timedelta(days=i)
    date_str = day.strftime("%d-%m-%Y")

    driver.get(BASE_URL)

    input_date = wait.until(EC.presence_of_element_located((By.NAME, "date")))
    input_date.clear()
    input_date.send_keys(date_str)

    driver.execute_script("kqv1.skq_quick_submit(300);")

    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "phoi-size")))
    time.sleep(1)

    script = """
    let arr = [];
    document.querySelectorAll('.phoi-size').forEach(el => {
        const txt = el.innerText.trim();
        if (/^\\d+$/.test(txt)) arr.push(txt);
    });
    return arr;
    """
    data = driver.execute_script(script)

    results.append({
        "date": date_str,
        "numbers": data
    })

    print("✔", date_str, ":", len(data), "số")
    time.sleep(0.6)

driver.quit()

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Hoàn tất — đã ghi đè data.json")
