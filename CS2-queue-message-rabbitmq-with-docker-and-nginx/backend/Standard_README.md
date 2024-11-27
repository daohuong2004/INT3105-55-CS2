# CASE STUDY 2: Translate Vietnamese PDF file
Dưới đây là một chương trình có nhiệm vụ chuyển file ảnh tiếng Anh sang một file `pdf` tiếng Việt. Các bước xử lý lần lượt bao gồm: chuyển đổi ảnh sang text, dịch tiếng Anh sang tiếng Việt, chuyển đổi nội dung text thành file `pdf`.

**(nên viết tiếng anh) Sample below:**


This a Translate Vietnamese PDF file project that uses Monolithic Architecture . The project is divided into three main components: Image to Text, Text to Vietnamese, and Text. The main functionality of this project is to translate English images into Vietnamese PDF files.
## Architecture

### Overview
This system is designed using **Monolithic Architecture** which obviously is inflexible and inability to scale.
Therefore, to address the aspect of the problem of scalability, we will apply **Pipes and Filters Pattern** which is implemneted by the assistance of RabbitMQ.

This pattern break down the processing required for each stream into a set of separate components (or filters), each performing a single task.
As a result, This system is ensured that we can reuse some specific functionality in other parts of the system without intercepting or modifying the flow of all system. Additionally, we can easily add new functionality by adding new filters without affecting the existing ones.

In addition, we also use **Nginx** as a tool to implement the load balancing and reverse proxy to distribute the load across multiple instances of the system. This ensure that we can scale the system to meet the increasing demand without affecting the performance of the system.
#### Key Components:
- **RabbitMQ** : Message queue play the role of **Pipes** in **Pipes and Filters Pattern**.
- **Tesseract**: A library for Optical Character Recognition (OCR) to recognize text within images.
- **PDFKit** : A library to create a pdf file
- **Google Translate API**: A service to translate text from one language to another.

### Workflow:
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

### Installation
#### Prerequisites

 - npm
 - Node.js
 - Tesseract
 - Docker

#### Step 1: Create docker network
Before starting the system, you need to create Docker network to allow all parts of the system can communicate with each oather.
```bash
docker network create app_network
```
#### Step 2: Run RabbitMQ container
Navigating to RabbitMQ container directory and run the following command to start RabbitMQ container by using this command:
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