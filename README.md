# Proyecto Unidad 3
El proyecto consta de una tienda online en la que se tiene un catalogo dinamico que se almacena en localStorage. La pagina consta de un Inicio, Pagina Principal, Pagina de Catalogos, Pagina de Alta de productos nuevo y paginas para mostrar un Carrito de compras y de ticket.

Los archivos estan organizados en HTML, JS y CSS. Existiendo un CSS general para elementos presentes en mas de una pagina y CSS para elementos solo presentes en paginas especificas. Ademas de esto cada pagina consta con su script separado.

## Pagina de Inicio
Para la pagina de inicio se tiene un arreglo de usuarios al cual se compara con los datos que el usuario inserta en el inicio. Si el usuario y contraseña son correctos la pagina redireccionara a la pagina principal. Para verificar si existe un usuario ya iniciado en sesion se utilizan dos variables en localStorage. Una que determina si existe un usuario ingresado y otro que determina el nombre del usuario que inicio sesion. Esto se utilizara para verificar que opciones podra accesar y para mostrarse en la pagina principal.

La verificacion de las variables de inicio de sesion y usuario se utilizan en cada una de las paginas. Si no existe un usuario en sesion se redireccionara a la pagina de inicio y si el usuario no cuenta con permisos de administrador e intentar entrar a una pagina solo para administradores se le direccionara a la pagina principal.

## Pagina principal
En esta pagina es donde se carga el carrito, la calculadora, el catalogo de productos y las demas opciones a las que pueden accesar los usuarios. Como las demas paginas esta verifica si existe un usuario. Por defecto muestra la opcion de Calculadora y Cerrar Sesion y  si verifica que el usuario es administrador agrega las opciones de Catalogo y Usuarios. 

Para los productos se utilizaron elementos de clase card de Bootstrap. Al dar click en los botones para añadir se agregaran al carrito almacenado en el localStorage y se cargaran dentro de un Dropdown menu que se utiliza como carrito en la seccion de arriba. Al dar click en Pagar dentro del carrito se direcciona a la pagina de Checkout.

Para mostrar la calculadora dentro de la misma pagina se muestra un iframe al hacer click en la opcion del menu.
## Pagina de Checkout

Aqui se mostrara el subtotal por producto y total y un boton para realizar el pago. Para regresar a la ventana principal se puede hacer click en el banner de la pagina.

## Pagina de Ticket

En esta se muestra un mensaje de agradecimiento y el listado de los articulos comprados, asi como un subtotal y total de la compra. De igual manera, se podra regresar atraves de un boton para seguir comprando o haciendo click en el banner. Al cargar esta pagina se vacia el carrito almacenado en el 
