# React Native Machine Test – Product Listing App

A mini product listing application built as part of the **React Native Machine Test (4 hours)** with offline support, favorites, and local session handling.

---

## 🚀 Tech Stack
- React Native 0.70+
- TypeScript
- React Navigation
- Redux Toolkit
- AsyncStorage
- Axios
- Clean Folder Structure

---

## 📌 Features

### 🔐 Login Screen
- Email + password validation
- Saves user session using AsyncStorage
- Auto-redirect to Home if already logged in

---

### 🏠 Home Screen (Product List)
- Fetches products from **FakeStore API**
- Displays image, title, and price
- Search bar (client-side filter)
- Pull-to-refresh
- Offline support using cached data
- If offline → loads stored list + shows “Offline Mode Enabled”

---

### 📄 Product Details Screen
- Large product image
- Title, description, category, price
- Add to Favorites button

---

### ⭐ Favorites Screen
- Stores favorites using AsyncStorage
- Works fully offline
- List of saved items
- Remove from favorites

---

### 📡 Offline Support
- Detects network status
- Loads cached product list when offline
- App never crashes offline
- Offline banner displayed on Home screen

---

## 📸 Screenshots

| Screen | Preview |
|--------|---------|
| **Login** | ![Login](https://github.com/user-attachments/assets/d3871110-c17a-4ab0-ab76-fd07aa45a218) |
| **Register** | ![Register](https://github.com/user-attachments/assets/707e6ae4-6abf-4365-bf0b-e5de3dd43692) |
| **Home** | ![Home](https://github.com/user-attachments/assets/dee21fa2-fdb2-40a3-bd19-e5527780de2c) |
| **Product Details** | ![Details](https://github.com/user-attachments/assets/6c697543-c547-4de3-9408-b1c63cf4e1d5) |
| **Favorites** | ![Favorites](https://github.com/user-attachments/assets/77b4241a-9529-4459-a76b-d9a0f624f398) |
| **Profile** | ![Profile](https://github.com/user-attachments/assets/afe4a29e-221b-4700-b388-f65283e38a0e) |


> Place your screenshots inside a `screenshots` folder.

---

## ▶️ Running the Project

### Install dependencies
```sh
npm install

