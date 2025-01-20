#!/bin/bash

# Путь до каталогов
ANGULAR_PROJECT_DIR="$(pwd)/partners-hub-front"
FASTAPI_PROJECT_DIR="$(pwd)/partners-hub-backend"
FASTAPI_PORT=8000  # Порт для FastAPI

# Проверка существования Angular проекта
echo "Используем Node.js версии v20.18.1..."
nvm use v20.18.1

if [ ! -d "$ANGULAR_PROJECT_DIR" ]; then
  echo "Angular проект не найден в $ANGULAR_PROJECT_DIR"
  exit 1
fi

# Часть для фронтенда (Angular)
echo "Проверка для Angular проекта..."

cd "$ANGULAR_PROJECT_DIR"

if [ ! -d "node_modules" ]; then
  echo "Устанавливаю зависимости для Angular..."
  npm install
else
  echo "Зависимости для Angular уже установлены..."
fi

echo "Сборка Angular проекта..."
npm run build -- --configuration=development --project=showcase-front  # Сборка для разработки

read -p "Запустить сервер Angular в режиме разработки? (y/n): " choice
if [ "$choice" == "y" ]; then
  echo "Запуск сервера Angular в режиме разработки..."
  npm start &  # Запуск в фоновом режиме
else
  echo "Запуск сервера Angular в режиме продакшн..."
  npm run build -- --configuration=production --project=showcase-front  # Сборка для продакшн
  echo "Проект собран в директории dist/showcase-front"
fi

# Часть для бэкенда (FastAPI)
echo "Проверка для FastAPI проекта..."

cd "$FASTAPI_PROJECT_DIR"

# Проверка наличия виртуального окружения для FastAPI
if [ ! -d "venv" ]; then
  echo "Виртуальное окружение не найдено. Создаю новое..."
  python3 -m venv venv
  echo "Устанавливаю зависимости для FastAPI..."
  source venv/bin/activate
  pip install --upgrade pip
  pip install fastapi uvicorn sqlalchemy pydantic python-jose[cryptography] passlib[bcrypt] psycopg2 python-multipart pydantic[email]
  echo "Проверка и установка зависимости bcrypt..."
  pip install --upgrade bcrypt
  pip install --upgrade passlib
else
  echo "Использую существующее виртуальное окружение для FastAPI..."
  source venv/bin/activate
fi

echo "Проверка зависимостей для компиляции bcrypt..."
if ! python -c "import bcrypt" &> /dev/null; then
  echo "Ошибка при импорте bcrypt. Устанавливаю дополнительные зависимости..."
  sudo apt-get install -y build-essential libffi-dev python3-dev
  pip install bcrypt==3.2.0
fi

# Проверка, занят ли порт
if lsof -i :$FASTAPI_PORT &> /dev/null; then
  echo "Порт $FASTAPI_PORT уже используется. Освобождаю порт..."
  PIDS=$(lsof -ti :$FASTAPI_PORT)  # Получение PID всех процессов
  for PID in $PIDS; do
    echo "Завершаю процесс $PID, использующий порт $FASTAPI_PORT..."
    kill -9 "$PID"
  done
  echo "Все процессы, использующие порт $FASTAPI_PORT, завершены."
fi

# Запуск FastAPI сервера
echo "Запуск FastAPI сервера..."
uvicorn main:app --reload --host 127.0.0.1 --port $FASTAPI_PORT
