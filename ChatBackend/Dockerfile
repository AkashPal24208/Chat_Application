# 1. Base Image (Node.js ka lightweight version)
FROM node:20-alpine

# 2. Working Directory set karein
WORKDIR /app

# 3. Dependencies cache optimize karne ke liye pehle package files copy karein
COPY package*.json ./

# 4. Production dependencies install karein (devDependencies ignore karne ke liye '--omit=dev' use kar sakte hain)
RUN npm ci --omit=dev

# 5. Baaki ka backend code copy karein
COPY . .

# 6. Backend port expose karein (jo aapne app.js / server.js mein use kiya hai, jaise 5000)
EXPOSE 5000

# 7. Server start karne ki command
CMD ["npm", "start"]