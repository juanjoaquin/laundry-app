# Laundry App: Aplicación de Lavanderia, con panel de usuario y gestión de administrador

Proyecto Full stack realizado con React js, TypeScript para el frontend, Laravel para el backend y MySQL para la base de datos.
Para la validación utilizo JWT aplicandolo desde el backend, y para almacenarlo utilizó LocalStorage. Cuando un usuario realizá un logout, este token es borrado. 
Para los roles lo hicé de forma nátiva desde Laravel, sin utilizar librerias o extensiones, lo hicé como un Middleware, mientras que desde el front, lo autorizó a través de rutas.
Del lado del usuario es parecido a un "e-commerce" donde puede seleccionar la ropa para poder lavar, donde puede borrar los productos, puede cancelar ordenes en un estado de "pending".
Mientras que del lado del administrador, esté se encarga de gestionar las ordenes realizadas por los usuarios y de la lógistica de la entrega de la ropa.
 
# Pasos a seguir para utilizarlo

1. Clonar el repositorio
2. Instalar Vite usando React + TypeScript
3. Una vez creado Laravel con Composer realizar las migraciones con `php artisan migrate`
4. Ejecutar `npm run dev` para la copilación del frontend.
5. Ejecutar `php artisan serve` para levantar el backend. 

# Imagenes del proyecto

![1](https://i.imgur.com/lQozjAK.jpeg)
