# CASE STUDY 2: Translate Vietnamese PDF file

Dưới đây là một chương trình có nhiệm vụ chuyển file ảnh tiếng Anh sang một file `pdf` tiếng Việt. Các bước xử lý lần lượt bao gồm: chuyển đổi ảnh sang text, dịch tiếng Anh sang tiếng Việt, chuyển đổi nội dung text thành file `pdf`.

1. **Image to Text** :

   - **Step 1**: Clients upload image files to the system
   - **Step 2**: Server feed the images to the "Pipe"(RabbitMQ).
   - **Step 3**: RabbitMQ send the images to the "Filter"(Tesseract) for convert images to text.
   - **Step 4**: Tesseract send the text back to RabbitMQ.

2. **Text Translation**:

   - **Step 5**: RabbitMQ send the text to the "Filter"(Google Translate API)
   - **Step 6**: Google Translate API send the translated text back to RabbitMQ.

3. **Text to PDF**:

   - **Step 7**: RabbitMQ send the translated text to the "Filter"(PDFKit)
   - **Step 8**: PDFKit create PDF file then return to clients

```bash
cd backend
```

#### Step 1: Create docker network

```bash
docker network create app_network
```

#### Step 2: Run RabbitMQ container

```bash
docker compose up
```

You can check RabbitMQ Management is running by visiting http://localhost:15672 in your browser.
Check the current container status by using the following command:

```bash
docker ps -a
```

And if you want to stop the container of rabbitmq and delete the container, run:

```bash
docker compose down
```

#### Step 3: Run Nginx container(optional)

If you want to test when the system want to scale up and to duplicate 3 instances of it.
And check how the load balancer redirect requests of users between them.
Firstly, deploying 3 instances of the server using docker. In the root folder, run:

```bash
docker compose up
```

Then, navigating nginx container directory and run the following command to start Nginx container by using this command:

```bash
docker compose up
```

Now you can check the whole system is running by visiting http://localhost in your browser.

#### Step 4: Run backend in dev mode

```bash
npm run dev
```

(backend run on port 3005)

#### Prerequisites(Frontend)

- npm
- Node.js

#### Installation Steps

**Firstly, navigate to frontend folder**

```bash
cd frontend
```

#### Then, Run frontend in dev mode

```bash
npm run dev
```

(frontend run on port 3000)
