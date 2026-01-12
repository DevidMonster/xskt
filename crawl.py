from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from datetime import datetime, timedelta
import json
import time

options = Options()
options.add_argument("--headless=new")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)
wait = WebDriverWait(driver, 30)

BASE_URL = "https://ketqua04.net/so-ket-qua"
results = []
today = datetime.now()

for i in range(300):
    day = today - timedelta(days=i)
    date_str = day.strftime("%d-%m-%Y")

    success = False
    attempts = 0

    while not success and attempts < 3:
        try:
            driver.get(BASE_URL)

            input_date = wait.until(EC.presence_of_element_located((By.NAME, "date")))
            input_date.clear()
            input_date.send_keys(date_str)

            driver.execute_script("kqv1.skq_quick_submit(300);")

            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "phoi-size")))

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
            success = True

        except TimeoutException:
            attempts += 1
            print(f"⚠ Timeout {date_str}, retry {attempts}/3")
            time.sleep(5)

    if not success:
        print(f"❌ Bỏ qua ngày {date_str}")
        results.append({
            "date": date_str,
            "numbers": []
        })

    time.sleep(0.6)

driver.quit()

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Hoàn tất — đã ghi đè data.json")
