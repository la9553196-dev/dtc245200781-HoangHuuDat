# De tai 15: He thong Dien dan / Cong dong (Forum)
Mon hoc: Trien khai va Quan tri He thong Phan mem - K23

## Thanh phan he thong
1. **Web App**: Node.js + Express + MySQL
2. **Database Management**: MySQL 8.0 + phpMyAdmin
3. **Reverse Proxy & Security**: Nginx SSL + Hardening Headers
4. **Monitoring Stack**: Prometheus + cAdvisor + Grafana
5. **Logging Stack**: Loki + Promtail

## Huong dan khoi chay
1. Tao SSL Certificate cho Nginx (Self-signed):
   ```bash
   mkdir -p nginx/ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout nginx/ssl/nginx.key \
     -out nginx/ssl/nginx.crt \
     -subj "/CN=localhost/O=TKQT-HTPM/C=VN"
   ```

2. Khoi chay Docker Compose:
   ```bash
   docker compose up -d --build
   ```

3. Truy cap cac dich vu:
   - **Forum Web App**: https://localhost hoặc http://localhost
   - **phpMyAdmin**: http://localhost:8081
   - **Prometheus**: http://localhost:9090
   - **Grafana**: http://localhost:3001 (User: admin / Password trong .env)
   - **Loki**: http://localhost:3100
