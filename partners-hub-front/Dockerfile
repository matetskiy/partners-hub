FROM node:20.18.1

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli@17.3

COPY . .

RUN npm install

RUN ng build --configuration production

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check"]

