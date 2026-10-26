# Node 18: de oudste LTS waarvoor canvas, sharp en html-pdf (phantomjs) nog kant-en-klare binaries hebben.
FROM node:18.20.8-bookworm
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p logs public temp
EXPOSE 3001
CMD ["node", "index.js"]
