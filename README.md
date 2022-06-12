# Cómo ejecutar este proyecto

1. Crear una carpeta llamada Storage en la raiz del proyecto
2. en ./config/env.json cambiar las variables de entorno
    - Para facilitar las cosas, se puede crear una cuenta en MongoDB Atlas Database, crear un Clúster M0 Sandbox y copiar la URL proporcionada por la plataforma en el campo url
    - Todos los campos con la palabra YOURIP deben ser sustituidos por http://localhost:8080
    - los campos con YOURSECRET no tienen porqué ser cambiados para que la app funcione

(el json que debe ser modificado)
     {
    "url":"YOURMONGODBURL",
    "ip":"YOURIP",
    "jwt-secret":"YOURSECRET",
    "cryptr-secret": "YOURSECRET",
    "QR-path": "YOURIP/static/img/",
    "profile-picture-path": "YOURIP/storage/"
    }

ANTES DEL PUNTO 3 ASEGURARSE DE TENER NODE JS INSTALADO EN EL ORDENADOR !!!

3. Una vez que esté todo esto completado, se debe abrir el proyecto con visual studio code. En la linea de comandos escribir npm i package para instalar las dependencias. 
4. Para ejecutar el proyecto: npm start
