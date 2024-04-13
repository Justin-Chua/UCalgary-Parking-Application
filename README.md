# CPSC 471 W2024 Parking Project - Group 14
## Group Members
- Arush Sanghal (30118765)
- Justin Chua (30098941)
- Chiehhan Yang (30110238)
## Project Setup
### Back End
0. Make sure that the latest version of MySQL and XAMPP is installed
1. After installing, navigate to the back_end folder using `back_end`
2. Install the necessary dependency using the following command:
    - 2.1. MySQLClient: `pip install mysqlclient`
    - 2.2. Django REST Framework: `pip install djangorestframework djangorestframework-simplejwt`
3. Ensure that XAMPP is open, and Apache and MySQL are running on port 3306
4. Ensure that models are updated using the command `python manage.py migrate`
5. Start the backend using the command `python manage.py runserver`
6. To view the backend, you have two options:
    - 6.1. Navigate to `127.0.0.1:8000/api/` in the browser to add values manually or view them
    - 6.2. Click on 'Admin' beside MySQL in XAMPP, and view the database on `localhost/phpmyadmin/`

### Front End
0. Make sure that the latest version of Node.js is installed on your computer
1. After installing Node.js, navigate to the front_end folder using `cd front_end`
2. Install all the necessary dependencies using the following commands:
    - 2.1. React: `npm install react`
    - 2.2. React Routers: `npm install react-router-dom@latest`
    - 2.3. Bootstrap: `npm install bootstrap react-bootstrap`
    - 2.4. Bootstrap Icons: `npm install react-bootstrap-icons`
    - 2.5. Leaflet: `npm install leaflet react-leaflet`
    - 2.6. Axios: `npm install axios`
 3. To start the React application, use the command `npm start`
 4. The application will automatically open in a new browser window, on `localhost:3000`

 
