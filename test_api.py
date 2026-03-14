import requests
import json

url = "http://localhost:8001/api/sip"
data = {
    "monthly_investment": 5000,
    "annual_return_rate": 12,
    "years": 10
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response Body: {json.dumps(response.json(), indent=2)}")
